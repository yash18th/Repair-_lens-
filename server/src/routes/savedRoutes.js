import express from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { errorResponse, successResponse } from '../utils/response.js';

const router = express.Router();

const saveSchema = z.object({
  scanId: z.string().min(1, 'Scan ID is required'),
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const parsed = saveSchema.safeParse(req.body);

    if (!parsed.success) {
      return errorResponse(res, parsed.error.issues[0]?.message || 'Invalid saved diagnosis payload', 400);
    }

    const scan = await prisma.scan.findFirst({
      where: {
        id: parsed.data.scanId,
        userId: req.user.id,
      },
    });

    if (!scan) {
      return errorResponse(res, 'Scan not found', 404);
    }

    const saved = await prisma.savedDiagnosis.create({
      data: {
        userId: req.user.id,
        scanId: parsed.data.scanId,
      },
    });

    return successResponse(res, { saved }, 201);
  } catch (error) {
    return errorResponse(res, 'Something went wrong while saving the diagnosis', 500);
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const saved = await prisma.savedDiagnosis.findMany({
      where: { userId: req.user.id },
      include: { scan: true },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { saved });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while loading saved diagnoses', 500);
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const saved = await prisma.savedDiagnosis.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!saved) {
      return errorResponse(res, 'Saved diagnosis not found', 404);
    }

    await prisma.savedDiagnosis.delete({ where: { id: req.params.id } });
    return successResponse(res, { message: 'Saved diagnosis removed' });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while removing the saved diagnosis', 500);
  }
});

export default router;
