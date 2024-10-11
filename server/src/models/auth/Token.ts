import mongoose, { Schema, Document, Types } from 'mongoose';

export interface TokenDocument extends Document {
  userId: Types.ObjectId;
  verificationToken?: string;
  passwordResetToken?: string;
  createdAt: Date;
  expiresAt: Date;
}

const tokenSchema = new Schema<TokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    verificationToken: { type: String },
    passwordResetToken: { type: String },
    createdAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<TokenDocument>('Token', tokenSchema);
