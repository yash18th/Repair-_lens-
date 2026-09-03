import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyDamageImage } from '../server/model.js';

test('classifies common smartphone screen damage from image metadata', () => {
  const result = classifyDamageImage({
    filename: 'cracked-phone-screen.jpg',
    category: 'phone',
    imageUrl: 'https://example.com/cracked-screen.jpg'
  });

  assert.equal(result.category, 'phone');
  assert.match(result.problemTitle.toLowerCase(), /screen|display|glass/);
  assert.ok(result.confidence > 0.7);
});

test('classifies automotive paint damage from a bumper photo', () => {
  const result = classifyDamageImage({
    filename: 'bumper-scrape.jpg',
    category: 'auto',
    imageUrl: 'https://example.com/bumper.jpg'
  });

  assert.equal(result.category, 'auto');
  assert.match(result.problemTitle.toLowerCase(), /bumper|paint|scrape|dent/);
});
