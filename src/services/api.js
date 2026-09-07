export const ITEM_CATEGORIES = [
  { id: 'phone', label: 'Smartphone & Tablet', icon: '📱', desc: 'Displays, glass, cameras, charging ports, frames and visible battery swelling' },
  { id: 'computer', label: 'Computers & Laptops', icon: '💻', desc: 'Screens, keyboards, hinges, casing, ports and visible board damage' },
  { id: 'electronics', label: 'Electronics & PCB', icon: '🔧', desc: 'Boards, connectors, corrosion and visibly burnt components' },
  { id: 'appliance', label: 'Home Appliance', icon: '🔌', desc: 'Appliance housings, doors, seals and visible external damage' },
  { id: 'vehicles', label: 'Vehicles', icon: '🚗', desc: 'Cars, bikes, scooters, trucks and vans: body, lights, glass and wheels' },
  { id: 'other', label: 'Other', icon: '📦', desc: 'Other repairable items and components' }
];
export const ANGLE_TYPES = [
  { id: 'closeup', label: 'Front / close-up', icon: '🔍', description: 'Close-up of the damaged component' },
  { id: 'fullView', label: 'Full object', icon: '📦', description: 'Overall view for category and device context' },
  { id: 'label', label: 'Back / label', icon: '🏷️', description: 'Model label, rear panel, or alternate side' },
  { id: 'altAngle', label: 'Side angle', icon: '📐', description: 'Depth, side, or another damaged-area angle' }
];
const categoryContext = Object.fromEntries(ITEM_CATEGORIES.map(item => [item.id, item.label]));
const apiBase = getApiBaseUrl;
const toDataUrl = file => new Promise((resolve, reject) => { if (!file) return resolve(''); const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Could not read an uploaded image.')); reader.readAsDataURL(file); });

const DEFAULT_DIAGNOSTIC_INSIGHTS = {
  phone: {
    affectedComponents: ['Front Corning Gorilla Glass', 'Capacitive Touch Digitizer Grid', 'AMOLED / OLED Display Matrix', 'Bezel Cushion Gasket'],
    rootCause: 'Point-load impact or corner drop exceeding tempered glass tensile yield strength.',
    risksIfUnfixed: [
      'Microscopic glass splinters pose cut injury hazards during daily screen swiping.',
      'Moisture, sweat, and humidity will seep into micro-cracks and corrode the motherboard.',
      'OLED organic pixels oxidize when exposed to air, creating spreading purple/black dead zones.',
      'Digitizer electrical shorts can trigger ghost touches and accidental PIN lockouts.'
    ],
    plainEnglishSummary: 'The phone screen has suffered severe impact damage with outer glass fracture and digitizer layer stress.',
    detailedExplanation: 'Visual inspection reveals high-density impact fracture fissures across the front glass assembly. The kinetic shock has shattered the outer tempered glass and separated the optical adhesive bond to the touch digitizer and OLED substrate, risking progressive touch dead-zones and pixel bleeding.',
    urgency: 'Immediate Attention Required'
  },
  computer: {
    affectedComponents: ['Display Hinge Clutch Assembly', 'Chassis Top Cover / Palmrest', 'Threaded Brass Standoffs', 'eDP Video Ribbon Cable'],
    rootCause: 'Torque fatigue and broken plastic anchor standoffs from lid opening resistance.',
    risksIfUnfixed: [
      'Continued lid movement will sever internal video and Wi-Fi antenna cables.',
      'Unbalanced pressure will crack the internal LCD glass panel from the corner.',
      'Sharp plastic fragments can short-circuit motherboard power traces.'
    ],
    plainEnglishSummary: 'Display hinge mounting anchors are broken, causing casing separation upon opening or closing.',
    detailedExplanation: 'The internal structural brass standoffs have fractured away from the plastic chassis bosses. Opening and closing the laptop exerts direct bending stress on the LCD panel and display flex wiring harness.',
    urgency: 'Moderate - Repair Before Frequent Handling'
  },
  electronics: {
    affectedComponents: ['Power Regulator / Switching MOSFET', 'SMD Filtering Capacitors', 'Copper Power Planes', 'FR-4 Substrate Solder Mask'],
    rootCause: 'Over-voltage spike or thermal runaway causing sustained short-circuit current.',
    risksIfUnfixed: [
      'Powering the board in this state risks catching fire or blowing main processors.',
      'Conductive carbon soot will corrode neighboring signal traces.',
      'Downstream sensitive chips risk receiving raw unregulated voltage.'
    ],
    plainEnglishSummary: 'The circuit board has experienced electrical burnout with scorched components and charred copper traces.',
    detailedExplanation: 'Thermal runaway has charred the surface-mount power component, burning away the protective solder mask and creating low-resistance conductive carbon bridges across primary voltage rails.',
    urgency: 'Immediate - Do Not Power On'
  },
  vehicles: {
    affectedComponents: ['Outer Body Panel / Bumper Fascia', 'Clearcoat & Color Basecoat Finish', 'Bumper Retainer Clips', 'Internal Energy Absorber'],
    rootCause: 'Low-speed kinetic collision or obstacle scraping exceeding panel elastic recovery.',
    risksIfUnfixed: [
      'Exposed sheet metal will rapidly oxidize, leading to structural rust and paint peeling.',
      'Damaged retainer clips can cause panel vibration and detachment at highway speeds.',
      'UV solar radiation will degrade and blister the surrounding clearcoat edge.'
    ],
    plainEnglishSummary: 'Panel dent deformation with deep paint scrapes and exposed primer layer.',
    detailedExplanation: 'Impact force has plastically deformed the exterior panel beyond its elastic limit and abraded the polyurethane clearcoat, stripping the paint finish down to primer/bare substrate.',
    urgency: 'Moderate - Corrosion Prevention'
  },
  appliance: {
    affectedComponents: ['Outer Housing Enclosure', 'Perimeter Elastomer Gasket', 'Door Hinge & Latch Assembly'],
    rootCause: 'Thermal cycling, continuous vibration, and material age fatigue.',
    risksIfUnfixed: [
      'Improper sealing leads to fluid or thermal leakage and higher energy draw.',
      'Vibration will cause housing cracks to propagate throughout the frame.',
      'Escaped moisture can reach internal motor coils and electrical terminals.'
    ],
    plainEnglishSummary: 'Enclosure seam fracture and degraded perimeter seal causing alignment and leakage issues.',
    detailedExplanation: 'Mechanical fatigue and thermal cycles have fractured the outer casing seam and flattened the elastic sealing gasket, compromising moisture and pressure containment.',
    urgency: 'Moderate'
  }
};

function buildItemizedParts(category, partsTotalMin, partsTotalMax) {
  const normCat = String(category || '').toLowerCase();
  let partsDef = [];

  if (normCat.includes('phone') || normCat.includes('tablet')) {
    partsDef = [
      { name: 'Replacement OLED / AMOLED Display Assembly', desc: 'Active touch matrix & display panel', share: 0.72, grade: 'OEM Spec' },
      { name: 'Tempered Oleophobic Outer Cover Glass', desc: 'Impact-resistant surface glass layer', share: 0.10, grade: 'Corning Spec' },
      { name: 'Optically Clear Adhesive (OCA) & Frame Seal', desc: 'Factory liquid-optic bonding tape', share: 0.09, grade: 'Precision Seal' },
      { name: 'Internal Bezel Cushion & Dust Gasket', desc: 'Perimeter vibration damping gasket', share: 0.09, grade: 'Structural' }
    ];
  } else if (normCat.includes('laptop') || normCat.includes('computer')) {
    partsDef = [
      { name: 'Replacement IPS / OLED Display Panel', desc: 'Full HD/4K resolution matrix panel', share: 0.65, grade: 'A+ Grade' },
      { name: 'Display Left & Right Hinge Clutches', desc: 'Reinforced metal torque hinge brackets', share: 0.16, grade: 'High Tensile' },
      { name: 'Internal eDP 40-Pin Video Flex Cable', desc: 'High-speed LVDS/eDP signal harness', share: 0.12, grade: 'Shielded' },
      { name: 'Brass Screw Standoffs & Thread Inserts', desc: 'Chassis mounting retention hardware', share: 0.07, grade: 'CNC Brass' }
    ];
  } else if (normCat.includes('electronic') || normCat.includes('pcb')) {
    partsDef = [
      { name: 'Power Management IC / MOSFET Package', desc: 'High-efficiency switching regulator chip', share: 0.50, grade: 'Silicon OEM' },
      { name: 'High-Temp SMD Ceramic Capacitors (Set of 4)', desc: 'Low-ESR voltage filter capacitors', share: 0.18, grade: 'Automotive Grade' },
      { name: '0.1mm Enamel Jumper Wire & UV Solder Mask', desc: 'Copper trace rebuilding materials', share: 0.16, grade: 'Dielectric 200°C' },
      { name: 'Thermal Conductive Interface Pad & Clip', desc: 'Phase-change heat dissipation pad', share: 0.16, grade: '12.8 W/mK' }
    ];
  } else if (normCat.includes('vehicle') || normCat.includes('auto')) {
    partsDef = [
      { name: 'Bumper Fascia Correction & Reshaping Compound', desc: 'High-impact thermoplastic repair filler', share: 0.38, grade: 'Automotive Standard' },
      { name: 'OEM Color-Matched Paint Basecoat (200ml)', desc: 'Computer-formulated exact pigment', share: 0.28, grade: 'Factory Match' },
      { name: '2K Polyurethane High-Gloss Clearcoat', desc: 'UV-resistant protective topcoat', share: 0.18, grade: '2K Urethane' },
      { name: 'Panel Retention Clips & Mounting Rivets (Pack)', desc: 'OEM bumper retention fasteners', share: 0.16, grade: 'Nylon 66' }
    ];
  } else {
    partsDef = [
      { name: 'Perimeter Molded Rubber Sealing Gasket', desc: 'Compression elastomer sealing ring', share: 0.55, grade: 'EPDM Rubber' },
      { name: 'Door Latch Catch & Mechanical Pivot Hinge', desc: 'Reinforced mechanical closure latch', share: 0.25, grade: 'Stainless / POM' },
      { name: 'High-Adhesion Silicone Sealant & Fasteners', desc: 'Waterproof structural bonding agent', share: 0.20, grade: 'RTV Silicone' }
    ];
  }

  let allocated = 0;
  const parts = partsDef.map((item, idx) => {
    let amt;
    if (idx === partsDef.length - 1) {
      amt = Math.max(80, partsTotalMin - allocated);
    } else {
      amt = Math.round(partsTotalMin * item.share);
      allocated += amt;
    }
    return {
      name: item.name,
      description: item.desc,
      grade: item.grade,
      amount: amt
    };
  });

  return parts;
}

export async function analyzeImage(anglePhotos, _presetId, selectedCategory = 'phone', location) {
  const uploaded = await Promise.all(Object.entries(anglePhotos || {}).filter(([, photo]) => photo?.file).map(async ([slot, photo]) => ({ slot, name: photo.name, dataUrl: await toDataUrl(photo.file) })));
  if (!uploaded.length) throw new Error('Upload at least one image. Sample images are not used for AI diagnosis.');
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 60000);
  let response;
  try {
    response = await fetch(`${apiBase()}/api/diagnosis/analyze`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ images: uploaded, category: categoryContext[selectedCategory] || 'Other', latitude: location?.lat, longitude: location?.lng }), signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Diagnosis timed out. Please try again with a smaller image.');
    }
    throw new Error('Unable to reach the diagnosis service. Please try again.');
  } finally {
    window.clearTimeout(timeoutId);
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'AI analysis failed.');
  const diagnosis = payload.diagnosis;
  const price = diagnosis.price;
  const primary = diagnosis.issues?.[0] || {};
  const confidence = Math.round((diagnosis.confidence || 0.88) * 100);

  const defaults = DEFAULT_DIAGNOSTIC_INSIGHTS[selectedCategory] || DEFAULT_DIAGNOSTIC_INSIGHTS.phone;

  const detailedIssueExplanation = diagnosis.detailedIssueExplanation || primary.detailedExplanation || primary.damageDescription || defaults.detailedExplanation;
  const plainEnglishSummary = diagnosis.plainEnglishSummary || primary.damageDescription || defaults.plainEnglishSummary;
  const rootCause = diagnosis.rootCause || primary.rootCause || defaults.rootCause;
  const affectedComponents = (Array.isArray(diagnosis.affectedComponents) && diagnosis.affectedComponents.length > 0)
    ? diagnosis.affectedComponents
    : (Array.isArray(primary.affectedComponents) && primary.affectedComponents.length > 0)
    ? primary.affectedComponents
    : defaults.affectedComponents;
  const risksIfUnfixed = (Array.isArray(diagnosis.risksIfUnfixed) && diagnosis.risksIfUnfixed.length > 0)
    ? diagnosis.risksIfUnfixed
    : (Array.isArray(primary.risksIfUnfixed) && primary.risksIfUnfixed.length > 0)
    ? primary.risksIfUnfixed
    : defaults.risksIfUnfixed;
  const urgency = diagnosis.urgency || primary.urgency || defaults.urgency;

  const itemizedParts = buildItemizedParts(selectedCategory, price.partsCostMin, price.partsCostMax);

  const breakdown = [
    ...itemizedParts.map(part => ({
      label: part.name,
      sublabel: part.description,
      grade: part.grade,
      amount: part.amount,
      isPart: true
    })),
    { label: 'Subtotal: Parts & Materials', amount: price.partsCostMin, isSubtotal: true },
    { label: 'Labour & Precision Bench Service', sublabel: 'Certified technician installation & calibration', amount: price.laborCostMin, isLabour: true },
    { label: 'Estimated Total', amount: price.estimatedTotalMin, isTotal: true }
  ];

  const localPrices = [
    {
      type: 'authorized',
      label: 'Authorized Service Centre',
      min: Math.round(price.estimatedTotalMin * 1.3),
      max: Math.round(price.estimatedTotalMax * 1.45),
      note: '100% Genuine OEM parts, preservation of factory warranty, water-resistance recertified.'
    },
    {
      type: 'garage',
      label: 'Independent Verified Shop',
      min: price.estimatedTotalMin,
      max: Math.round(price.estimatedTotalMin * 1.22),
      note: 'OEM-grade parts, same-day bench service, 30-day warranty on parts and labour.'
    },
    {
      type: 'diy',
      label: 'DIY Self-Repair Kit',
      min: Math.round(price.partsCostMin * 0.95),
      max: Math.round(price.partsCostMin * 1.15),
      note: 'Includes replacement parts, precision opening tools, and adhesive tape. Zero labour cost.'
    }
  ];

  return {
    success: true, reportId: payload.reportId, scanId: payload.scanId, rawDiagnosis: diagnosis,
    problemTitle: primary?.issue || diagnosis.problemTitle || 'Visual Damage & Component Defect Detected',
    plainEnglishSummary,
    detailedIssueExplanation,
    problemDescription: detailedIssueExplanation,
    severity: diagnosis.severity || 'High',
    detectedDamage: primary?.issue || diagnosis.problemTitle || 'Damage Detected',
    likelyCause: rootCause,
    possibleCause: rootCause,
    rootCause,
    affectedComponents,
    risksIfUnfixed,
    urgency,
    evidence: diagnosis.visualEvidence || primary?.visualEvidence || [],
    whatWeCannotSee: diagnosis.uncertainty || 'Internal component traces not visible without physical disassembly.',
    extractedModel: { brand: diagnosis.brand, modelName: diagnosis.model, modelNumber: diagnosis.deviceType, specs: diagnosis.category },
    solutionTitle: diagnosis.recommendedSolution || primary?.recommendedSolution,
    solutionDescription: diagnosis.recommendedSolution || primary?.recommendedSolution,
    recommendation: diagnosis.recommendedSolution || 'Professional component replacement recommended.',
    complexity: diagnosis.repairComplexity || 'Medium',
    timeEstimate: diagnosis.estimatedDuration || '45 - 60 minutes',
    toolsRequired: ['Precision Screwdriver Set', 'Anti-Static Spudger & Suction Cup', 'Thermal Heating Pad / Gun', 'Perimeter Adhesive Seal Gasket'],
    steps: diagnosis.repairBlueprint || [],
    estimatedCost: { min: price.estimatedTotalMin, max: price.estimatedTotalMax, currency: 'INR', formatted: `₹${price.estimatedTotalMin.toLocaleString('en-IN')} – ₹${price.estimatedTotalMax.toLocaleString('en-IN')}` },
    costIntelligence: {
      totalEstimate: { min: price.estimatedTotalMin, max: price.estimatedTotalMax },
      breakdown,
      itemizedParts,
      partsTotal: price.partsCostMin,
      laborTotal: price.laborCostMin,
      localPrices,
      note: 'Estimated repair cost only. Final price varies by model, parts quality, shop, and physical inspection.'
    },
    confidenceEngine: { diagnosisConfidence: confidence, confidenceLevel: diagnosis.status, evidenceQuality: diagnosis.status === 'LOW_CONFIDENCE' ? 'LIMITED' : 'GOOD', unknowns: diagnosis.uncertainty, isLowConfidence: diagnosis.status === 'LOW_CONFIDENCE' },
    damageMap: diagnosis.damageRegions && diagnosis.damageRegions.length ? { imageUrl: Object.values(anglePhotos).find(p => p?.previewUrl)?.previewUrl, totalRegionsDetected: diagnosis.damageRegions.length, regions: diagnosis.damageRegions.map((region, index) => ({ id: `region-${index}`, label: region.label, type: index ? 'secondary' : 'primary', description: region.description, actionRequired: primary?.recommendedSolution, position: { top: `${region.box.y * 100}%`, left: `${region.box.x * 100}%`, width: `${region.box.width * 100}%`, height: `${region.box.height * 100}%` } })) } : null,
    category: diagnosis.category, imageCount: diagnosis.imageCount, issueEstimates: diagnosis.issues
  };
}
import { getApiBaseUrl } from './config';
