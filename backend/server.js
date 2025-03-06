require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path'); // Add this for path handling
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files from public/

let orders = [];

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Checkout endpoint
app.post('/api/checkout', (req, res) => {
    const { name, email, address, cart, paymentMethod, orderId } = req.body;
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const order = { orderId, name, email, address, cart, paymentMethod, total, status: 'Pending' };
    orders.push(order);

    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Order Confirmation - ${orderId}`,
        text: `Dear ${name},\n\nThank you for your order!\nOrder ID: ${orderId}\nTotal: $${total.toFixed(2)}\n\nRegards,\nE-Shop Team`
    };

    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Order - ${orderId}`,
        text: `New order from ${name}:\nOrder ID: ${orderId}\nEmail: ${email}\nTotal: $${total.toFixed(2)}`
    };

    Promise.all([transporter.sendMail(userMailOptions), transporter.sendMail(adminMailOptions)])
        .then(() => res.json({ success: true, orderId }))
        .catch(error => {
            console.error('Email error:', error);
            res.status(500).json({ success: false, error: 'Failed to send emails' });
        });
});

// Order tracking endpoint
app.get('/api/order/:orderId', (req, res) => {
    const order = orders.find(o => o.orderId === req.params.orderId);
    if (order) res.json(order);
    else res.status(404).json({ success: false, error: 'Order not found' });
});

// Contact endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields required' });
    }
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact from ${name}`,
        text: `From: ${name} <${email}>\n\nMessage:\n${message}`
    };
    transporter.sendMail(mailOptions)
        .then(() => res.json({ success: true, message: 'Message sent' }))
        .catch(error => {
            console.error('Contact email error:', error);
            res.status(500).json({ success: false, error: 'Failed to send message' });
        });
});

// Fallback route to serve index.html for root requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));