// server.js
const express = require('express');
const stripe = require('stripe')('your_stripe_secret_key'); // Get from stripe.com
const nodemailer = require('nodemailer');
const app = express();

app.use(express.static('public'));
app.use(express.json());

// 1. Payment Route
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // in cents (e.g., $89.00 is 8900)
        currency: 'usd',
    });
    res.send({ clientSecret: paymentIntent.client_secret });
});

// 2. Email Route
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'your-email@gmail.com', pass: 'your-app-password' }
});

app.post('/send-receipt', (req, res) => {
    const { email, orderDetails } = req.body;
    const mailOptions = {
        from: 'Lumora Lab <your-email@gmail.com>',
        to: email,
        subject: 'Your Lumora Collection Receipt',
        html: `<h1>Thanks for your order!</h1><p>Your items: ${orderDetails}</p>`
    };
    
    transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).send(error.toString());
        res.send('Receipt Sent');
    });
});
const path = require('path');

// This tells Express to serve all your static files (html, css, js)
app.use(express.static(__dirname));

// This specifically tells Express to send index.html when someone visits "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Lumora engine running on port ${PORT}`);
});