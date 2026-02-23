const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); 

// 1. Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Payment Intent Route (For Stripe)
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, 
            currency: 'usd',
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 3. Email Receipt Route
app.post('/send-receipt', async (req, res) => {
    const { email, total, items } = req.body;

    // Use Environment Variables for security
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        }
    });

    const mailOptions = {
        from: `"Lumora Lab" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Lumora Collection Receipt',
        html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
                <h1 style="color: #2563eb;">LUMORA.</h1>
                <p>Order processed successfully.</p>
                <hr>
                <p><strong>Items:</strong> ${items}</p>
                <p><strong>Total:</strong> ${total}</p>
                <p>Thank you for choosing premium automotive care.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Receipt Sent');
    } catch (error) {
        console.error("Mail Error:", error);
        res.status(500).send('Failed to send email');
    }
});

// 4. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Lumora engine running on port ${PORT}`);
    
try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
    res.status(200).send('Receipt Sent');
} catch (error) {
    console.error("DETAILED MAIL ERROR:", error.message); // This will show the exact reason in Render logs
    res.status(500).send('Email failed: ' + error.message);
}