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

// =============================
// Candidate: Apply to a job
// =============================
router.post(
  "/apply",
  protect,
  authorizeRoles("candidate"),
  upload.single("resume"),
  (req, res, next) => {
    console.log("Apply route hit");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    next();
  },
  applyJob
);

// =============================
// Candidate: Get my applications
// =============================
router.get(
  "/my",
  protect,
  authorizeRoles("candidate"),
  getMyApplications
);

// =============================
// Recruiter: Get applications for a job
// =============================
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter"),
  getApplicationsForJob
);

// =============================
// Recruiter: Update application status
// =============================
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);

module.exports = router;