const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verificationEmail = require("../emailTemplates/verificationEmail");
const util = require("util");
const cors = require("cors");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log('Starting registration process for:', email);

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: "All fields are required",
        details: {
          name: !name ? "Name is required" : null,
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null
        }
      });
    }

    // Check if user already exists
    console.log('Checking for existing user');
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log('Creating user in database');
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log('User created successfully:', user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    
    // Log the full error for debugging
    console.error("Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Email already exists",
        error: "DUPLICATE_EMAIL"
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error",
        details: error.message
      });
    }

    res.status(500).json({ 
      message: "Failed to register user. Please try again.",
      error: error.message
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for:', email);
    
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('Login successful for:', email);
      
      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      return res.status(200).json({ token });
    } else {
      console.log('Login failed for:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });

    if (user) {
      user.isVerified = true;
      user.verificationToken = null; // Clear the token after verification
      await user.save();
      res.status(200).json({ message: "Email verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid verification link" });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, name, password, height, weight, gender, age } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.gender = gender || user.gender;
    user.age = age || user.age;

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename.replace(/\\/g, '/')}`;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      height: updatedUser.height,
      weight: updatedUser.weight,
      gender: updatedUser.gender,
      age: updatedUser.age,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "jhaaditya690@gmail.com", // The email address you want to receive contact form submissions
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error sending contact form email:", error);
    res
      .status(500)
      .json({
        message: "Failed to send your message. Please try again later.",
      });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  getUserById,
  updateProfile,
  contactUs,
};
