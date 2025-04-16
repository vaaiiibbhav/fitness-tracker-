const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  registerUser,
  loginUser,
  getUserById,
  updateProfile
} = require("../controllers/userController");

const router = express.Router();

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
  
const upload = multer({ storage: storage });

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get user by ID
router.get("/:id", getUserById);

// Update profile route with file upload
router.put("/update-profile", upload.single('profileImage'), updateProfile);

module.exports = router;
