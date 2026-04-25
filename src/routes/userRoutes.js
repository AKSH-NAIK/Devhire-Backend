const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware"); 
const upload = require("../config/multer");
const { uploadResume } = require("../controllers/userController");
const { verifyEmail } = require("../controllers/userController");
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

// Helpful feedback for GET /login
router.get('/login', (req, res) => {
    res.status(405).json({
        message: "To login, please send a POST request with email and password.",
        hint: "Are you trying to access this via a browser? Login requires a POST request from a client like Postman or a frontend application."
    });
});
// Verifying email token 
router.get("/verify/:token", verifyEmail);


// Upload Resume
router.put(
  "/upload-resume",
  auth,
  authorizeRoles("candidate"),
  upload.single("resume"),
  uploadResume
);

// Get My Profile
router.get('/me', auth, getMyProfile);

module.exports = router;
