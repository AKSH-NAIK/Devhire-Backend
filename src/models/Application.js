const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    coverLetter: {
         type: String,
         required: true
    },
    resume: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "shortlisted", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);