const Application = require("../models/Application");

// Apply to job
exports.applyJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        const application = await Application.create({
            job: jobId,
            user: req.user._id
        });

        res.status(201).json({
            message: "Applied successfully",
            application
        });

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

        res.json(apps);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
