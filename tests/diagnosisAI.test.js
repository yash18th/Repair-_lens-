import test from 'node:test';
import assert from 'node:assert/strict';

import { estimateRepairCost, inferCategoryFromImage } from '../server/src/services/diagnosisAI.js';

test('inferCategoryFromImage identifies smartphone damage from uploaded image metadata', () => {
  const result = inferCategoryFromImage({
    category: 'phone',
    fileName: 'cracked-phone-display.jpg',
    mimeType: 'image/jpeg',
    userDescription: 'screen cracked on front'
  });

  assert.equal(result.category, 'Smartphone & Tablet');
  assert.match(result.reason, /smartphone|phone/i);
});

test('estimateRepairCost returns a realistic range for a high-severity display repair', () => {
  const result = estimateRepairCost({
    category: 'Smartphone & Tablet',
    issue: 'Cracked display',
    severity: 'High',
    brand: 'Apple',
    model: 'iPhone 13'
  });

  assert.ok(result.min > 0);
  assert.ok(result.max > result.min);
  assert.equal(result.currency, 'INR');
  assert.match(result.label, /₹|INR/i);
});
