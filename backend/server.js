require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('../'));

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

let orders = [];

// Checkout endpoint (unchanged from previous)
app.post('/api/checkout', (req, res) => {
    const { name, email, address, cart, paymentMethod, orderId } = req.body;
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const order = { orderId, name, email, address, cart, paymentMethod, total, status: 'Pending' };
    orders.push(order);

    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Order Confirmation - ${orderId}`,
        text: `Dear ${name},\n\nThank you for your order! Here are the details:\nOrder ID: ${orderId}\nItems:\n${cart.map(item => `  - ${item.product.name} x ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}\nTotal: $${total.toFixed(2)}\n\nDelivery Address: ${address}\nPayment Method: ${paymentMethod === 'cod' ? 'Payment on Delivery' : 'Bank Transfer'}\n${paymentMethod === 'cod' ? 'Please have the cash ready upon delivery.' : 'Please transfer to: E-Shop Bank, Account: 1234-5678-9012, Routing: 987654321, Reference: ' + orderId}\n\nRegards,\nE-Shop Team`
    };

    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Order Received - ${orderId}`,
        text: `New order from ${name}:\n\nOrder ID: ${orderId}\nCustomer Email: ${email}\nDelivery Address: ${address}\nItems:\n${cart.map(item => `  - ${item.product.name} x ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}\nTotal: $${total.toFixed(2)}\nPayment Method: ${paymentMethod === 'cod' ? 'Payment on Delivery' : 'Bank Transfer'}\n${paymentMethod === 'bankTransfer' ? 'Awaiting payment confirmation.' : 'Prepare for COD delivery.'}`
    };

    Promise.all([transporter.sendMail(userMailOptions), transporter.sendMail(adminMailOptions)])
        .then(() => res.json({ success: true, orderId }))
        .catch(error => {
            console.error('Email error:', error);
            res.status(500).json({ success: false, error: 'Failed to send emails' });
        });
});

app.get('/api/order/:orderId', (req, res) => {
    const order = orders.find(o => o.orderId === req.params.orderId);
    if (order) res.json(order);
    else res.status(404).json({ error: 'Order not found' });
});

// Contact endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Message from ${name}`,
        text: `From: ${name} <${email}>\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions)
        .then(() => res.json({ success: true }))
        .catch(error => {
            console.error('Contact email error:', error);
            res.status(500).json({ success: false, error: 'Failed to send message' });
        });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));