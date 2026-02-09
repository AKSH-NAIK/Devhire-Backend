const Application = require("../models/Application");

// Apply to job
exports.applyJob = async (req, res) => {
    const { jobId } = req.body;

    const application = await Application.create({
        job: jobId,
        user: req.user.id
    });

    res.status(201).json({
        message: "Applied successfully",
        application
    });
};

// My applications
exports.myApplications = async (req, res) => {
    const apps = await Application.find({ user: req.user.id })
        .populate("job");

    res.json(apps);
};
