const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      required: true
    },
    companyName: {
      type: String,
      default: ""
    },
    companyWebsite: {
      type: String,
      default: ""
    },
    areaOfInterest: {
      type: [String],
      default: []
    },
    resume: {
      type: String,
    },
    isVerified: {
  type: Boolean,
  default: false
},
verificationToken: {
  type: String,
  default: null
}

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
