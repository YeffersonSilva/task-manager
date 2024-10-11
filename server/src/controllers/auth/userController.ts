// src/controllers/auth/userController.ts

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/auth/UserModel.ts';
import { UserDocument } from '../../types/UserDocument.ts';

// Extender el tipo Request de Express para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

// Obtener usuario
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Usuario no autenticado' });
    return;
  }

  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

// Actualizar usuario
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Usuario no autenticado' });
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
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

// Estado de inicio de sesión
export const userLoginStatus = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'No autorizado, por favor inicia sesión' });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).json(true);
  } catch (error) {
    res.status(401).json(false);
  }
});

// Cambiar contraseña
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user) {
    res.status(401).json({ message: 'Usuario no autenticado' });
    return;
  }

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
    return;
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    res.status(400).json({ message: 'Contraseña actual incorrecta' });
    return;
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
});
