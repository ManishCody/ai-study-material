const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URl;

if (!MONGO_URI) {
  throw new Error('Please define the MONGODB_URL environment variable in your .env.local file');
}

async function dbConnect() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); 
  }
}

module.exports = dbConnect;
