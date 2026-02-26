require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MONGODB CONNECTION
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// ===============================
// CONTACT SCHEMA
// ===============================
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model("Contact", contactSchema);

// ===============================
// MIDDLEWARE
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// NODEMAILER SETUP
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ===============================
// ROUTES
// ===============================

// Test route
app.get("/api", (req, res) => {
  res.json({ message: "Backend is working 🚀" });
});

// Contact route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 1️⃣ Save to MongoDB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // 2️⃣ Send Email to YOU
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Portfolio Contact Message",
      html: `
        <h3>New Message Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    });

    // 3️⃣ Send Confirmation to User
    await transporter.sendMail({
      from: `"Steve P Samuel" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Contacting Me!",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for reaching out. I have received your message and will get back to you soon.</p>
        <br>
        <p>Best Regards,<br>Steve P Samuel</p>
      `
    });

    res.status(200).json({ message: "Message sent successfully!" });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});