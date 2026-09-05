import express from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { errorResponse, successResponse } from '../utils/response.js';

const router = express.Router();

const searchSchema = z.object({
  query: z.string().trim().min(1, 'Search query is required'),
  category: z.string().min(1, 'Category is required'),
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const parsed = searchSchema.safeParse(req.body);

    if (!parsed.success) {
      return errorResponse(res, parsed.error.issues[0]?.message || 'Invalid search data', 400);
    }

    const search = await prisma.searchHistory.create({
      data: {
        userId: req.user.id,
        query: parsed.data.query,
        category: parsed.data.category,
      },
    });

    return successResponse(res, { search }, 201);
  } catch (error) {
    return errorResponse(res, 'Something went wrong while saving the search', 500);
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const searches = await prisma.searchHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { searches });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while loading searches', 500);
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const search = await prisma.searchHistory.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!search) {
      return errorResponse(res, 'Search not found', 404);
    }

    await prisma.searchHistory.delete({ where: { id: req.params.id } });
    return successResponse(res, { message: 'Search deleted successfully' });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while deleting the search', 500);
  }
});

export default router;
