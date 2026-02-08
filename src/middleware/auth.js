const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer')) {
            return res.status(401).json({
                message: "No token, authorization denied"
            });
        }

        const token = header.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        next();

    } catch (error) {
        res.status(401).json({
            message: "Token is not valid"
        });
    }
};
