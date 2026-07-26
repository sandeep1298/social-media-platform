const mongoose = require("mongoose");
const { mongoUri } = require("./env");

const connectDB = async () => {
  if (!mongoUri) {
    throw new Error("MONGODB_URI or MONGOURI is required");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
};

module.exports = { connectDB };
