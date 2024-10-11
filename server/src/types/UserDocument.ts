// src/types/UserDocument.ts

import mongoose, { Document } from 'mongoose';

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  photo: string;
  bio: string;
  isVerified: boolean;
}
