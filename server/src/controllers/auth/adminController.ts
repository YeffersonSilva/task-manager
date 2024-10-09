import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import User, { UserDocument } from "../../models/auth/UserModel.ts";
import mongoose from 'mongoose';

export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: "Cannot delete user" });
  }
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const users: UserDocument[] = await User.find({});

    if (users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: "Cannot get users" });
  }
});