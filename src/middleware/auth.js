const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const header = req.headers.authorization;

        // 1️⃣ Check if token exists
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "No token, authorization denied"
            });
        }

        // 2️⃣ Extract token
        const token = header.split(' ')[1];

        // 3️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4️⃣ Find user & attach to request
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token is not valid"
        });
    }
};
