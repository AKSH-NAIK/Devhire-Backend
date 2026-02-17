const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");


exports.applyJob = async (req, res) => {
    console.log("APPLY CONTROLLER HIT");

    try {
        const { jobId } = req.body;   
        console.log("jobId:", jobId);

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            user: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied to this job"
            });
        }

        const application = await Application.create({
            job: jobId,
            user: req.user._id
        });

        return res.status(201).json({
            message: "Applied successfully",
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


// Get my applications
exports.getMyApplications = async (req, res) => {
    try {
        const apps = await Application.find({ user: req.user._id })
            .populate("job");

        res.json(apps);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
