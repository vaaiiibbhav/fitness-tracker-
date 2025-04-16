const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;

console.log('Testing MongoDB connection with minimal options...');
console.log('Connection string (with password hidden):', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

// Connect to MongoDB with minimal options
mongoose.connect(mongoURI)
  .then(() => {
    console.log('\n✅ MongoDB connection successful!');
    console.log('Connected to database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
    // Close the connection
    mongoose.connection.close(() => {
      console.log('\nMongoDB connection closed.');
    });
  })
  .catch(err => {
    console.error('\n❌ MongoDB connection failed!');
    console.error('Error details:', err.message);
    
    if (err.name === 'MongoServerError') {
      console.error('Error code:', err.code);
      console.error('Error code name:', err.codeName);
    }
    
    console.error('\nTroubleshooting steps:');
    console.error('1. Log in to MongoDB Atlas (https://cloud.mongodb.com)');
    console.error('2. Go to Network Access and add your IP address');
    console.error('3. Go to Database Access and verify user permissions');
    console.error('4. Try creating a new database user with proper permissions');
    
    process.exit(1);
  }); 