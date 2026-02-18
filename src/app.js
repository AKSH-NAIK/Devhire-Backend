const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const app = express();
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => {
    res.json({ message: "DevHire API is running" });
});


app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message
    });
});

module.exports = app;
