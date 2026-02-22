const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// Load environment variables
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch(err => console.log(err));