import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.ts";
import generateToken from "../../helpers/generateToken.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../../models/auth/Token.ts";
import crypto from "crypto";
import hashToken from "../../helpers/hashToken.ts";
import mongoose, { Document } from "mongoose";

interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  photo: string;
  bio: string;
  isVerified: boolean;
}

interface TokenDocument extends Document {
  userId: mongoose.Types.ObjectId;
  verificationToken?: string;
  passwordResetToken?: string;
  createdAt: Date;
  expiresAt: Date;
}
