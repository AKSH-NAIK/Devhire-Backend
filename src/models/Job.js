const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  company: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  salary: {
    type: String
  },

  type: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
    default: "Full-time"
  },

  description: {
    type: String,
    required: true
  },

  requirements: [
    {
      type: String
    }
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);