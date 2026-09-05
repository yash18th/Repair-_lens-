import express from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { errorResponse, successResponse } from '../utils/response.js';

const router = express.Router();

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters').optional(),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  bio: z.string().trim().optional(),
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, { profile: user });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while loading your profile', 500);
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const parsed = profileSchema.safeParse(req.body);

    if (!parsed.success) {
      return errorResponse(res, parsed.error.issues[0]?.message || 'Invalid profile update data', 400);
    }

    const { name, phone, location, bio } = parsed.data;

    const profileData = {
      ...(name ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(bio !== undefined ? { bio } : {}),
    };

    if (name) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { name },
      });
    }

    const currentProfile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        phone: phone || null,
        location: location || null,
        bio: bio || null,
      },
      update: {
        phone: phone !== undefined ? phone : undefined,
        location: location !== undefined ? location : undefined,
        bio: bio !== undefined ? bio : undefined,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    return successResponse(res, { profile: user, profileDetails: currentProfile });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while updating your profile', 500);
  }
});

export default router;
