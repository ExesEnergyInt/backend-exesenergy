require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// Middleware for JSON parsing
app.use(bodyParser.json());

// Configure CORS
app.use(
  cors({
    origin: [
      "https://www.exesenergy.co",
      "https://exesenergywebsite.vercel.app/",
      // "http://localhost:3000", // Allow local testing
    ],
    methods: ["GET", "POST"],
  })
);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_HOST, // Sender's email from environment variable
    pass: process.env.HOST_PASSWORD, // Sender's password from environment variable
  },
});

// Verify Nodemailer configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer transporter error:", error);
  } else {
    console.log("Nodemailer transporter is configured correctly.");
  }
});

// Email route
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate request body
  if (!name || !email || !subject || !message) {
    console.log("Validation failed:", { name, email, subject, message });
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
    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error.message || error);
    res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
});

// Export app for Vercel deployment
module.exports = app;
