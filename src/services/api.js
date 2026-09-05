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
  return { success: true, ...payload, imageUrl: Object.values(anglePhotos).find(p => p?.previewUrl)?.previewUrl };
}
