const Job = require('../models/Job');

exports.createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user._id // Ensure req.user is populated by auth middleware
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
exports.getJobs = async (req, res) => {
    const jobs = await Job.find();
    res.json({ jobs });
};
