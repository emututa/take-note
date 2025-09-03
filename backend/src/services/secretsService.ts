



// src/services/secretsService.ts
import bcrypt from 'bcryptjs';
import SecretsPassword from '../models/SecretsPassword';

export const setPassword = async (password: string) => {
  const exists = await SecretsPassword.findOne();
  if (exists) throw new Error('Password already set');
  const hash = await bcrypt.hash(password, 10);
  return await SecretsPassword.create({ passwordHash: hash });
};

export const verifyPassword = async (password: string) => {
  const stored = await SecretsPassword.findOne();
  if (!stored) throw new Error('No password set');
  const isMatch = await bcrypt.compare(password, stored.passwordHash);
  if (!isMatch) throw new Error('Invalid password');
  return true;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const stored = await SecretsPassword.findOne();
  if (!stored) throw new Error('No password set');
  const isMatch = await bcrypt.compare(currentPassword, stored.passwordHash);
  if (!isMatch) throw new Error('Current password is incorrect');
  stored.passwordHash = await bcrypt.hash(newPassword, 10);
  return await stored.save();
};