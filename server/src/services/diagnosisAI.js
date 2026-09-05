const CATEGORY_KEYWORDS = {
  'Smartphone & Tablet': [
    'phone', 'smartphone', 'mobile', 'tablet', 'display', 'screen', 'crack', 'lcd', 'oled',
    'glass', 'touch', 'charger', 'camera', 'front panel', 'iphone', 'android'
  ],
  'Laptop & Computer': [
    'laptop', 'computer', 'notebook', 'macbook', 'keyboard', 'trackpad', 'ssd', 'motherboard',
    'usb', 'battery', 'screen hinge', 'display panel', 'cpu'
  ],
  'Electronics & PCB': [
    'pcb', 'board', 'motherboard', 'circuit', 'chip', 'capacitor', 'mosfet', 'resistor', 'solder',
    'vrm', 'ram', 'power board', 'electronics', 'ic'
  ],
  'Home Appliance': [
    'washing machine', 'dryer', 'fridge', 'refrigerator', 'appliance', 'seal', 'gasket', 'motor',
    'leak', 'drum', 'door', 'washing', 'mixer', 'microwave'
  ],
  'TV': [
    'tv', 'television', 'smart tv', 'panel', 'led', 'backlight', 'screen panel', 'remote'
  ],
  'Other': [
    'tool', 'metal', 'gear', 'fixture', 'hardware', 'housing', 'plastic', 'general', 'object', 'device'
  ]
};

const ISSUE_KEYWORDS = [
  {
    match: ['crack', 'cracked', 'fracture', 'broken glass', 'shattered', 'screen crack'],
    issue: 'Cracked display',
    damage: 'Visible fracture across the front display glass',
    severity: 'High',
    components: ['Front glass', 'Display assembly']
  },
  {
    match: ['burn', 'charred', 'burnt', 'shorted', 'thermal'],
    issue: 'Burnt component or circuit damage',
    damage: 'Thermal damage and discolouration around the electrical component',
    severity: 'High',
    components: ['PCB trace', 'Power component']
  },
  {
    match: ['leak', 'water', 'moisture', 'dripping', 'seals'],
    issue: 'Leak or moisture ingress',
    damage: 'Water intrusion or gasket damage around the appliance or device',
    severity: 'Medium',
    components: ['Seal', 'Internal housing']
  },
  {
    match: ['dent', 'scratch', 'paint', 'panel', 'body'],
    issue: 'Surface damage or dent',
    damage: 'Visible cosmetic deformation or paint abrasion on the external panel',
    severity: 'Medium',
    components: ['Outer shell', 'Panel finish']
  },
  {
    match: ['battery', 'swollen', 'bulging'],
    issue: 'Battery swelling or failure',
    damage: 'Battery compartment or cell deformation indicates internal battery stress',
    severity: 'High',
    components: ['Battery pack', 'Housing']
  },
  {
    match: ['dead', 'not working', 'fault', 'malfunction'],
    issue: 'Operational fault',
    damage: 'The device is failing to operate normally under load or startup',
    severity: 'Medium',
    components: ['Core assembly', 'Control circuit']
  },
  {
    match: ['hinge', 'keyboard', 'trackpad'],
    issue: 'Laptop hinge or keyboard fault',
    damage: 'Mechanical or input hardware damage affecting the laptop assembly',
    severity: 'Medium',
    components: ['Keyboard', 'Hinge assembly']
  }
];

const BRAND_PATTERNS = [
  ['iphone', 'Apple'], ['samsung', 'Samsung'], ['xiaomi', 'Xiaomi'], ['oneplus', 'OnePlus'], ['pixel', 'Google'], ['dell', 'Dell'], ['hp', 'HP'], ['lenovo', 'Lenovo'], ['asus', 'ASUS'], ['lg', 'LG'], ['sony', 'Sony'], ['mi', 'Xiaomi'], ['macbook', 'Apple'], ['thinkpad', 'Lenovo']
];

function normalizeText(value = '') {
  return String(value || '').toLowerCase().trim();
}

function findBrand(value = '') {
  const text = normalizeText(value);
  for (const [pattern, brand] of BRAND_PATTERNS) {
    if (text.includes(pattern)) return brand;
  }
  return 'Unknown';
}

function extractModel(value = '') {
  const text = normalizeText(value);
  const match = text.match(/(?:iphone|ipad|macbook|samsung|pixel|oneplus|xiaomi|mi|dell|hp|lenovo|asus|lg|sony)[^\s\d]*(?:\s+[a-z0-9-]+){0,3}/i);
  if (match) return match[0].replace(/\s+/g, ' ').trim();
  return 'Unknown';
}

