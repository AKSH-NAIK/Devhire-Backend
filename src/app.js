const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();



// ─────────────────────────────────────────────
// Middlewares
// ─────────────────────────────────────────────

// CORS
app.use(cors({
  origin: "https://devhireweb.vercel.app",
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder (not used anymore for resumes but fine to keep)
app.use("/uploads", express.static("uploads"));


// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "DevHire API is running" });
});


// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

module.exports = app;