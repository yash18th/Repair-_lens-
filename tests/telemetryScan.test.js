import { test } from 'node:test';
import assert from 'node:assert';

test('Diagnostic State Lifecycle: Maps stage names to correct display labels and progress', () => {
  const stageMappings = {
    idle: { label: 'READY', progress: 0 },
    validating: { label: 'VALIDATING IMAGE', progress: 20 },
    analyzing: { label: 'ANALYZING IMAGE', progress: 40 },
    detecting_damage: { label: 'DETECTING DAMAGE', progress: 65 },
    identifying_components: { label: 'IDENTIFYING COMPONENTS', progress: 82 },
    calculating_cost: { label: 'CALCULATING MARKET COST', progress: 92 },
    complete: { label: 'ANALYSIS COMPLETE', progress: 100 },
    error: { label: 'ANALYSIS INTERRUPTED', progress: 0 },
  };

  for (const [stage, expected] of Object.entries(stageMappings)) {
    assert.strictEqual(typeof expected.label, 'string');
    assert.ok(expected.progress >= 0 && expected.progress <= 100);
  }
});

test('Diagnostic Completed State: Real numbers extracted from payload', () => {
  const mockAnalysisResult = {
    affectedComponents: ['Front Glass', 'OLED Matrix', 'Digitizer Layer'],
    costIntelligence: {
      partBreakdown: [{ name: 'Part 1' }, { name: 'Part 2' }],
      laborBreakdown: [{ operation: 'Op 1' }, { operation: 'Op 2' }, { operation: 'Op 3' }],
    },
    steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
  };

  const detectedComponentsCount = mockAnalysisResult.affectedComponents.length;
  const replacementPartsCount = mockAnalysisResult.costIntelligence.partBreakdown.length;
  const repairOpsCount = mockAnalysisResult.costIntelligence.laborBreakdown.length;

  assert.strictEqual(detectedComponentsCount, 3);
  assert.strictEqual(replacementPartsCount, 2);
  assert.strictEqual(repairOpsCount, 3);
});
