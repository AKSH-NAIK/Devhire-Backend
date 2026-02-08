const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    testUser,
    registerUser,
    loginUser,
    getMyProfile,
} = require('../controllers/userController');

// Test Route
router.get('/test', testUser);

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Get My Profile
router.get('/me', auth, getMyProfile);

module.exports = router;
