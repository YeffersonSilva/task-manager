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



// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, role, photo, bio, isVerified } = user;
    res.status(201).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "User not found, sign up!" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }

  const token = generateToken(user._id.toString());

  if (user && isMatch) {
    const { _id, name, email, role, photo, bio, isVerified } = user;

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.status(200).json({ message: "User logged out" });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  const user = await User.findById(req.user._id);

  if (user) {
    const { name, bio, photo } = req.body;
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.photo = photo || user.photo;

    const updated = await user.save();

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      photo: updated.photo,
      bio: updated.bio,
      isVerified: updated.isVerified,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


export const userLoginStatus = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Not authorized, please login!" });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  if (decoded) {
    res.status(200).json(true);
  } else {
    res.status(401).json(false);
  }
});


