import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
};

export default connectDB;
