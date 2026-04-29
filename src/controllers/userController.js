const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ================= MAIL CONFIG =================
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});
// ================= TEST =================
exports.testUser = (req, res) => {
  res.json({ message: "User controller is working" });
};

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    let { name, email, password, role, companyName, companyWebsite, areaOfInterest } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      companyName: role === "recruiter" ? companyName || "" : "",
      companyWebsite: role === "recruiter" ? companyWebsite || "" : "",
      areaOfInterest: role === "candidate" ? (areaOfInterest || []) : [],
      verificationToken: token,
      isVerified: false
    });

    const verificationLink = `https://devhire-backend-1.onrender.com/api/users/verify/${token}`;

    try {
      await transporter.sendMail({
        from: `"DevHire" <${process.env.BREVO_USER}>`,
        to: user.email,
        subject: "Verify your email",
        html: `
          <h2>Email Verification</h2>
          <p>Click below to verify:</p>
          <a href="${verificationLink}">Verify Email</a>
        `
      });
      console.log("Email sent:", user.email);
    } catch (err) {
      console.log("Email error:", err);
    }

    res.status(201).json({
      message: "Registration successful. Check your email."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= VERIFY =================
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    res.redirect("https://devhireweb.vercel.app/login?verified=true");

  } catch (error) {
    console.error(error);
    res.status(500).send("Verification failed");
  }
};

// ================= PROFILE =================
exports.getMyProfile = async (req, res) => {
  res.json({ user: req.user });
};

// ================= OPTIONAL (SAFE) =================
exports.uploadResume = async (req, res) => {
  res.json({ message: "Resume upload working" });
};