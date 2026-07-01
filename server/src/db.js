import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/achehoje";

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URI);
  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  return mongoose.connection;
};

export { MONGO_URI };
