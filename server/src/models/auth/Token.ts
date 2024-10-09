import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Token document
interface IToken extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  verificationToken: string;
  passwordResetToken: string;
  createdAt: Date;
  expiresAt: Date;
}

// Create the Token schema
const TokenSchema: Schema = new mongoose.Schema({
  // Reference to the user this token belongs to
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

 
  verificationToken: {
    type: String,
    default: "",
  },

  
  passwordResetToken: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    required: true,
  },

  
  expiresAt: {
    type: Date,
    required: true,
  },
});


const Token = mongoose.model<IToken>("Token", TokenSchema);

export default Token;
