import express from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { errorResponse, successResponse } from '../utils/response.js';

const router = express.Router();

const scanSchema = z.object({
  reportId: z.string().min(1).optional(),
  category: z.string().min(1),
  deviceType: z.string().min(1).optional(),
  deviceName: z.string().min(1).optional(),
  issueDescription: z.string().min(1).optional(),
  problemDescription: z.string().min(1).optional(),
  uploadedImageUrl: z.string().url().optional().or(z.literal('')),
  diagnosis: z.string().min(1).optional(),
  confidence: z.number().min(0).max(100).optional(),
  recommendation: z.string().optional(),
  estimatedRepairCost: z.string().optional(),
  estimatedCost: z.string().optional(),
  costMin: z.string().optional(),
  costMax: z.string().optional(),
  severity: z.string().optional(),
  diySuitability: z.number().min(0).max(100).optional(),
  imageCount: z.number().int().min(0).max(10).optional(),
  analysisData: z.record(z.any()).optional(),
  imageInfo: z.record(z.any()).optional(),
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const parsed = scanSchema.safeParse(req.body);

    if (!parsed.success) {
      return errorResponse(res, parsed.error.issues[0]?.message || 'Invalid scan data', 400);
    }

    const issueDescription = parsed.data.issueDescription || parsed.data.problemDescription || 'Diagnostic issue observation';
    const diagnosis = parsed.data.diagnosis || parsed.data.problemDescription || 'Diagnostic completed';
    const deviceType = parsed.data.deviceType || parsed.data.deviceName || 'Device';
    const reportId = parsed.data.reportId || `RL-${Date.now()}-${randomUUID().slice(0, 8)}`;

    const existingScan = await prisma.scan.findUnique({
      where: { reportId },
    });

    if (existingScan && existingScan.userId === req.user.id) {
      return successResponse(res, { scan: existingScan, duplicate: true }, 200);
    }

    if (existingScan && existingScan.userId !== req.user.id) {
      return errorResponse(res, 'A scan with this report ID already exists for another user.', 409);
    }

    const scan = await prisma.scan.create({
      data: {
        userId: req.user.id,
        reportId,
        category: parsed.data.category,
        deviceType,
        deviceName: parsed.data.deviceName || deviceType,
        issueDescription,
        problemDescription: parsed.data.problemDescription || issueDescription,
        uploadedImageUrl: parsed.data.uploadedImageUrl || null,
        diagnosis,
        severity: parsed.data.severity || 'Medium',
        confidence: parsed.data.confidence ?? null,
        recommendation: parsed.data.recommendation || null,
        estimatedRepairCost: parsed.data.estimatedRepairCost || parsed.data.estimatedCost || null,
        estimatedCost: parsed.data.estimatedCost || parsed.data.estimatedRepairCost || null,
        costMin: parsed.data.costMin || null,
        costMax: parsed.data.costMax || null,
        diySuitability: parsed.data.diySuitability ?? null,
        imageCount: parsed.data.imageCount ?? 0,
        analysisData: parsed.data.analysisData || parsed.data.imageInfo || null,
      },
    });

    return successResponse(res, { scan }, 201);
  } catch (error) {
    console.error('Create scan failed:', error);
    return errorResponse(res, 'Something went wrong while creating the scan', 500);
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const scans = await prisma.scan.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { scans, history: scans });
  } catch (error) {
    console.error('List scans failed:', error);
    return errorResponse(res, 'Something went wrong while loading scans', 500);
  }
});

router.get('/history', requireAuth, async (req, res) => {
  try {
    const scans = await prisma.scan.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { history: scans, scans });
  } catch (error) {
    console.error('List history failed:', error);
    return errorResponse(res, 'Something went wrong while loading your diagnostic history', 500);
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
