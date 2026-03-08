const mongoose = require("mongoose");
const Job = require("../models/Job");


// ================= CREATE JOB =================
exports.createJob = async (req, res) => {
  try {

    const { title, description, location, salary, type, requirements, company } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      type,
      requirements,
      company: company || req.user.companyName || req.user.name,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ================= GET ALL JOBS =================
exports.getJobs = async (req, res) => {
  try {

    const { search, location, page = 1, limit = 5 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ================= RECRUITER JOBS =================
exports.getRecruiterJobs = async (req, res) => {
  try {

    const jobs = await Job.find({
      createdBy: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      total: jobs.length,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ================= GET SINGLE JOB =================
exports.getJobById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Job ID"
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.json(job);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ================= UPDATE JOB =================
exports.updateJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ================= DELETE JOB =================
exports.deleteJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};