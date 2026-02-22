const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        resume: { type: String ,required:true},          
        status: { type: String, default: "applied" }
    },
    { timestamps: true }
);
applicationSchema.index({ job: 1, user: 1 }, { unique: true });
module.exports = mongoose.model("Application", applicationSchema);
