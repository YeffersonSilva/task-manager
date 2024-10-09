import { Request, Response, NextFunction } from 'express';
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.ts";

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "Not authorized, please login!" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: "Not authorized, token failed!" });
  }
});

export const adminMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
    return;
  }
  res.status(403).json({ message: "Only admins can do this!" });
});

export const creatorMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === "creator" || req.user.role === "admin")) {
    next();
    return;
  }
  res.status(403).json({ message: "Only creators can do this!" });
});

export const verifiedMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isVerified) {
    next();
    return;
  }
  res.status(403).json({ message: "Please verify your email address!" });
});