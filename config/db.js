const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/cs2freecase';
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected to:", mongoUri);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.log("Server will continue without database connection");
  }
};

module.exports = connectDB;
