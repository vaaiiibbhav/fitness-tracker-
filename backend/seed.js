const mongoose = require("mongoose");
const User = require("./models/User"); // Ensure this is the correct path to your User model

// Connect to MongoDB once
mongoose
  .connect("mongodb+srv://2005akjha:aditya@cluster0.gxoqohx.mongodb.net/fitness", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
    seedUsers();
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const users = [
  {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password123", // Use a hashed password in a real app
    isVerified: true,
    profileImage: "",
    height: 180,
    weight: 75,
    gender: "male",
    age: 30
  },
  {
    name: "Jane Smith",
    email: "janesmith@example.com",
    password: "password123", // Use a hashed password in a real app
    isVerified: true,
    profileImage: "",
    height: 165,
    weight: 60,
    gender: "female",
    age: 25
  },
  // Add more users if needed
];

const seedUsers = async () => {
  try {
    // Clear the users collection before seeding new data
    await User.deleteMany();

    // Create new users
    await User.insertMany(users);
    console.log("Users seeded successfully!");

    mongoose.connection.close(); // Close the connection after seeding
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
