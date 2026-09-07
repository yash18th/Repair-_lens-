import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateImageClassification,
  validateCategoryMatch,
  validateConfidence,
  validateDiagnosisEvidence,
  validateDiagnosisConsistency
} from '../server/src/services/diagnosisAI.js';
import { estimateRepairCost } from '../server/src/services/repairPriceEstimator.js';

test('Stage 1: Image Quality / Usability Gate rejects blurry or unusable images', () => {
  const blurryPass1 = {
    is_usable: false,
    image_quality: 'blurry',
    rejection_reason: 'Image is too blurry to detect hardware components.'
  };
  const check = validateImageClassification(blurryPass1);
  assert.equal(check.valid, false);
  assert.equal(check.status, 'invalid_image');
  assert.match(check.reason, /blurry|quality/i);
});

test('Stage 2 & 3: Category Consistency Gate rejects random person photo for Smartphone category', () => {
  const personPass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'person',
    object_description: 'An adult standing outdoors in casual attire',
    object_confidence: 96,
    category_match: false,
    category_match_confidence: 0,
    rejection_reason: 'The uploaded image contains a person and no electronic hardware or smartphone is present.'
  };

  const check = validateCategoryMatch(personPass1, 'Smartphone & Tablet');
  assert.equal(check.valid, false);
  assert.equal(check.status, 'invalid_image');
  assert.match(check.reason, /person/i);
});

test('Stage 2 & 3: Category Consistency Gate rejects food or landscape photo for Smartphone category', () => {
  const foodPass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'food',
    category_match: false,
    object_confidence: 92
  };
  const checkFood = validateCategoryMatch(foodPass1, 'Smartphone & Tablet');
  assert.equal(checkFood.valid, false);
  assert.equal(checkFood.status, 'invalid_image');

  const landscapePass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'landscape',
    category_match: false,
    object_confidence: 95
  };
  const checkLandscape = validateCategoryMatch(landscapePass1, 'Smartphone & Tablet');
  assert.equal(checkLandscape.valid, false);
  assert.equal(checkLandscape.status, 'invalid_image');
});

test('Stage 3: Category Consistency Gate rejects vehicle image when Smartphone is selected', () => {
  const vehiclePass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'vehicle',
    object_description: 'A sedan parked on the road',
    object_confidence: 95,
    category_match: false,
    category_match_confidence: 10
  };

  const check = validateCategoryMatch(vehiclePass1, 'Smartphone & Tablet');
  assert.equal(check.valid, false);
  assert.equal(check.status, 'invalid_image');
});

test('Stage 3: Category Consistency Gate accepts vehicle image when Vehicles category is selected', () => {
  const vehiclePass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'vehicle',
    object_confidence: 92,
    category_match: true,
    category_match_confidence: 90
  };

  const check = validateCategoryMatch(vehiclePass1, 'Vehicles');
  assert.equal(check.valid, true);
});

test('Stage 3: Category Consistency Gate accepts smartphone image when Smartphone category is selected', () => {
  const phonePass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'smartphone',
    object_confidence: 94,
    category_match: true,
    category_match_confidence: 95
  };

  const check = validateCategoryMatch(phonePass1, 'Smartphone & Tablet');
  assert.equal(check.valid, true);
});

test('Stage 8: Confidence thresholds reject low confidence detections', () => {
  const lowConfPass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'smartphone',
    object_confidence: 60, // Below 70% threshold
    category_match_confidence: 90
  };

  const check = validateConfidence(lowConfPass1);
  assert.equal(check.valid, false);
  assert.equal(check.status, 'insufficient_evidence');
});

test('Stage 6: Evidence requirement rejects diagnosis lacking visible evidence citations', () => {
  const pass2WithoutEvidence = {
    status: 'valid',
    issue: 'Cracked screen',
    visible_evidence: [] // Empty evidence must be rejected
  };

  const check = validateDiagnosisEvidence(pass2WithoutEvidence);
  assert.equal(check.valid, false);
  assert.equal(check.status, 'insufficient_evidence');
  assert.match(check.reason, /visual evidence/i);
});

test('Stage 4 & 5: Localization consistency rejects front screen diagnosis when only rear panel is visible', () => {
  const pass1RearOnly = {
    visible_device_elements: ['back panel', 'rear camera module', 'manufacturer logo']
  };
  const pass2FrontDiagnosis = {
    issue: 'Cracked front display screen',
    visible_evidence: ['Spiderweb crack']
  };

  const check = validateDiagnosisConsistency(pass1RearOnly, pass2FrontDiagnosis);
  assert.equal(check.valid, false);
  assert.equal(check.status, 'insufficient_evidence');
  assert.match(check.reason, /rear panel/i);
});

test('Price Estimator computes realistic range for verified device repair', () => {
  const result = estimateRepairCost({
    category: 'Smartphone & Tablet',
    issue: 'Cracked display',
    severity: 'High',
    brand: 'Samsung',
    model: 'Galaxy S21'
  });

  assert.ok(result.estimatedTotalMin > 0);
  assert.ok(result.estimatedTotalMax >= result.estimatedTotalMin);
  assert.equal(result.currency, 'INR');
});
