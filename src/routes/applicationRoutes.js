const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const protect = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  applyJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus
} = require("../controllers/applicationController");

// Apply to job (candidate only)
router.post(
  "/",
  protect,
  authorizeRoles("candidate"),
  upload.single("resume"),
  applyJob
);

// Get my applications
router.get("/my", protect, authorizeRoles("candidate"), getMyApplications);

// Get applications for a specific job (recruiter only)
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter"),
  getApplicationsForJob
);

// Update application status (recruiter only)
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);

module.exports = router;