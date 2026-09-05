import express from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { errorResponse, successResponse } from '../utils/response.js';

const router = express.Router();

const scanSchema = z.object({
  category: z.string().min(1),
  deviceType: z.string().min(1),
  problemDescription: z.string().min(1),
  uploadedImageUrl: z.string().url().optional().or(z.literal('')),
  diagnosis: z.string().min(1),
  confidence: z.number().min(0).max(100).optional(),
  recommendation: z.string().optional(),
  estimatedRepairCost: z.string().optional(),
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const parsed = scanSchema.safeParse(req.body);

    if (!parsed.success) {
      return errorResponse(res, parsed.error.issues[0]?.message || 'Invalid scan data', 400);
    }

    const scan = await prisma.scan.create({
      data: {
        userId: req.user.id,
        category: parsed.data.category,
        deviceType: parsed.data.deviceType,
        problemDescription: parsed.data.problemDescription,
        uploadedImageUrl: parsed.data.uploadedImageUrl || null,
        diagnosis: parsed.data.diagnosis,
        confidence: parsed.data.confidence ?? null,
        recommendation: parsed.data.recommendation || null,
        estimatedRepairCost: parsed.data.estimatedRepairCost || null,
      },
    });

    return successResponse(res, { scan }, 201);
  } catch (error) {
    return errorResponse(res, 'Something went wrong while creating the scan', 500);
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const scans = await prisma.scan.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { scans });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while loading scans', 500);
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const scan = await prisma.scan.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!scan) {
      return errorResponse(res, 'Scan not found', 404);
    }

    return successResponse(res, { scan });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while loading this scan', 500);
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const scan = await prisma.scan.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!scan) {
      return errorResponse(res, 'Scan not found', 404);
    }

    await prisma.scan.delete({ where: { id: req.params.id } });
    return successResponse(res, { message: 'Scan deleted successfully' });
  } catch (error) {
    return errorResponse(res, 'Something went wrong while deleting the scan', 500);
  }
});

export default router;
