export interface IUser {
    name: string;
    email: string;
    password?: string;
    photo?: string;
    bio?: string;
    role?: "user" | "admin" | "creator";
    isVerified?: boolean;
  }
  