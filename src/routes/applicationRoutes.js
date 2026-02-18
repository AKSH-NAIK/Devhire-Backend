const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const { applyJob, getMyApplications , getApplicationsForJob } = require("../controllers/applicationController");

// Apply to job (candidate only)
router.post("/", protect, authorizeRoles("candidate"), applyJob);

// Get my applications
router.get("/my", protect, authorizeRoles("candidate"), getMyApplications);

// Get applications for a specific job (recruiter only)
router.get("/job/:jobId", protect, authorizeRoles("recruiter"), getApplicationsForJob);


module.exports = router;
