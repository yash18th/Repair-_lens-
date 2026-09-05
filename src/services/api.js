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
const apiBase = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const toDataUrl = file => new Promise((resolve, reject) => { if (!file) return resolve(''); const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Could not read an uploaded image.')); reader.readAsDataURL(file); });

export async function analyzeImage(anglePhotos, _presetId, selectedCategory = 'phone', location) {
  const uploaded = await Promise.all(Object.entries(anglePhotos || {}).filter(([, photo]) => photo?.file).map(async ([slot, photo]) => ({ slot, name: photo.name, dataUrl: await toDataUrl(photo.file) })));
  if (!uploaded.length) throw new Error('Upload at least one image. Sample images are not used for AI diagnosis.');
  const response = await fetch(`${apiBase()}/api/diagnosis/analyze`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ images: uploaded, category: categoryContext[selectedCategory] || 'Other', latitude: location?.lat, longitude: location?.lng }) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'AI analysis failed.');
  const diagnosis = payload.diagnosis;
  const price = diagnosis.price;
  const primary = diagnosis.issues[0];
  const confidence = Math.round(diagnosis.confidence * 100);
  return {
    success: true, reportId: payload.reportId, scanId: payload.scanId, rawDiagnosis: diagnosis,
    problemTitle: primary?.issue || 'Image evidence is insufficient for a confident diagnosis',
    problemDescription: primary?.damageDescription || diagnosis.uncertainty,
    severity: diagnosis.severity, detectedDamage: primary?.issue, likelyCause: diagnosis.uncertainty,
    evidence: diagnosis.visualEvidence, whatWeCannotSee: diagnosis.uncertainty,
    extractedModel: { brand: diagnosis.brand, modelName: diagnosis.model, modelNumber: diagnosis.deviceType, specs: diagnosis.category },
    possibleCause: diagnosis.uncertainty, risksIfUnfixed: [], solutionTitle: diagnosis.recommendedSolution,
    solutionDescription: diagnosis.recommendedSolution, recommendation: diagnosis.recommendedSolution,
    complexity: diagnosis.repairComplexity, timeEstimate: diagnosis.estimatedDuration, toolsRequired: [], steps: diagnosis.repairBlueprint,
    estimatedCost: { min: price.estimatedTotalMin, max: price.estimatedTotalMax, currency: 'INR', formatted: `₹${price.estimatedTotalMin.toLocaleString('en-IN')} – ₹${price.estimatedTotalMax.toLocaleString('en-IN')}` },
    costIntelligence: { totalEstimate: { min: price.estimatedTotalMin, max: price.estimatedTotalMax }, breakdown: [{ label: 'Parts', amount: price.partsCostMin }, { label: 'Labour', amount: price.laborCostMin }, { label: 'Estimated Total', amount: price.estimatedTotalMin, isTotal: true }], localPrices: [], note: 'Estimated repair cost only. Final price varies by model, parts quality, shop, and physical inspection.' },
    confidenceEngine: { diagnosisConfidence: confidence, confidenceLevel: diagnosis.status, evidenceQuality: diagnosis.status === 'LOW_CONFIDENCE' ? 'LIMITED' : 'GOOD', unknowns: diagnosis.uncertainty, isLowConfidence: diagnosis.status === 'LOW_CONFIDENCE' },
    damageMap: diagnosis.damageRegions.length ? { imageUrl: Object.values(anglePhotos).find(p => p?.previewUrl)?.previewUrl, totalRegionsDetected: diagnosis.damageRegions.length, regions: diagnosis.damageRegions.map((region, index) => ({ id: `region-${index}`, label: region.label, type: index ? 'secondary' : 'primary', description: region.description, actionRequired: primary?.recommendedSolution, position: { top: `${region.box.y * 100}%`, left: `${region.box.x * 100}%`, width: `${region.box.width * 100}%`, height: `${region.box.height * 100}%` } })) } : null,
    category: diagnosis.category, imageCount: diagnosis.imageCount, issueEstimates: diagnosis.issues
  };
}
