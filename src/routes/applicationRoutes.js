const express = require("express");
const { applyJob, myApplications } = require("../controllers/applicationController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, applyJob);
router.get("/me", auth, myApplications);

module.exports = router;
