// src/types/express.d.ts

import { UserDocument } from "../models/auth/UserModel"; // Ajusta la ruta según tu estructura de carpetas

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
