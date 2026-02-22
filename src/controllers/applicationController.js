const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");


exports.applyJob = async (req, res) => {
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
            user: req.user._id,
            resume: req.file ? req.file.path : null
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

// Get applications for a specific job (Recruiter only)
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

        // Make sure recruiter owns this job
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


// Get my applications
exports.getMyApplications = async (req, res) => {
    try {
        const apps = await Application.find({ user: req.user._id })
            .populate("job");

        // 🔥 Filter out deleted jobs (job === null)
        const validApps = apps.filter(app => app.job !== null);

        res.json(validApps);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
