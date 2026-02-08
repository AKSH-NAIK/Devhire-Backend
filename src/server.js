require('dotenv').config();
const express = require('express');

const connectDB = require('./config/db');
connectDB();

const app = express();
const jobRoutes = require('./routes/jobRoutes');
app.use(express.json());
app.use('/api/jobs', jobRoutes);
app.use('/api/users', require('./routes/userRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
