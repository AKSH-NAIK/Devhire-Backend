const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ---- TEST CONTROLLER ----
exports.testUser = (req, res) => {
    res.json({
        message: "User controller is working"
    });
};

// ---- REGISTER USER ----
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, companyWebsite, areasOfInterest } = req.body;

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

        // 4. Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            companyWebsite: role === "recruiter" ? companyWebsite : "",
            areasOfInterest: role === "candidate" ? areasOfInterest : []
        });

        // 5. Response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyWebsite: user.companyWebsite,
                areasOfInterest: user.areasOfInterest
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

        // 4. Create token (include role for RBAC later)
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
                areasOfInterest: user.areasOfInterest
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
