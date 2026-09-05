import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';

export const hashPassword = (password) => bcrypt.hash(password, 12);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export const createAuthToken = (userId) =>
  jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '7d' });

export const verifyAuthToken = (token) => jwt.verify(token, config.jwtSecret);

export const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('authToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
};
