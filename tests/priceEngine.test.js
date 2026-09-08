import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  detectVehicleClass, 
  generateRealisticRepairEstimate, 
  runCostSanityCheck,
  calculatePaintAndBodywork,
  calculateCalibrationAndDiagnostics,
  VEHICLE_CLASSES
} from '../src/services/priceEngine.js';

test('Price Engine: Accurately classifies vehicle market tiers', () => {
  assert.equal(detectVehicleClass('BMW', '3 Series (F30)'), VEHICLE_CLASSES.LUXURY);
  assert.equal(detectVehicleClass('Mercedes-Benz', 'C-Class'), VEHICLE_CLASSES.LUXURY);
  assert.equal(detectVehicleClass('Audi', 'A4'), VEHICLE_CLASSES.LUXURY);
  assert.equal(detectVehicleClass('Toyota', 'Fortuner'), VEHICLE_CLASSES.PREMIUM);
  assert.equal(detectVehicleClass('Skoda', 'Octavia'), VEHICLE_CLASSES.PREMIUM);
  assert.equal(detectVehicleClass('Hyundai', 'Creta'), VEHICLE_CLASSES.MID_RANGE);
  assert.equal(detectVehicleClass('Honda', 'City'), VEHICLE_CLASSES.MID_RANGE);
  assert.equal(detectVehicleClass('Maruti Suzuki', 'Swift'), VEHICLE_CLASSES.ECONOMY);
});

test('Price Engine: Generates realistic market-based estimate for severe luxury front collision (NO ₹2,188 absurdities)', () => {
  const result = generateRealisticRepairEstimate({
    category: 'Vehicles',
    brand: 'BMW',
    model: '3 Series (F30)',
    variant: '320d Luxury Line',
    year: '2017',
    bodyType: 'Sedan',
    orientation: 'Front-end collision',
    affectedComponents: [
      'Front Bumper Cover / Fascia',
      'Left Headlamp Assembly (LED/Matrix)',
      'Hood / Engine Bonnet',
      'Front Radiator Grille & Kidney Trim',
      'Front Bumper Reinforcement / Crash Beam'
    ],
    severity: 'High',
    locationCity: 'Bengaluru'
  });

  // 1. Total estimate must reflect realistic market pricing (> ₹1,00,000)
  assert.ok(result.estimateSummary.low > 100000, `Expected low estimate > 100,000, got ${result.estimateSummary.low}`);
  assert.ok(result.estimateSummary.mostLikely > result.estimateSummary.low, 'Most likely estimate must exceed low estimate');
  assert.ok(result.estimateSummary.high > result.estimateSummary.mostLikely, 'High estimate must exceed most likely');

  // 2. Confirmed parts must be itemized with OEM and Aftermarket ranges
  assert.equal(result.confirmedParts.items.length, 5);
  assert.ok(result.confirmedParts.subtotalOEM[0] > 80000);

  // 3. Paint & bodywork must be multi-step and itemized
  assert.ok(result.bodyAndPaint.panelsCount > 0);
  assert.ok(result.bodyAndPaint.totalPaintCostMin > 10000);
  assert.ok(result.bodyAndPaint.breakdown.length >= 4);

  // 4. Labor operations must calculate flat-rate hours
  assert.ok(result.laborOperations.totalHours > 5);
  assert.ok(result.laborOperations.costGeneral > 5000);

  // 5. Calibration & diagnostic scans must be included
  assert.ok(result.calibrationAndDiagnostics.totalMin > 0);

  // 6. Potential hidden damage must be separated from confirmed total
  assert.ok(result.potentialHiddenDamage.allowanceMin > 0);
  assert.match(result.potentialHiddenDamage.note, /NOT added/i);

  // 7. Audit trail calculation steps must be provided
  assert.ok(result.calculationSteps.length >= 5);
});

test('Price Engine: Multi-Angle Damage Fusion deduplicates components across photos', () => {
  // If angle 1 and angle 2 both cite front bumper, fusion must not charge twice
  const result = generateRealisticRepairEstimate({
    category: 'Vehicles',
    brand: 'Honda',
    model: 'City',
    affectedComponents: [
      'Front Bumper',
      'Front Bumper Cover / Fascia', // Duplicate
      'Left Headlamp'
    ],
    locationCity: 'Mumbai'
  });

  // Front bumper should be deduplicated to 1 item + left headlamp = 2 items
  assert.equal(result.confirmedParts.items.length, 2);
});

test('Price Engine: Cost sanity check flags and recalibrates unrealistically low numbers', () => {
  const sanityLuxury = runCostSanityCheck({
    vehicleClass: VEHICLE_CLASSES.LUXURY,
    confirmedComponentsCount: 4,
    severity: 'High',
    calculatedTotalMin: 2188 // Intentionally absurd test input
  });

  assert.equal(sanityLuxury.isSanityFlagged, true);
  assert.equal(sanityLuxury.status, 'ADJUSTED_TO_MARKET_FLOOR');
  assert.ok(sanityLuxury.recommendedMinimum >= 85000);
});

