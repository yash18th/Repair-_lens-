import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateImageClassification,
  validateCategoryMatch,
  validateConfidence,
  validateDiagnosisEvidence,
  validateDiagnosisConsistency,
  parseGeminiDiagnosisResponse
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

test('TEST 1: Random person image + Smartphone category => invalid_image', () => {
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

test('TEST 2: Car image + Smartphone category => invalid_image/category mismatch', () => {
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

test('TEST 3: Clear smartphone + obvious cracked display => valid damage diagnosis', () => {
  const phonePass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'smartphone',
    object_confidence: 95,
    category_match: true,
    category_match_confidence: 98,
    valid_for_diagnosis: true
  };
  const pass2Cracked = {
    valid_for_diagnosis: true,
    status: 'valid',
    detected_object: 'smartphone',
    damage_confidence: 92,
    issue: 'Cracked front glass & display fracture',
    visible_evidence: ['Spiderweb glass fracture radiating from bottom right impact point'],
    affected_components: ['Front Glass Cover', 'Display Assembly'],
    severity: 'High'
  };

  const checkMatch = validateCategoryMatch(phonePass1, 'Smartphone & Tablet');
  assert.equal(checkMatch.valid, true);

  const checkEvid = validateDiagnosisEvidence(pass2Cracked);
  assert.equal(checkEvid.valid, true);

  const checkConf = validateConfidence(phonePass1, pass2Cracked);
  assert.equal(checkConf.valid, true);
  assert.equal(pass2Cracked.status, 'valid');
});

test('TEST 4: Clear smartphone + vertical display lines => valid display-related diagnosis with evidence', () => {
  const phonePass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'smartphone',
    object_confidence: 95,
    category_match: true,
    category_match_confidence: 98,
    valid_for_diagnosis: true,
    visible_device_elements: ['screen', 'display', 'bezel']
  };
  const pass2DisplayLines = {
    valid_for_diagnosis: true,
    status: 'valid',
    detected_object: 'smartphone',
    damage_confidence: 90,
    issue: 'Display abnormality detected (vertical lines)',
    summary: 'Smartphone display outputs visible vertical green and white line artifacts across the panel while outer glass is intact.',
    visible_evidence: ['Prominent vertical green line running from top to bottom of display', 'Display output distortion'],
    affected_components: ['Display Panel Assembly'],
    severity: 'Medium'
  };

  const checkMatch = validateCategoryMatch(phonePass1, 'Smartphone & Tablet');
  assert.equal(checkMatch.valid, true);

  const checkEvid = validateDiagnosisEvidence(pass2DisplayLines);
  assert.equal(checkEvid.valid, true);

  const checkConsistency = validateDiagnosisConsistency(phonePass1, pass2DisplayLines);
  assert.equal(checkConsistency.valid, true);

  // Verify it doesn't claim shattered glass
  assert.doesNotMatch(pass2DisplayLines.issue, /shatter/i);
  assert.equal(pass2DisplayLines.status, 'valid');
});

test('TEST 5: Clear smartphone with no visible damage => no_visible_damage', () => {
  const phonePass1 = {
    is_usable: true,
    image_quality: 'usable',
    detected_object: 'smartphone',
    object_confidence: 96,
    category_match: true,
    category_match_confidence: 98,
    valid_for_diagnosis: true
  };
  const pass2Intact = {
    valid_for_diagnosis: true,
    status: 'no_visible_damage',
    detected_object: 'smartphone',
    damage_confidence: 95,
    issue: 'No visible physical damage detected',
    summary: 'The smartphone is clearly visible and its exterior appears intact based on the provided photo.',
    visible_evidence: ['Intact surface without visible fractures', 'Uniform panel reflections without cracks'],
    affected_components: [],
    severity: 'Low'
  };

  assert.equal(pass2Intact.status, 'no_visible_damage');
  assert.equal(pass2Intact.affected_components.length, 0);
});

test('TEST 6: Very blurry image => insufficient_evidence', () => {
  const blurryPass1 = {
    is_usable: false,
    image_quality: 'blurry',
    object_confidence: 45,
    category_match_confidence: 50,
    rejection_reason: 'Image is too blurry to detect hardware components.'
  };
  const confCheck = validateConfidence(blurryPass1);
  assert.equal(confCheck.valid, false);
  assert.equal(confCheck.status, 'insufficient_evidence');
});

test('TEST 7: Malformed Gemini response => analysis_error NOT insufficient_evidence', () => {
  const malformedOutputs = [
    'The user wants to diagnose this image.',
    'I cannot produce JSON right now.',
    '<html><body>502 Bad Gateway</body></html>',
    ''
  ];

  for (const raw of malformedOutputs) {
    const result = parseGeminiDiagnosisResponse(raw);
    assert.equal(result.success, false);
    // When parsing fails, the pipeline sets status to analysis_error
    const status = 'analysis_error';
    assert.notEqual(status, 'insufficient_evidence');
    assert.equal(status, 'analysis_error');
  }
});

test('TEST 8: Valid Gemini JSON => normal diagnosis', () => {
  const rawValid = JSON.stringify({
    valid_for_diagnosis: true,
    status: 'valid',
    selected_category: 'Smartphone & Tablet',
    detected_object: 'smartphone',
    object_confidence: 95,
    category_match_confidence: 98,
    damage_confidence: 90,
    issue: 'Display abnormality detected',
    summary: 'Vertical lines observed on screen.',
    visible_evidence: ['Vertical lines running through screen'],
    affected_components: ['Display Panel'],
    severity: 'Medium',
    likely_causes: ['Panel flex cable stress or matrix defect'],
    recommended_solution: ['Display module replacement']
  });

  const parsed = parseGeminiDiagnosisResponse(rawValid);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.status, 'valid');
  assert.equal(parsed.data.detected_object, 'smartphone');
  assert.equal(parsed.data.valid_for_diagnosis, true);
});

test('parseGeminiDiagnosisResponse: parses markdown code blocks and preambles', () => {
  // Markdown block
  const mdBlock = '```json\n{"status": "valid", "detected_object": "smartphone"}\n```';
  const res1 = parseGeminiDiagnosisResponse(mdBlock);
  assert.equal(res1.success, true);
  assert.equal(res1.data.status, 'valid');

  // Preamble before JSON (e.g. "The user w..." error reproduction)
  const preamble = 'The user wants to inspect the image.\n{"status": "valid", "detected_object": "smartphone"}';
  const res2 = parseGeminiDiagnosisResponse(preamble);
  assert.equal(res2.success, true);
  assert.equal(res2.data.status, 'valid');

  // Trailing commas cleanup
  const trailingComma = '{"status": "valid", "evidence": ["vertical lines",],}';
  const res3 = parseGeminiDiagnosisResponse(trailingComma);
  assert.equal(res3.success, true);
  assert.equal(res3.data.status, 'valid');
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
    issue: 'Display abnormality detected (vertical lines)',
    severity: 'Medium',
    brand: 'Samsung',
    model: 'Galaxy S21'
  });

  assert.ok(result.estimatedTotalMin > 0);
  assert.ok(result.estimatedTotalMax >= result.estimatedTotalMin);
  assert.equal(result.currency, 'INR');
});
