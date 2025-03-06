require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('../')); // Serve front-end files from root directory

// Nodemailer setup (using Gmail as an example; replace with your SMTP service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // App-specific password (not regular password)
    }
});

// Store orders (in-memory for simplicity; use a database like MongoDB in production)
let orders = [];

// Endpoint to handle checkout
app.post('/api/checkout', (req, res) => {
    const { name, email, address, cart, paymentMethod, orderId } = req.body;
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = { orderId, name, email, address, cart, paymentMethod, total, status: 'Pending' };
    orders.push(order);

    // User email
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Order Confirmation - ${orderId}`,
        text: `
Dear ${name},

Thank you for your order! Here are the details:
Order ID: ${orderId}
Items:
${cart.map(item => `  - ${item.product.name} x ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}
Total: $${total.toFixed(2)}

Delivery Address: ${address}
Payment Method: ${paymentMethod === 'cod' ? 'Payment on Delivery' : 'Bank Transfer'}

${paymentMethod === 'cod' ? 'Please have the cash ready upon delivery.' : 'Please transfer to: E-Shop Bank, Account: 1234-5678-9012, Routing: 987654321, Reference: ' + orderId}

Regards,
E-Shop Team
        `
    };

    // Admin email
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL, // Your admin email
        subject: `New Order Received - ${orderId}`,
        text: `
New order from ${name}:

Order ID: ${orderId}
Customer Email: ${email}
Delivery Address: ${address}
Items:
${cart.map(item => `  - ${item.product.name} x ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}
Total: $${total.toFixed(2)}
Payment Method: ${paymentMethod === 'cod' ? 'Payment on Delivery' : 'Bank Transfer'}

${paymentMethod === 'bankTransfer' ? 'Awaiting payment confirmation.' : 'Prepare for COD delivery.'}
        `
    };

    // Send emails
    Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(adminMailOptions)
    ])
    .then(() => res.json({ success: true, orderId }))
    .catch(error => {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: 'Failed to send emails' });
    });
});

// Endpoint for order tracking
app.get('/api/order/:orderId', (req, res) => {
    const order = orders.find(o => o.orderId === req.params.orderId);
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));