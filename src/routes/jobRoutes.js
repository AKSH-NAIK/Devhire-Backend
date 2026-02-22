const express = require('express');
const router = express.Router();

const protect = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
} = require('../controllers/jobController');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Recruiter only routes
router.post("/", protect, authorizeRoles("recruiter"), createJob);
router.put('/:id', protect, authorizeRoles("recruiter"), updateJob);
router.delete('/:id', protect, authorizeRoles("recruiter"), deleteJob);

module.exports = router;