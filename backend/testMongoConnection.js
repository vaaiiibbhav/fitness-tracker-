const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

// Load environment variables
dotenv.config();

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;

console.log('Testing MongoDB connection...');
console.log('Connection string (with password hidden):', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

// Parse the connection string to extract components
const uriParts = mongoURI.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/?/);
if (uriParts) {
  console.log('\nConnection Details:');
  console.log('Username:', uriParts[1]);
  console.log('Host:', uriParts[3]);
  console.log('Database:', mongoURI.includes('/') ? mongoURI.split('/').pop().split('?')[0] : 'Not specified');
}

// First try with the native MongoDB driver
console.log('\nTrying connection with native MongoDB driver...');
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4
});

client.connect()
  .then(async () => {
    console.log('✅ Native MongoDB driver connection successful!');
    
    try {
      // List all databases
      const adminDb = client.db('admin');
      const dbs = await adminDb.admin().listDatabases();
      console.log('\nAvailable databases:');
      dbs.databases.forEach(db => {
        console.log(`- ${db.name}`);
      });
      
      // Get the database name from the connection string
      const dbName = mongoURI.includes('/') ? mongoURI.split('/').pop().split('?')[0] : 'admin';
      const db = client.db(dbName);
      
      // List collections in the specified database
      const collections = await db.listCollections().toArray();
      console.log(`\nCollections in database '${dbName}':`);
      if (collections.length === 0) {
        console.log('No collections found (empty database)');
      } else {
        collections.forEach(collection => {
          console.log(`- ${collection.name}`);
        });
      }
      
      // Get database stats
      const stats = await db.stats();
      console.log('\nDatabase stats:');
      console.log('- Number of collections:', stats.collections);
      console.log('- Number of documents:', stats.objects);
      console.log('- Database size:', (stats.dataSize / 1024 / 1024).toFixed(2), 'MB');
      
    } catch (error) {
      console.error('Error during database operations:', error);
    } finally {
      // Close the connection
      await client.close();
      console.log('\nMongoDB connection closed.');
    }
  })
  .catch(async (err) => {
    console.error('\n❌ Native MongoDB driver connection failed!');
    console.error('Error details:', err.message);
    
    if (err.name === 'MongoServerError') {
      console.error('Error code:', err.code);
      console.error('Error code name:', err.codeName);
    }
    
    // Now try with Mongoose as a fallback
    console.log('\nTrying connection with Mongoose as fallback...');
    
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4
      });
      
      console.log('✅ Mongoose connection successful!');
      console.log('Connected to database:', mongoose.connection.name);
      console.log('Host:', mongoose.connection.host);
      
      // Close the connection
      await mongoose.connection.close();
      console.log('\nMongoose connection closed.');
    } catch (mongooseErr) {
      console.error('\n❌ Mongoose connection also failed!');
      console.error('Error details:', mongooseErr.message);
      
      // Provide troubleshooting steps
      console.error('\nTroubleshooting steps:');
      console.error('1. Verify your MongoDB Atlas credentials:');
      console.error('   - Log in to MongoDB Atlas (https://cloud.mongodb.com)');
      console.error('   - Go to Database Access and check username/password');
      console.error('   - Create a new database user if needed');
      
      console.error('\n2. Check network access:');
      console.error('   - Go to Network Access in MongoDB Atlas');
      console.error('   - Add your IP address:', await getPublicIP());
      console.error('   - Or temporarily allow access from anywhere (0.0.0.0/0)');
      
      console.error('\n3. Verify cluster status:');
      console.error('   - Check if your MongoDB Atlas cluster is running');
      console.error('   - Ensure you have the correct cluster URL');
      
      console.error('\n4. Try a different connection string format:');
      console.error('   - Use the connection string directly from MongoDB Atlas');
      console.error('   - Click "Connect" on your cluster and choose "Connect your application"');
      
      process.exit(1);
    }
  });

// Helper function to get public IP
async function getPublicIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'Could not determine IP';
  }
} 