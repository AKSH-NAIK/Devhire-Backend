const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//  Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ---- TEST CONTROLLER ----
exports.testUser = (req, res) => {
  res.json({ message: "User controller is working" });
};

// ---- REGISTER USER ----
exports.registerUser = async (req, res) => {
  try {
    console.log("===== REGISTER REQUEST BODY =====");
    console.log(req.body);

    let { name, email, password, role, companyName, companyWebsite, areaOfInterest } = req.body;

    //  Validation
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });
    if (!role) return res.status(400).json({ message: "Role is required" });

    email = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token
    const token = crypto.randomBytes(32).toString("hex").trim();
    console.log(" TOKEN SAVED:", token);

    // Create user
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

    // Verification link
    const verificationLink = `https://devhire-backend-1.onrender.com/api/users/verify/${token}`;

    //  Send email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify your email",
        html: `
          <h3>Email Verification</h3>
          <p>Click the link below to verify your account:</p>
          <a href="${verificationLink}">Verify Email</a>
        `
      });

      console.log(" EMAIL SENT TO:", user.email);
      console.log("🔗 LINK:", verificationLink);

    } catch (mailError) {
      console.error("EMAIL ERROR:", mailError);
    }

    // Response
    res.status(201).json({
      message: "Registration successful. Verification email sent.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ---- LOGIN USER ----
exports.loginUser = async (req, res) => {
  try {
    console.log("===== LOGIN REQUEST BODY =====");
    console.log(req.body);

    let { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //  Block unverified users
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
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ---- VERIFY EMAIL ----
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    console.log("===== VERIFY HIT =====");
    console.log(" TOKEN FROM URL:", token);

    const user = await User.findOne({ verificationToken: token });

    console.log(" USER FOUND:", user);

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    console.log("USER VERIFIED");

    //  Redirect to frontend
    res.redirect("https://devhireweb.vercel.app/login?verified=true");

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).send("Verification failed");
  }
};

// ---- GET PROFILE ----
exports.getMyProfile = async (req, res) => {
  res.json({ user: req.user });
};