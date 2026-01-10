



const mongoose = require("mongoose");
// MONGO_URI=process.env.MONGO_URI
MONGO_URI="mongodb+srv://uselessacc3112_db_user:LmZkm2hkgsj1GJco@cluster0.lixzv0a.mongodb.net/journaldb?retryWrites=true&w=majority&appName=Cluster0"



let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDb;