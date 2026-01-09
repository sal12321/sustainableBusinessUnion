const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/SbuAdminUpdate");
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" MongoDB connection failed");
    console.error(err);
    process.exit(1); // crash app if DB fails
  }
}

module.exports = connectDB;
