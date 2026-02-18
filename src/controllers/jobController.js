const mongoose = require("mongoose");
const Job = require('../models/Job');


exports.createJob = async (req, res) => {
  try {
    const { title, description, location, company, salary } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      company,
      salary,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get single job
exports.getJobById = async (req, res) => {
    try {

        const { id } = req.params;

        // ✅ Check if valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Job ID format"
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


// Update job
exports.updateJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json({ message: "Job updated", job: updated });
};

// Delete job
exports.deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
};
exports.getJobs = async (req, res) => {
    const { search, location, page = 1, limit = 5 } = req.query;

    let query = {};

    // Search by title or company
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } }
        ];
    }

    // Filter by location
    if (location) {
        query.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        jobs
    });
};