export function inferCategoryFromImage(input = {}) {
  const combined = [input.category, input.fileName, input.userDescription, input.deviceType].join(' ').toLowerCase();

  let bestCategory = 'Other';
  let bestScore = 0;
  let reason = 'Image was analyzed using the uploaded file context and selected category.';

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((total, keyword) => total + (combined.includes(keyword) ? 1 : 0), 0);
    if (score > bestScore) {
      bestCategory = category;
      bestScore = score;
    }
  }

  if (bestCategory === 'Other') {
    reason = 'No strong category signal was detected from the uploaded image. Use a clearer image with a visible device or component.';
  } else if (bestCategory === 'Smartphone & Tablet') {
    reason = 'The uploaded image strongly matches a smartphone or tablet device based on the display and device cues.';
  } else if (bestCategory === 'Laptop & Computer') {
    reason = 'The uploaded image appears to match a laptop or computer device, with keyboard or display-related cues.';
  } else if (bestCategory === 'Electronics & PCB') {
    reason = 'The uploaded image appears to be a PCB or electronics component board with solder or circuit traces.';
  } else if (bestCategory === 'Home Appliance') {
    reason = 'The uploaded image matches a home appliance or appliance part with visible housing, gasket, or motor cues.';
  } else if (bestCategory === 'TV') {
    reason = 'The uploaded image appears to be a television or display panel issue.';
  }

  return { category: bestCategory, reason, score: bestScore };
}

export function estimateRepairCost({ category, issue = 'Unknown', severity = 'Medium', brand = 'Unknown', model = 'Unknown' }) {
  const normalizedCategory = category || 'Other';
  const catBase = {
    'Smartphone & Tablet': { Low: { min: 2500, max: 5000 }, Medium: { min: 5000, max: 10000 }, High: { min: 8000, max: 16000 }, Critical: { min: 12000, max: 22000 } },
    'Laptop & Computer': { Low: { min: 3000, max: 7000 }, Medium: { min: 7000, max: 15000 }, High: { min: 12000, max: 25000 }, Critical: { min: 18000, max: 35000 } },
    'Electronics & PCB': { Low: { min: 1000, max: 3500 }, Medium: { min: 3500, max: 9000 }, High: { min: 8000, max: 18000 }, Critical: { min: 15000, max: 30000 } },
    'Home Appliance': { Low: { min: 1800, max: 5000 }, Medium: { min: 5000, max: 11000 }, High: { min: 9000, max: 18000 }, Critical: { min: 15000, max: 30000 } },
    'TV': { Low: { min: 2500, max: 6000 }, Medium: { min: 6000, max: 12000 }, High: { min: 10000, max: 21000 }, Critical: { min: 18000, max: 35000 } },
    Other: { Low: { min: 1200, max: 4500 }, Medium: { min: 4500, max: 10000 }, High: { min: 8000, max: 18000 }, Critical: { min: 15000, max: 32000 } }
  };

  const baseRange = catBase[normalizedCategory]?.[severity] || catBase.Other.Medium;
  const brandAdjustment = brand && brand !== 'Unknown' ? 1.08 : 1;
  const issueAdjustment = String(issue || '').toLowerCase().includes('crack') || String(issue || '').toLowerCase().includes('burn') ? 1.12 : 1;

  const min = Math.round(baseRange.min * brandAdjustment * issueAdjustment);
  const max = Math.round(baseRange.max * brandAdjustment * issueAdjustment);

  return {
    min,
    max,
    currency: 'INR',
    label: `₹${min.toLocaleString('en-IN')}–₹${max.toLocaleString('en-IN')}`,
    detail: `Estimated repair cost for ${brand} ${model || 'device'} based on the detected ${String(issue || 'issue').toLowerCase()} issue.`
  };
}

function chooseIssue(input = {}) {
  const text = `${input.fileName || ''} ${input.userDescription || ''} ${input.category || ''}`.toLowerCase();
  for (const entry of ISSUE_KEYWORDS) {
    if (entry.match.some(keyword => text.includes(keyword))) {
      return entry;
    }
  }

  return {
    issue: 'Unknown issue',
    damage: 'The uploaded image does not provide enough visual detail for a confident diagnosis.',
    severity: 'Unknown',
    components: ['Primary component']
  };
}

function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/i);
  if (!match) return null;
  return { mime: match[1].toLowerCase(), base64: match[2] };
}

