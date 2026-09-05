import express from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../db.js';
import { analyzeUploadedImages } from '../services/diagnosisAI.js';
import { estimateRepairCost } from '../services/repairPriceEstimator.js';

const router = express.Router();
const dataUrl = z.string().regex(/^data:image\/(png|jpeg|jpg|webp);base64,/i);
const schema = z.object({ images: z.array(z.object({ slot: z.string().optional(), name: z.string().max(255).optional(), dataUrl })).min(1).max(4), category: z.string().max(80).optional(), deviceBrand: z.string().max(100).optional(), deviceModel: z.string().max(100).optional(), userDescription: z.string().max(2000).optional(), latitude: z.number().min(-90).max(90).optional(), longitude: z.number().min(-180).max(180).optional() });
const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
function validateImages(images) { for (const image of images) { const bytes = Math.floor((image.dataUrl.split(',')[1]?.length || 0) * 0.75); if (bytes > MAX_IMAGE_BYTES) { const error = new Error('Each image must be 7 MB or smaller.'); error.statusCode = 413; throw error; } } }

router.post('/analyze', requireAuth, async (req, res) => {
  try {
    const parsed = schema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid image payload.' });
    validateImages(parsed.data.images);
    const diagnosis = await analyzeUploadedImages(parsed.data);
    const issueEstimates = diagnosis.issues.map(item => ({ ...item, estimate: estimateRepairCost({ category: diagnosis.category, deviceType: diagnosis.deviceType, brand: diagnosis.brand, model: diagnosis.model, issue: item.issue, affectedComponents: item.affectedComponents, severity: item.severity, repairComplexity: item.repairComplexity }) }));
    const price = issueEstimates.reduce((total, item) => ({ partsCostMin: total.partsCostMin + item.estimate.partsCostMin, partsCostMax: total.partsCostMax + item.estimate.partsCostMax, laborCostMin: total.laborCostMin + item.estimate.laborCostMin, laborCostMax: total.laborCostMax + item.estimate.laborCostMax, estimatedTotalMin: total.estimatedTotalMin + item.estimate.estimatedTotalMin, estimatedTotalMax: total.estimatedTotalMax + item.estimate.estimatedTotalMax }), { partsCostMin: 0, partsCostMax: 0, laborCostMin: 0, laborCostMax: 0, estimatedTotalMin: 0, estimatedTotalMax: 0, currency: 'INR' });
    const reportId = `RL-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const scan = await prisma.scan.create({ data: { reportId, userId: req.user.id, category: diagnosis.category, deviceType: diagnosis.deviceType, deviceName: [diagnosis.brand, diagnosis.model].filter(v => v && v !== 'Unknown').join(' ') || diagnosis.deviceType, issueDescription: diagnosis.issues.map(i => i.issue).join('; ') || 'Insufficient visible evidence', problemDescription: diagnosis.issues.map(i => i.damageDescription).join(' ') || diagnosis.uncertainty, diagnosis: diagnosis.issues.map(i => i.issue).join('; ') || 'Low-confidence visual assessment', severity: diagnosis.severity, confidence: diagnosis.confidence * 100, recommendation: diagnosis.recommendedSolution, estimatedRepairCost: `₹${price.estimatedTotalMin.toLocaleString('en-IN')} – ₹${price.estimatedTotalMax.toLocaleString('en-IN')}`, estimatedCost: `₹${price.estimatedTotalMin.toLocaleString('en-IN')} – ₹${price.estimatedTotalMax.toLocaleString('en-IN')}`, costMin: String(price.estimatedTotalMin), costMax: String(price.estimatedTotalMax), imageCount: parsed.data.images.length, uploadedImageUrl: null, latitude: parsed.data.latitude ?? null, longitude: parsed.data.longitude ?? null, analysisData: { diagnosis, issueEstimates, price, imageSlots: parsed.data.images.map(i => i.slot || 'image') } } });
    res.status(201).json({ success: true, reportId, scanId: scan.id, diagnosis: { ...diagnosis, issues: issueEstimates, price } });
  } catch (error) { if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message }); console.error('Diagnosis analysis failed:', error.message); return res.status(500).json({ success: false, message: 'AI diagnosis failed. Please retry with clearer images.' }); }
});
export default router;
