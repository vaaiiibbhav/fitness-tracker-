const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

const cors = require("cors"); // Add this line
const path = require('path');
// require("dotenv").config();

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Add CORS middleware here
app.use(
  cors({
    origin: "http://localhost:5173", // Ensure this matches your frontend URL exactly
  })
);

// Enable preflight for all routes
app.options("*", cors());

app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
