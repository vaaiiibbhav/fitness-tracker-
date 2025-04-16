const mongoose = require('mongoose');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for credentials
function promptForCredentials() {
  return new Promise((resolve) => {
    rl.question('Enter MongoDB username: ', (username) => {
      rl.question('Enter MongoDB password: ', (password) => {
        rl.question('Enter database name (default: fitness-tracker): ', (database) => {
          resolve({
            username,
            password,
            database: database || 'fitness-tracker'
          });
        });
      });
    });
  });
}

// Main function
async function main() {
  console.log('MongoDB Connection Test');
  console.log('======================');
  
  // Get credentials from user
  const { username, password, database } = await promptForCredentials();
  
  // Build connection string
  const mongoURI = `mongodb+srv://${username}:${password}@cluster0-fitpal.oscdjpa.mongodb.net/${database}?retryWrites=true&w=majority`;
  
  console.log('\nTesting connection with the following details:');
  console.log('Username:', username);
  console.log('Host: cluster0-fitpal.oscdjpa.mongodb.net');
  console.log('Database:', database);
  
  // Try to connect
  console.log('\nConnecting to MongoDB...');
  
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('\n✅ MongoDB connection successful!');
    console.log('Connected to database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    if (collections.length === 0) {
      console.log('No collections found (empty database)');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
    
    // If successful, show the connection string to use in .env
    console.log('\nUse this connection string in your .env file:');
    console.log(`MONGO_URI=mongodb+srv://${username}:${password}@cluster0-fitpal.oscdjpa.mongodb.net/${database}?retryWrites=true&w=majority`);
    
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error('Error details:', error.message);
    
    if (error.name === 'MongoServerError') {
      console.error('Error code:', error.code);
      console.error('Error code name:', error.codeName);
    }
    
    console.error('\nTroubleshooting steps:');
    console.error('1. Verify your credentials are correct');
    console.error('2. Make sure your IP address is whitelisted in MongoDB Atlas');
    console.error('3. Check if the user has the proper permissions');
  } finally {
    rl.close();
  }
}

// Run the main function
main().catch(console.error); 