const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");


// =============================
// Apply to Job
// =============================
exports.applyJob = async (req, res) => {
  try {
    const { jobId, phone, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

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

    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const application = await Application.create({
      job: jobId,
      user: req.user._id,
      phone,
      coverLetter,
      resume: req.file.path,
      status: "pending"   // ✅ Explicit default
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      message: "Server error",
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

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("user", "name email");

    res.json(applications);

  } catch (error) {
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

    const applications = await Application.find({ user: req.user._id })
      .populate({
        path: "job",
        populate: {
          path: "createdBy",
          select: "name email"
        }
      });

    // Filter deleted jobs
    const validApps = applications.filter(app => app.job !== null);

    res.json(validApps);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// =============================
// Recruiter: Update Status
// =============================
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: "Status updated successfully",
      application
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};