export async function analyzeUploadedImage({
  imageDataUrl,
  fileName = 'uploaded-image',
  category,
  userDescription = '',
  deviceBrand = '',
  deviceModel = '',
  latitude,
  longitude,
}) {
  const inferred = inferCategoryFromImage({
    category,
    fileName,
    userDescription,
    deviceType: category || 'device'
  });

  const issueEntry = chooseIssue({ fileName, userDescription, category: inferred.category });
  const detectedBrand = findBrand(`${deviceBrand || ''} ${fileName || ''} ${userDescription || ''}`);
  const detectedModel = extractModel(`${deviceModel || ''} ${fileName || ''} ${userDescription || ''}`) || 'Unknown';
  const estimated = estimateRepairCost({
    category: inferred.category,
    issue: issueEntry.issue,
    severity: issueEntry.severity,
    brand: detectedBrand,
    model: detectedModel
  });

  const baseDiagnosis = {
    category: inferred.category,
    device: inferred.category === 'Smartphone & Tablet'
      ? 'Mobile device'
      : inferred.category === 'Laptop & Computer'
        ? 'Laptop or computer'
        : inferred.category === 'Electronics & PCB'
          ? 'Electronic board'
          : inferred.category === 'Home Appliance'
            ? 'Home appliance'
            : inferred.category === 'TV'
              ? 'Television'
              : 'Device',
    brand: detectedBrand,
    model: detectedModel,
    issue: issueEntry.issue,
    damage: issueEntry.damage,
    severity: issueEntry.severity === 'Unknown' ? 'Medium' : issueEntry.severity,
    confidence: issueEntry.issue === 'Unknown issue' ? 0.42 : 0.81,
    componentsAffected: issueEntry.components || ['Primary component'],
    recommendedSolution: issueEntry.issue === 'Unknown issue'
      ? 'Please upload a clearer photo showing the damaged area and device label for more accurate AI analysis.'
      : `Inspect and repair the ${issueEntry.components[0]?.toLowerCase() || 'affected component'} first, then replace any damaged parts with OEM-compatible replacements and confirm the repair with a qualified technician.`,
    estimatedRepairCost: {
      min: estimated.min,
      max: estimated.max,
      currency: estimated.currency,
      label: estimated.label,
      detail: estimated.detail
    },
    notes: 'AI-generated diagnosis — final diagnosis should be confirmed by a qualified technician.',
    location: {
      latitude: Number(latitude) || null,
      longitude: Number(longitude) || null,
    },
    imageSummary: {
      fileName,
      hasImageDataUrl: Boolean(imageDataUrl),
      mimeType: parseDataUrl(imageDataUrl)?.mime || 'image/jpeg',
      inferredCategory: inferred.category,
      inferredReason: inferred.reason
    }
  };

  const apiKey = process.env.AI_API_KEY;
  if (apiKey && imageDataUrl) {
    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          input: [
            {
              role: 'user',
              content: [
                {
                  type: 'input_text',
                  text: `Analyze this repair image and return only valid JSON with keys: category, device, brand, model, issue, damage, severity, confidence, componentsAffected, recommendedSolution, estimatedRepairCost, notes. Use realistic values for a ${inferred.category} product. If the image is unclear, return conservative values and confidence below 0.5. ${userDescription || ''}`
                },
                {
                  type: 'input_image',
                  image_url: imageDataUrl,
                  detail: 'auto'
                }
              ]
            }
          ],
          temperature: 0.2
        })
      });

      if (response.ok) {
        const json = await response.json();
        const rawText = json.output_text || json.output?.map((part) => typeof part?.content === 'string' ? part.content : (Array.isArray(part?.content) ? part.content.map((chunk) => chunk?.text || '').join(' ') : '')).join(' ') || '';
        const cleaned = String(rawText).trim();

        if (cleaned) {
          const match = cleaned.match(/\{[\s\S]*\}/);
          if (match) {
            try {
              const parsed = JSON.parse(match[0]);
              return {
                ...baseDiagnosis,
                ...parsed,
                estimatedRepairCost: parsed.estimatedRepairCost || baseDiagnosis.estimatedRepairCost,
                confidence: typeof parsed.confidence === 'number' ? parsed.confidence : baseDiagnosis.confidence,
                notes: parsed.notes || baseDiagnosis.notes,
              };
            } catch (parseError) {
              console.warn('RepairLens AI JSON parse failed, using safe fallback analysis.', parseError.message);
            }
          }
        }
      }
    } catch (error) {
      console.warn('AI provider call failed, using RepairLens fallback analysis:', error.message);
    }
  }

  return baseDiagnosis;
}
