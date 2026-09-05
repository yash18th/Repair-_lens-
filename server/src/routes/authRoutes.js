import express from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { comparePassword, createAuthToken, hashPassword, setAuthCookie, clearAuthCookie } from '../utils/auth.js';
import { errorResponse, successResponse } from '../utils/response.js';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
});

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(8, 'Invalid email or password'),
});

router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return errorResponse(res, parsed.error.issues[0]?.message || 'Invalid registration data', 400);
    }

    const { name, email, password, confirmPassword } = parsed.data;

    if (password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match.', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const token = createAuthToken(user.id);
    setAuthCookie(res, token);

    return successResponse(res, { user, token }, 201);
  } catch (error) {
    return errorResponse(res, 'Something went wrong while creating your account', 500);
  }
});

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return errorResponse(res, parsed.error.issues[0]?.message || 'Invalid login payload', 400);
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const passwordMatches = await comparePassword(password, user.passwordHash);

    if (!passwordMatches) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const token = createAuthToken(user.id);
    setAuthCookie(res, token);

    return successResponse(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while signing you in', 500);
  }
});

router.get('/me', requireAuth, async (req, res) => {
  return successResponse(res, { user: req.user });
});

router.post('/logout', async (req, res) => {
  clearAuthCookie(res);
  return successResponse(res, { message: 'Logged out successfully' });
});

export default router;
