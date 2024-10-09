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

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.isVerified) {
    res.status(400).json({ message: "User is already verified" });
    return;
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;
  const hashedToken = hashToken(verificationToken);

  await new Token({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  }).save();

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const subject = "Email Verification - AuthKit";
  const send_to = user.email;
  const reply_to = "noreply@gmail.com";
  const template = "emailVerification";
  const send_from = process.env.USER_EMAIL as string;
  const name = user.name;
  const url = verificationLink;

  try {
    // Uncomment the following line when you have implemented the sendEmail function
    // await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
    res.json({ message: "Email sent" });
  } catch (error) {
    console.log("Error sending email: ", error);
    res.status(500).json({ message: "Email could not be sent" });
  }
});

export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    res.status(400).json({ message: "Invalid verification token" });
    return;
  }

  const hashedToken = hashToken(verificationToken);

  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(400).json({ message: "Invalid or expired verification token" });
    return;
  }

  const user = await User.findById(userToken.userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.isVerified) {
    res.status(400).json({ message: "User is already verified" });
    return;
  }

  user.isVerified = true;
  await user.save();
  res.status(200).json({ message: "User verified" });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;
  const hashedToken = hashToken(passwordResetToken);

  await new Token({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000,
  }).save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

  const subject = "Password Reset - AuthKit";
  const send_to = user.email;
  const send_from = process.env.USER_EMAIL as string;
  const reply_to = "noreply@noreply.com";
  const template = "forgotPassword";
  const name = user.name;
  const url = resetLink;

  try {
    // Uncomment the following line when you have implemented the sendEmail function
    // await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
    res.json({ message: "Email sent" });
  } catch (error) {
    console.log("Error sending email: ", error);
    res.status(500).json({ message: "Email could not be sent" });
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }

  const hashedToken = hashToken(resetPasswordToken);

  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(400).json({ message: "Invalid or expired reset token" });
    return;
  }

  const user = await User.findById(userToken.userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    res.status(400).json({ message: "Invalid password!" });
    return;
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({ message: "Password changed successfully" });
});