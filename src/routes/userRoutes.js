const express = require('express');
const router = express.Router();

const {
    testUser,
    registerUser,
    loginUser
} = require('../controllers/userController');

// Test Route
router.get('/test', testUser);

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

module.exports = router;
