require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// Configure CORS
app.use(cors({
  origin: ['https://www.exesenergy.co', 'https://exesenergywebsite.vercel.app/'],
  methods: ['GET', 'POST'],
}));

// Middleware
app.use(bodyParser.json());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_HOST,
    pass: process.env.HOST_PASSWORD,
  },
});

// Email route
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const mailOptions = {
    from: process.env.EMAIL_HOST,
    to: process.env.RECEPIENT_EMAIL,
    subject: `Contact Form Submission: ${subject}`,
    text: `You have a new message from your contact form:

    Name: ${name}
    Email: ${email}

    Message:
    ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
});

// Export for Vercel
module.exports = (req, res) => {
  app(req, res);
};