test('Price Engine: Flags provisional vehicle identification when make is unverified', () => {
  const provisional = generateRealisticRepairEstimate({
    category: 'Vehicles',
    brand: 'Unknown',
    model: 'Unknown',
    affectedComponents: ['Front Bumper Cover']
  });

  assert.equal(provisional.vehicleIdentification.isProvisional, true);
  assert.ok(provisional.vehicleIdentification.confidence < 85);
});

test('Price Engine [Smartphone]: Generates realistic market-based estimate for flagship iPhone', () => {
  const result = generateRealisticRepairEstimate({
    category: 'Smartphone & Tablet',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    affectedComponents: [
      'OLED Display & Touch Digitizer',
      'Rear Enclosure Glass'
    ],
    severity: 'High',
    locationCity: 'Bengaluru'
  });

  // Flagship OLED display + rear glass must be realistic (typically > ₹15,000 for iPhone 15 Pro Max)
  assert.ok(result.estimateSummary.low >= 12000, `Expected low >= 12000, got ${result.estimateSummary.low}`);
  assert.ok(result.estimateSummary.mostLikely > result.estimateSummary.low);
  assert.ok(result.estimateSummary.high > result.estimateSummary.mostLikely);
  assert.equal(result.confirmedParts.items.length, 2);
  assert.ok(result.laborOperations.totalHours > 1.0);
  assert.ok(result.calibrationAndDiagnostics.totalMin > 0);
  assert.ok(result.potentialHiddenDamage.allowanceMin > 0);
  assert.match(result.vehicleIdentification.vehicleClass, /FLAGSHIP/i);
});

test('Price Engine [Computer]: Generates realistic estimate for workstation MacBook Pro', () => {
  const result = generateRealisticRepairEstimate({
    category: 'Computers & Laptops',
    brand: 'Apple',
    model: 'MacBook Pro 14"',
    affectedComponents: [
      'Retina Display Panel Assembly',
      'Top Case, Trackpad & Backlit Keyboard'
    ],
    severity: 'High'
  });

  // MacBook Retina display + topcase assembly is typically > ₹25,000
  assert.ok(result.estimateSummary.low >= 20000, `Expected low >= 20000, got ${result.estimateSummary.low}`);
  assert.ok(result.estimateSummary.mostLikely > result.estimateSummary.low);
  assert.equal(result.confirmedParts.items.length, 2);
  assert.ok(result.calibrationAndDiagnostics.totalMin > 0);
  assert.match(result.vehicleIdentification.vehicleClass, /WORKSTATION/i);
});

test('Price Engine [Electronics]: Generates realistic estimate for industrial PCB micro-soldering', () => {
  const result = generateRealisticRepairEstimate({
    category: 'Electronics & PCB',
    brand: 'Siemens',
    model: 'Industrial Motor Controller Board',
    affectedComponents: [
      'Power Switching MOSFET',
      'Copper Power Plane Trace'
    ],
    severity: 'Critical'
  });

  assert.ok(result.estimateSummary.low >= 3000, `Expected low >= 3000, got ${result.estimateSummary.low}`);
  assert.ok(result.laborOperations.totalHours > 1.5);
  assert.ok(result.calibrationAndDiagnostics.totalMin > 0);
  assert.equal(result.confirmedParts.items.length, 2);
});

test('Price Engine [Home Appliance]: Generates realistic estimate for inverter appliance repair', () => {
  const result = generateRealisticRepairEstimate({
    category: 'Home Appliance',
    brand: 'LG',
    model: 'Inverter Front-Load Washing Machine',
    affectedComponents: [
      'BLDC Inverter Compressor Pump / Motor',
      'Perimeter Door Seal Gasket'
    ],
    severity: 'High'
  });

  assert.ok(result.estimateSummary.low >= 5000, `Expected low >= 5000, got ${result.estimateSummary.low}`);
  assert.ok(result.confirmedParts.items.length, 2);
  assert.ok(result.calibrationAndDiagnostics.totalMin > 0);
  assert.ok(result.potentialHiddenDamage.allowanceMin > 0);
});

test('Price Engine [Other]: Generates realistic estimate for industrial power tool overhaul', () => {
  const result = generateRealisticRepairEstimate({
    category: 'Other',
    brand: 'Bosch Professional',
    model: 'GBH 2-28 Rotary Hammer',
    affectedComponents: [
      'Motor Armature & Stator Rotor',
      'Reduction Planetary Gearbox'
    ],
    severity: 'Medium'
  });

  assert.ok(result.estimateSummary.low >= 3000, `Expected low >= 3000, got ${result.estimateSummary.low}`);
  assert.equal(result.confirmedParts.items.length, 2);
  assert.ok(result.laborOperations.totalHours > 1.5);
});

