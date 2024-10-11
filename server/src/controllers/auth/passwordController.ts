// src/controllers/auth/passwordController.ts

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../../models/auth/UserModel.ts';
import Token from '../../models/auth/Token.ts';
import hashToken from '../../helpers/hashToken.ts';
// import sendEmail from '../../utils/sendEmail'; // Descomenta cuando implementes sendEmail

// Olvidó contraseña
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'El email es obligatorio' });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  // Eliminar token existente si hay
  await Token.deleteOne({ userId: user._id });

  // Crear token de restablecimiento
  const resetToken = crypto.randomBytes(64).toString('hex') + user._id;
  const hashedToken = hashToken(resetToken);

  // Guardar token
  await new Token({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hora
  }).save();

  // Construir enlace de restablecimiento
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Enviar email
  const subject = 'Restablecimiento de Contraseña';
  const send_to = user.email;
  const send_from = process.env.USER_EMAIL as string;
  const reply_to = 'noreply@example.com';
  const template = 'forgotPassword';
  const name = user.name;
  const url = resetLink;

  try {
    // Descomenta la siguiente línea cuando implementes sendEmail
    // await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
    res.json({ message: 'Email de restablecimiento enviado' });
  } catch (error) {
    console.log('Error al enviar email: ', error);
    res.status(500).json({ message: 'No se pudo enviar el email' });
  }
});

// Restablecer contraseña
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: 'La contraseña es obligatoria' });
    return;
  }

  const hashedToken = hashToken(resetPasswordToken);

  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(400).json({ message: 'Token de restablecimiento inválido o expirado' });
    return;
  }

  const user = await User.findById(userToken.userId);

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  user.password = password;
  await user.save();

  res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
});
