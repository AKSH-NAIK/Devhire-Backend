const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../config/multer");

const {
  testUser,
  registerUser,
  loginUser,
  getMyProfile,
  verifyEmail,
  uploadResume
} = require('../controllers/userController');

// Test
router.get('/test', testUser);

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Helpful GET login
router.get('/login', (req, res) => {
  res.status(405).json({
    message: "Use POST for login"
  });
});

// Verify email
router.get('/verify/:token', verifyEmail);

// Resume upload (now SAFE)
router.put(
  "/upload-resume",
  auth,
  authorizeRoles("candidate"),
  upload.single("resume"),
  uploadResume
);

// Profile
router.get('/me', auth, getMyProfile);

module.exports = router;