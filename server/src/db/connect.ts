import mongoose from "mongoose";

const connect = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
   
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    console.log("Attempting to connect to database.....");
    await mongoose.connect(mongoUri, {});
    console.log("Connected to database.....");
  } catch (error: any) {
    console.log("Failed to connect to database.....", error.message);
    process.exit(1);
  }
};

export default connect;
