import { UserDocument } from "./models/auth/UserModel";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};