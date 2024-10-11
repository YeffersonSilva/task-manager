// src/controllers/auth/authController.ts

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import generateToken from '../../helpers/generateToken.ts';
import User from '../../models/auth/UserModel.ts';
import jwt from 'jsonwebtoken';

// Registro de usuario
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validación
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    return;
  }

  // Verificar si el usuario ya existe
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'El usuario ya existe' });
    return;
  }

  // Crear usuario
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generar token
  const token = generateToken(user._id.toString());

  // Configurar cookie
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    sameSite: 'none',
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
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
});

// Inicio de sesión
// src/controllers/auth/authController.ts

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validar entrada del usuario
  if (!email || !password) {
    res.status(400).json({ message: 'Por favor, ingrese email y contraseña' });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ message: 'Usuario no encontrado' });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    res.status(400).json({ message: 'Contraseña incorrecta' });
    return;
  }

  // Generar token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });

  // Devolver el token en la respuesta
  res.status(200).json({
    message: 'Inicio de sesión exitoso',
    token,
  });
});

// Cierre de sesión
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
  });

  res.status(200).json({ message: 'Usuario desconectado' });
});
