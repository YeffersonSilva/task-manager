import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

// User interface (properties only)
export interface IUser {
  name: string;
  email: string;
  password: string;
  photo: string;
  bio: string;
  role: "user" | "admin" | "creator";
  isVerified: boolean;
}

// User methods interface
export interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// User model interface (for statics)
export interface UserModel extends Model<IUser, {}, IUserMethods> {
  // Add any static methods here if needed
}

// User document type (combines Document, IUser, and IUserMethods)
export interface UserDocument extends Document, IUser, IUserMethods {}

// User schema
const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { 
      type: String, 
      required: [true, "Please provide your name"] 
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please add a valid email"],
    },
    password: { 
      type: String, 
      required: [true, "Please add a password!"] 
    },
    photo: { 
      type: String, 
      default: "https://avatars.githubusercontent.com/u/19819005?v=4" 
    },
    bio: { 
      type: String, 
      default: "I am a new user." 
    },
    role: { 
      type: String, 
      enum: ["user", "admin", "creator"], 
      default: "user" 
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (this: UserDocument, next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare entered password with user's hashed password
UserSchema.methods.matchPassword = async function (this: UserDocument, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const User = mongoose.model<IUser, UserModel>("User", UserSchema);

export default User;