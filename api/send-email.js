const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.HOST_EMAIL,
    pass: process.env.HOST_PASSWORD,
  },
});

app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const mailOptions = {
    from: process.env.HOST_EMAIL,
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
    res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
});

// Export for Vercel
module.exports = (req, res) => {
  app(req, res);
};
