const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  createJob,
  getJobs,
  getRecruiterJobs,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobController");




// Get all jobs (job seekers)
router.get("/", getJobs);


// Get jobs created by logged-in recruiter
router.get("/my-jobs", protect, authorizeRoles("recruiter"), getRecruiterJobs);




// Get single job
router.get("/:id", getJobById);



// Create job
router.post("/", protect, authorizeRoles("recruiter"), createJob);

// Update job
router.put("/:id", protect, authorizeRoles("recruiter"), updateJob);

// Delete job
router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);


module.exports = router;