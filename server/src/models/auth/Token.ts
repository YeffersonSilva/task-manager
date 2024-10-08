import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Token document
interface IToken extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  verificationToken: string;
  passwordResetToken: string;
  createdAt: Date;
  expiresAt: Date;
}
