const CATEGORY_BASE = {
  'Smartphone & Tablet': { partsMin: 2000, partsMax: 14000, laborMin: 500, laborMax: 2500 },
  'Laptop & Computer': { partsMin: 3000, partsMax: 18000, laborMin: 600, laborMax: 3500 },
  'Electronics & PCB': { partsMin: 1000, partsMax: 8000, laborMin: 400, laborMax: 2200 },
  'Home Appliance': { partsMin: 1500, partsMax: 12000, laborMin: 500, laborMax: 2200 },
  Vehicles: { partsMin: 2500, partsMax: 20000, laborMin: 700, laborMax: 3000 },
  Other: { partsMin: 1200, partsMax: 9000, laborMin: 400, laborMax: 2000 }
};

const SEVERITY_MULTIPLIER = {
  Low: 0.9,
  Medium: 1,
  High: 1.3,
  Critical: 1.7
};

const COMPLEXITY_MULTIPLIER = {
  Low: 0.9,
  Medium: 1,
  High: 1.25,
  Very High: 1.45
};

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function estimateRepairCost({
  category = 'Other',
  deviceType = 'device',
  brand = 'Unknown',
  model = 'Unknown',
  issue = 'Issue detected',
  affectedComponents = [],
  severity = 'Medium',
  repairComplexity = 'Medium',
  currency = 'INR',
}) {
  const base = CATEGORY_BASE[category] || CATEGORY_BASE.Other;
  const issueText = String(issue || '').toLowerCase();
  const componentCount = Array.isArray(affectedComponents) ? affectedComponents.length : 1;

  let partsMin = base.partsMin;
  let partsMax = base.partsMax;
  let laborMin = base.laborMin;
  let laborMax = base.laborMax;

  if (issueText.includes('display') || issueText.includes('screen') || issueText.includes('lcd') || issueText.includes('oled')) {
    partsMin *= 1.25;
    partsMax *= 1.3;
  }

  if (issueText.includes('battery')) {
    partsMin *= 1.1;
    partsMax *= 1.2;
  }

  if (issueText.includes('burn') || issueText.includes('board') || issueText.includes('pcb') || issueText.includes('circuit')) {
    partsMin *= 1.3;
    partsMax *= 1.35;
  }

  if (issueText.includes('bumper') || issueText.includes('dent') || issueText.includes('scratch') || issueText.includes('paint')) {
    partsMin *= 1.15;
    partsMax *= 1.2;
  }

  const severityFactor = SEVERITY_MULTIPLIER[severity] || 1;
  const complexityFactor = COMPLEXITY_MULTIPLIER[repairComplexity] || 1;
  const componentFactor = 1 + (componentCount - 1) * 0.12;

  partsMin = Math.round(partsMin * severityFactor * complexityFactor * componentFactor);
  partsMax = Math.round(partsMax * severityFactor * complexityFactor * componentFactor * 1.12);
  laborMin = Math.round(laborMin * severityFactor * complexityFactor);
  laborMax = Math.round(laborMax * severityFactor * complexityFactor * 1.18);

  if (brand && brand !== 'Unknown') {
    partsMin = Math.round(partsMin * 1.04);
    partsMax = Math.round(partsMax * 1.06);
  }

  if (model && model !== 'Unknown') {
    partsMin = Math.round(partsMin * 1.02);
    partsMax = Math.round(partsMax * 1.05);
  }

  const totalMin = Math.round(partsMin + laborMin);
  const totalMax = Math.round(partsMax + laborMax);

  return {
    currency,
    unit: currency,
    partsCostMin: partsMin,
    partsCostMax: partsMax,
    laborCostMin: laborMin,
    laborCostMax: laborMax,
    estimatedTotalMin: totalMin,
    estimatedTotalMax: totalMax,
    formatted: `${currency} ${totalMin.toLocaleString('en-IN')} – ${currency} ${totalMax.toLocaleString('en-IN')}`,
    estimateLabel: `${currency} ${totalMin.toLocaleString('en-IN')} – ${currency} ${totalMax.toLocaleString('en-IN')}`,
    note: 'Estimated repair cost only. Final price may vary by model, parts quality, and physical inspection.'
  };
}

export function estimateRepairCostBreakdown(payload = {}) {
  const estimate = estimateRepairCost(payload);
  return {
    currency: estimate.currency,
    parts: {
      min: estimate.partsCostMin,
      max: estimate.partsCostMax,
      label: `${estimate.currency} ${estimate.partsCostMin.toLocaleString('en-IN')} – ${estimate.currency} ${estimate.partsCostMax.toLocaleString('en-IN')}`
    },
    labor: {
      min: estimate.laborCostMin,
      max: estimate.laborCostMax,
      label: `${estimate.currency} ${estimate.laborCostMin.toLocaleString('en-IN')} – ${estimate.currency} ${estimate.laborCostMax.toLocaleString('en-IN')}`
    },
    total: {
      min: estimate.estimatedTotalMin,
      max: estimate.estimatedTotalMax,
      label: `${estimate.currency} ${estimate.estimatedTotalMin.toLocaleString('en-IN')} – ${estimate.currency} ${estimate.estimatedTotalMax.toLocaleString('en-IN')}`
    },
    note: estimate.note
  };
}
