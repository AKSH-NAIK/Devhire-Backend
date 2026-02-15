const express = require('express');
const router = express.Router();
const protect = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const auth = require('../middleware/auth');
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
} = require('../controllers/jobController');


// CREATE JOB (protected)
router.post("/", protect, authorizeRoles("recruiter"), createJob);

router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);

module.exports = router;
