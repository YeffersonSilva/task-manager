// src/controllers/auth/emailController.ts

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../../models/auth/UserModel.ts';
import Token from '../../models/auth/Token.ts';
import hashToken from '../../helpers/hashToken.ts';
// import sendEmail from '../../utils/sendEmail'; // Descomenta cuando implementes sendEmail
import { UserDocument } from '../../models/auth/UserModel.ts';

// Verificar email
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Usuario no autenticado' });
    return;
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  if (user.isVerified) {
    res.status(400).json({ message: 'El usuario ya está verificado' });
    return;
  }

  // Eliminar token existente si hay
  await Token.deleteOne({ userId: user._id });

  // Crear token de verificación
  const verificationToken = crypto.randomBytes(64).toString('hex') + user._id;
  const hashedToken = hashToken(verificationToken);

  // Guardar token
  await new Token({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
  }).save();

  // Construir enlace de verificación
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  // Enviar email
  const subject = 'Verificación de Email';
  const send_to = user.email;
  const reply_to = 'noreply@example.com';
  const template = 'emailVerification';
  const send_from = process.env.USER_EMAIL as string;
  const name = user.name;
  const url = verificationLink;

  try {
    // Descomenta la siguiente línea cuando implementes sendEmail
    // await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
    res.json({ message: 'Email de verificación enviado' });
  } catch (error) {
    console.log('Error al enviar email: ', error);
    res.status(500).json({ message: 'No se pudo enviar el email' });
  }
});

// Verificar usuario
export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    res.status(400).json({ message: 'Token de verificación inválido' });
    return;
  }

  const hashedToken = hashToken(verificationToken);

  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(400).json({ message: 'Token de verificación inválido o expirado' });
    return;
  }

  const user = await User.findById(userToken.userId);

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  if (user.isVerified) {
    res.status(400).json({ message: 'El usuario ya está verificado' });
    return;
  }

  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: 'Usuario verificado' });
});
