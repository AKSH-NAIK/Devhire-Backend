const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  getAdminSummary,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
  updateApplicationStatus
} = require("../controllers/adminController");

router.use(protect, authorizeRoles("admin"));

router.get("/summary", getAdminSummary);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/jobs", getAllJobs);
router.delete("/jobs/:id", deleteJob);

router.get("/applications", getAllApplications);
router.patch("/applications/:id/status", updateApplicationStatus);

module.exports = router;