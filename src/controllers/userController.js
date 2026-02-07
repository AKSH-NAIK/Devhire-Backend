exports.testUser = (req, res) => {
    res.json({
        message: "User controller is working"
    });
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields required"
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Save user in DB
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 5. Response (without password)
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
