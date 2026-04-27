const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// ---- TEST CONTROLLER ----
exports.testUser = (req, res) => {
    res.json({
        message: "User controller is working"
    });
};

// ---- REGISTER USER ----
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, companyName, companyWebsite, areaOfInterest } = req.body;

        // 1. Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password, and role are required"
            });
        }

        // 2. Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Generate verification token
        const token = crypto.randomBytes(32).toString("hex");

        // 5. Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            companyName: role === "recruiter" ? companyName : "",
            companyWebsite: role === "recruiter" ? companyWebsite : "",
            areaOfInterest: role === "candidate" ? areaOfInterest : [],
            verificationToken: token
        });
        const verificationLink = `${process.env.CLIENT_URL}/verify/${token}`;

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
        } catch (mailError) {
            console.error("Error sending verification email:", mailError);
            // We don't return 500 here so the user is still registered
        }

        // 6. Response
        res.status(201).json({
            message: "Registration successful. Verification email sent.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyName: user.companyName,
                companyWebsite: user.companyWebsite,
                areaOfInterest: user.areaOfInterest
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ---- LOGIN USER ----
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields required"
            });
        }

        // 2. Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // 4. Check if verified
        if (!user.isVerified) {
            return res.status(401).json({
                message: "Please verify your email before logging in"
            });
        }

        // 5. Create token (include role for RBAC later)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 5. Response
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyName: user.companyName,
                companyWebsite: user.companyWebsite,
                areaOfInterest: user.areaOfInterest
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ---- GET MY PROFILE ----
exports.getMyProfile = async (req, res) => {
    res.json({
        user: req.user
    });
};
// ---- UPLOAD RESUME ----
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const user = await User.findById(req.user._id);

        user.resume = req.file.path; // store file path
        await user.save();

        res.json({
            message: "Resume uploaded successfully",
            resume: user.resume
        });

    } catch (error) {
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

    // 1. Find user by token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    // 2. Update user
    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    // 3. Response
    res.json({
      message: "Email verified successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};