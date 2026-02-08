const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
} = require('../controllers/jobController');


// CREATE JOB (protected)
router.post('/', auth, createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);

module.exports = router;
