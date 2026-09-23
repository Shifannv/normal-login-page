const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.message.includes("bad auth") || error.message.includes("authentication failed")) {
      console.error("MongoDB Auth Error: Wrong username or password in MONGO_URI");
      console.error("Fix: Go to Atlas > Database Access > Edit your user > change password");
    } else if (error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND")) {
      console.error("MongoDB Connection Error: Cannot reach Atlas. Check your internet or IP whitelist.");
    } else {
      console.error(`MongoDB connection error: ${error.message}`);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
