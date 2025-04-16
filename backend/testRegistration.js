require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function testRegistration() {
  try {
    console.log('Starting MongoDB connection test...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Test user data
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123'
    };

    // Check if test user exists and delete if it does
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Deleting existing test user...');
      await User.deleteOne({ email: testUser.email });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    // Create new user
    console.log('Creating test user...');
    const user = await User.create({
      name: testUser.name,
      email: testUser.email,
      password: hashedPassword
    });

    console.log('Test user created successfully:', user._id);

    // Verify user was created
    const createdUser = await User.findOne({ email: testUser.email });
    console.log('Verified user exists in database:', createdUser._id);

    // Clean up
    console.log('Cleaning up test data...');
    await User.deleteOne({ email: testUser.email });
    await mongoose.connection.close();
    console.log('Test completed successfully');

  } catch (error) {
    console.error('Test failed:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

testRegistration(); 