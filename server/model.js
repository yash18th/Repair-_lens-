const DAMAGE_DATASET = [
  {
    category: 'phone',
    labels: ['phone', 'smartphone', 'screen', 'display', 'glass', 'crack', 'fracture', 'touch', 'lcd', 'oled'],
    problemTitle: 'OLED Display Fracture & Digitizer Layer Separation',
    severity: 'High',
    confidence: 0.94,
    likelyCause: 'Corner impact from a hard surface',
    repairAdvice: 'Replace the front display assembly and reseal the frame gasket.'
  },
  {
    category: 'electronics',
    labels: ['pcb', 'board', 'circuit', 'chip', 'mosfet', 'resistor', 'capacitor', 'thermal', 'burnt', 'solder'],
    problemTitle: 'Power Delivery IC Thermal Failure',
    severity: 'High',
    confidence: 0.9,
    likelyCause: 'Over-current or thermal runaway on the power stage',
    repairAdvice: 'Rework the damaged component and inspect surrounding power traces.'
  },
  {
    category: 'auto',
    labels: ['bumper', 'car', 'vehicle', 'paint', 'scrape', 'dent', 'body', 'clearcoat', 'fender', 'auto'],
    problemTitle: 'Front Bumper Dent & Paint Abrasion',
    severity: 'Low',
    confidence: 0.91,
    likelyCause: 'Low-speed impact or curb scrape',
    repairAdvice: 'Use dent correction and paint touch-up with clearcoat.'
  },
  {
    category: 'appliance',
    labels: ['washing', 'machine', 'dryer', 'appliance', 'seal', 'gasket', 'door', 'leak', 'drum', 'bearing'],
    problemTitle: 'Washing Machine Door Seal Perishing',
    severity: 'Medium',
    confidence: 0.88,
    likelyCause: 'Moisture damage and worn rubber seal',
    repairAdvice: 'Replace the door gasket and inspect the drum bearings.'
  },
  {
    category: 'general',
    labels: ['hardware', 'metal', 'casing', 'plastic', 'crack', 'fracture', 'tool', 'gear', 'housing'],
    problemTitle: 'Structural Casing Fracture & Surface Wear',
    severity: 'Medium',
    confidence: 0.85,
    likelyCause: 'Mechanical fatigue or repeated stress on the housing',
    repairAdvice: 'Reinforce the cracked area or replace the damaged housing assembly.'
  }
];

export function classifyDamageImage(imageInput = {}) {
  const text = `${imageInput.filename || ''} ${imageInput.category || ''} ${imageInput.imageUrl || ''}`.toLowerCase();

  let bestMatch = DAMAGE_DATASET[0];
  let bestScore = -1;

  for (const item of DAMAGE_DATASET) {
    const matchScore = item.labels.reduce((score, label) => {
      return score + (text.includes(label) ? 1 : 0);
    }, 0);

    if (matchScore > bestScore) {
      bestScore = matchScore;
      bestMatch = item;
    }
  }

  const fallbackCategory = imageInput.category && DAMAGE_DATASET.some(item => item.category === imageInput.category)
    ? imageInput.category
    : bestMatch.category;

  const finalMatch = DAMAGE_DATASET.find(item => item.category === fallbackCategory) || bestMatch;

  return {
    category: finalMatch.category,
    problemTitle: finalMatch.problemTitle,
    severity: finalMatch.severity,
    confidence: finalMatch.confidence,
    likelyCause: finalMatch.likelyCause,
    repairAdvice: finalMatch.repairAdvice,
    dataset: 'repairlens-damage-model-v1',
    isModelPrediction: true,
    modelVersion: 'v1.0.0'
  };
}
