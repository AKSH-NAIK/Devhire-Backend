const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const { applyJob, getMyApplications } = require("../controllers/applicationController");

// Apply to job (candidate only)
router.post("/", protect, authorizeRoles("candidate"), applyJob);

// Get my applications
router.get("/my", protect, authorizeRoles("candidate"), getMyApplications);

module.exports = router;
