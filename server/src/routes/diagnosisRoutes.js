import express from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { requireAuth } from '../middleware/auth.js';
import { requireActiveSubscription } from '../middleware/subscription.js';
import { prisma } from '../db.js';
import { analyzeUploadedImages } from '../services/diagnosisAI.js';
import { estimateRepairCost } from '../services/repairPriceEstimator.js';

const router = express.Router();
const dataUrl = z.string().regex(/^data:image\/(png|jpeg|jpg|webp);base64,/i);
const schema = z.object({ images: z.array(z.object({ slot: z.string().optional(), name: z.string().max(255).optional(), dataUrl })).min(1).max(4), category: z.string().max(80).optional(), deviceBrand: z.string().max(100).optional(), deviceModel: z.string().max(100).optional(), userDescription: z.string().max(2000).optional(), latitude: z.number().min(-90).max(90).optional(), longitude: z.number().min(-180).max(180).optional() });
const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
function validateImages(images) { for (const image of images) { const bytes = Math.floor((image.dataUrl.split(',')[1]?.length || 0) * 0.75); if (bytes > MAX_IMAGE_BYTES) { const error = new Error('Each image must be 7 MB or smaller.'); error.statusCode = 413; throw error; } } }

router.post('/analyze', requireAuth, requireActiveSubscription, async (req, res) => {
  console.log('[Diagnosis] request received', {
    userId: req.user?.id,
    category: req.body?.category,
    imageCount: Array.isArray(req.body?.images) ? req.body.images.length : 0,
    imageBytes: Array.isArray(req.body?.images)
      ? req.body.images.map((image) => image?.dataUrl?.length || 0)
      : [],
  });
  try {
    const parsed = schema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid image payload.' });
    validateImages(parsed.data.images);
    console.log('[Diagnosis] images validated', { userId: req.user.id, imageCount: parsed.data.images.length });
    console.log('[Diagnosis] starting AI request', { userId: req.user.id, category: parsed.data.category });
    const diagnosis = await analyzeUploadedImages(parsed.data);
    console.log('[Diagnosis] AI response received', { userId: req.user.id, status: diagnosis.status, valid: diagnosis.valid_for_diagnosis });

    const reportId = `RL-${Date.now()}-${randomUUID().slice(0, 8)}`;

    // STAGE: Dedicated AI analysis format error or provider error handling
    if (diagnosis.status === 'analysis_error' || diagnosis.status === 'provider_error') {
      const isProvider = diagnosis.status === 'provider_error';
      const scan = await prisma.scan.create({
        data: {
          reportId,
          userId: req.user.id,
          category: diagnosis.selected_category || parsed.data.category || 'Other',
          deviceType: diagnosis.detected_object || 'Unknown',
          deviceName: diagnosis.detected_object || 'Diagnostic Engine',
          issueDescription: diagnosis.rejection_reason || (isProvider ? 'AI service temporarily unavailable' : 'AI analysis format error'),
          problemDescription: diagnosis.suggested_action || diagnosis.rejection_reason || 'AI diagnosis could not be completed.',
          diagnosis: isProvider ? 'Provider Service Unavailable' : 'AI Analysis Format Error',
          severity: 'Low',
          confidence: 0,
          recommendation: diagnosis.suggested_action || 'Please retry the diagnosis.',
          estimatedRepairCost: null,
          estimatedCost: null,
          costMin: null,
          costMax: null,
          imageCount: parsed.data.images.length,
          uploadedImageUrl: null,
          latitude: parsed.data.latitude ?? null,
          longitude: parsed.data.longitude ?? null,
          analysisData: { diagnosis, price: null, imageSlots: parsed.data.images.map(i => i.slot || 'image') }
        }
      });
      console.log(`[Diagnosis] ${diagnosis.status} scan recorded`, { userId: req.user.id, reportId, scanId: scan.id });
      return res.status(200).json({
        success: true,
        reportId,
        scanId: scan.id,
        diagnosis: {
          ...diagnosis,
          issues: [],
          price: null
        }
      });
    }

    // STAGE 9 & STAGE 13: Invalid image or insufficient evidence
    if (diagnosis.status === 'invalid_image' || diagnosis.status === 'insufficient_evidence' || !diagnosis.valid_for_diagnosis) {
      const isInvalid = diagnosis.status === 'invalid_image' || !diagnosis.valid_for_diagnosis;
      const scan = await prisma.scan.create({
        data: {
          reportId,
          userId: req.user.id,
          category: diagnosis.selected_category || parsed.data.category || 'Other',
          deviceType: diagnosis.detected_object || 'Unknown',
          deviceName: diagnosis.detected_object || 'Unrecognized',
          issueDescription: diagnosis.rejection_reason || (isInvalid ? 'Image invalid for diagnosis' : 'Insufficient visual evidence'),
          problemDescription: diagnosis.suggested_action || diagnosis.rejection_reason || 'Image not suitable for diagnostic evaluation',
          diagnosis: isInvalid ? 'Invalid Image / Category Mismatch' : 'Insufficient Visual Evidence',
          severity: 'Low',
          confidence: diagnosis.object_confidence || 0,
          recommendation: diagnosis.suggested_action || 'Please upload a clear, focused photo of the selected device.',
          estimatedRepairCost: null,
          estimatedCost: null,
          costMin: null,
          costMax: null,
          imageCount: parsed.data.images.length,
          uploadedImageUrl: null,
          latitude: parsed.data.latitude ?? null,
          longitude: parsed.data.longitude ?? null,
          analysisData: { diagnosis, price: null, imageSlots: parsed.data.images.map(i => i.slot || 'image') }
        }
      });
      console.log('[Diagnosis] invalid/insufficient scan recorded', { userId: req.user.id, reportId, scanId: scan.id });
      return res.status(200).json({
        success: true,
        reportId,
        scanId: scan.id,
        diagnosis: {
          ...diagnosis,
          issues: [],
          price: null
        }
      });
    }

    // STAGE 10: No visible damage detected on valid device
    if (diagnosis.status === 'no_visible_damage') {
      const price = {
        partsCostMin: 0,
        partsCostMax: 0,
        laborCostMin: 0,
        laborCostMax: 0,
        estimatedTotalMin: 0,
        estimatedTotalMax: 0,
        currency: 'INR'
      };
      const scan = await prisma.scan.create({
        data: {
          reportId,
          userId: req.user.id,
          category: diagnosis.category || parsed.data.category || 'Other',
          deviceType: diagnosis.deviceType || diagnosis.detected_object || 'Device',
          deviceName: [diagnosis.brand, diagnosis.model].filter(v => v && v !== 'Unknown').join(' ') || diagnosis.deviceType || 'Device',
          issueDescription: 'No visible physical damage detected',
          problemDescription: diagnosis.plainEnglishSummary || diagnosis.summary || 'Device exterior appears intact with no visible structural cracks or defect.',
          diagnosis: 'No Visible Damage Detected',
          severity: 'Low',
          confidence: (diagnosis.damage_confidence || 95),
          recommendation: diagnosis.recommendedSolution || 'No physical repairs required. Device exterior is intact.',
          estimatedRepairCost: '₹0',
          estimatedCost: '₹0',
          costMin: '0',
          costMax: '0',
          imageCount: parsed.data.images.length,
          uploadedImageUrl: null,
          latitude: parsed.data.latitude ?? null,
          longitude: parsed.data.longitude ?? null,
          analysisData: { diagnosis, price, imageSlots: parsed.data.images.map(i => i.slot || 'image') }
        }
      });
      console.log('[Diagnosis] no visible damage recorded', { userId: req.user.id, reportId, scanId: scan.id });
      return res.status(200).json({
        success: true,
        reportId,
        scanId: scan.id,
        diagnosis: {
          ...diagnosis,
          issues: [],
          price
        }
      });
    }

    // STAGE 5 & 11: Valid damage diagnosis (Unified Multi-Component & Multi-Angle Estimation)
    const combinedAffectedComponents = Array.from(new Set([
      ...(diagnosis.affectedComponents || []),
      ...(diagnosis.affected_components || []),
      ...(diagnosis.issues || []).flatMap(i => i.affectedComponents || i.affected_components || [])
    ]));

    const price = estimateRepairCost({
      category: diagnosis.category,
      deviceType: diagnosis.deviceType,
      brand: diagnosis.brand,
      model: diagnosis.model,
      variant: diagnosis.variant,
      generation: diagnosis.generation,
      year: diagnosis.year,
      bodyType: diagnosis.bodyType,
      orientation: diagnosis.orientation,
      issue: (diagnosis.issues || []).map(i => i.issue).join('; ') || diagnosis.summary,
      affectedComponents: combinedAffectedComponents,
      damageDetails: diagnosis.component_damages || diagnosis.issues,
      severity: diagnosis.severity || 'Medium',
      repairComplexity: diagnosis.repairComplexity || 'Medium'
    });

    const issueEstimates = (diagnosis.issues || []).map(item => ({
      ...item,
      estimate: price
    }));

    console.log('[Diagnosis] saving valid damage scan', { userId: req.user.id, reportId });
    const scan = await prisma.scan.create({
      data: {
        reportId,
        userId: req.user.id,
        category: diagnosis.category,
        deviceType: diagnosis.deviceType,
        deviceName: [diagnosis.brand, diagnosis.model].filter(v => v && v !== 'Unknown').join(' ') || diagnosis.deviceType,
        issueDescription: issueEstimates.map(i => i.issue).join('; ') || 'Physical damage identified',
        problemDescription: issueEstimates.map(i => i.damageDescription).join(' ') || diagnosis.plainEnglishSummary,
        diagnosis: issueEstimates.map(i => i.issue).join('; ') || 'Visual damage confirmed',
        severity: diagnosis.severity || 'Medium',
        confidence: Math.round((diagnosis.confidence || 0.85) * 100),
        recommendation: diagnosis.recommendedSolution,
        estimatedRepairCost: `₹${price.estimatedTotalMin.toLocaleString('en-IN')} – ₹${price.estimatedTotalMax.toLocaleString('en-IN')}`,
        estimatedCost: `₹${price.estimatedTotalMin.toLocaleString('en-IN')} – ₹${price.estimatedTotalMax.toLocaleString('en-IN')}`,
        costMin: String(price.estimatedTotalMin),
        costMax: String(price.estimatedTotalMax),
        imageCount: parsed.data.images.length,
        uploadedImageUrl: null,
        latitude: parsed.data.latitude ?? null,
        longitude: parsed.data.longitude ?? null,
        analysisData: { diagnosis, issueEstimates, price, imageSlots: parsed.data.images.map(i => i.slot || 'image') }
      }
    });

    console.log('[Diagnosis] completed', { userId: req.user.id, reportId, scanId: scan.id });
    res.status(201).json({ success: true, reportId, scanId: scan.id, diagnosis: { ...diagnosis, issues: issueEstimates, price } });
  } catch (error) {
    console.error('[Diagnosis] failed:', error.stack || error);
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, code: error.code || 'DIAGNOSIS_FAILED', message: error.message });
    return res.status(500).json({ success: false, code: 'DIAGNOSIS_INTERNAL_ERROR', message: error.message || 'AI diagnosis failed.' });
  }
});
export default router;
