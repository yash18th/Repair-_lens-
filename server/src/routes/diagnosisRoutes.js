import express from 'express';
import { z } from 'zod';
import { analyzeUploadedImage } from '../services/diagnosisAI.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const diagnosisSchema = z.object({
  fileName: z.string().min(1).optional(),
  category: z.string().optional(),
  deviceBrand: z.string().optional(),
  deviceModel: z.string().optional(),
  userDescription: z.string().optional(),
  imageDataUrl: z.string().min(1).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

router.post('/analyze', requireAuth, async (req, res) => {
  try {
    const parsed = diagnosisSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid diagnosis payload.' });
    }

    const payload = parsed.data;
    const imageDataUrl = payload.imageDataUrl || '';

    if (!imageDataUrl) {
      return res.status(400).json({ success: false, message: 'No image was provided for analysis.' });
    }

    const mimeMatch = imageDataUrl.match(/^data:(image\/(png|jpeg|jpg|webp));base64,/i);
    if (!mimeMatch) {
      return res.status(400).json({ success: false, message: 'Unsupported image format. Please upload a JPG, PNG, or WEBP image.' });
    }

    const mimeType = mimeMatch[1].toLowerCase();
    if (!allowedMimeTypes.has(mimeType)) {
      return res.status(400).json({ success: false, message: 'Unsupported file type.' });
    }

    const diagnosis = await analyzeUploadedImage({
      imageDataUrl,
      fileName: payload.fileName || 'uploaded-image',
      category: payload.category,
      userDescription: payload.userDescription,
      deviceBrand: payload.deviceBrand,
      deviceModel: payload.deviceModel,
      latitude: payload.latitude,
      longitude: payload.longitude,
    });

    return res.json({ success: true, diagnosis });
  } catch (error) {
    console.error('Diagnosis analysis failed:', error);
    return res.status(500).json({ success: false, message: 'AI diagnosis failed. Please retry with a clearer image.' });
  }
});

export default router;
