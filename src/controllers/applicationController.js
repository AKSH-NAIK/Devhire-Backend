const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");

// =============================
// Apply to Job
// =============================
exports.applyJob = async (req, res) => {
  try {

    console.log("===== APPLY JOB CONTROLLER HIT =====");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { jobId, phone, coverLetter } = req.body;

    // Validate Job ID
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      job: jobId,
      user: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this job"
      });
    }

    // Resume must exist
    if (!req.file) {
      return res.status(400).json({
        message: "Resume is required"
      });
    }

    // Cloudinary resume URL
    const resumeUrl = req.file.path;

    console.log("Resume uploaded to Cloudinary:", resumeUrl);

    // Create application
    const application = await Application.create({
      job: jobId,
      user: req.user._id,
      phone,
      coverLetter,
      resume: resumeUrl,
      status: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (error) {

    console.error("APPLICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while applying",
      error: error.message
    });

  }
};



// =============================
// Recruiter: Get Applications For A Job
// =============================
exports.getApplicationsForJob = async (req, res) => {
  try {

    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check recruiter owns job
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("user", "name email");

    res.json({
      success: true,
      total: applications.length,
      applications
    });

  } catch (error) {

    console.error("GET APPLICATIONS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};



// =============================
// Candidate: Get My Applications
// =============================
exports.getMyApplications = async (req, res) => {
  try {

    const applications = await Application.find({
      user: req.user._id
    }).populate({
      path: "job",
      populate: {
        path: "createdBy",
        select: "name email"
      }
    });

    // Remove applications for deleted jobs
    const validApplications = applications.filter(app => app.job !== null);

    res.json({
      success: true,
      total: validApplications.length,
      applications: validApplications
    });

  } catch (error) {

    console.error("MY APPLICATIONS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};



// =============================
// Recruiter: Update Application Status
// =============================
exports.updateApplicationStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "shortlisted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const application = await Application.findById(id).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    // Check recruiter owns job
    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    application.status = status;

    await application.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      application
    });

  } catch (error) {

    console.error("STATUS UPDATE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};  