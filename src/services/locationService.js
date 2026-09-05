export function getCurrentPositionPromise() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation is not supported by this browser.'));
    navigator.geolocation.getCurrentPosition(pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }), reject, { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 });
  });
}
export async function fetchNearbyShops(category, location, radius = 5000) {
  if (!Number.isFinite(Number(location?.lat)) || !Number.isFinite(Number(location?.lng))) throw new Error('Choose a location or allow browser location access to find nearby repair centres.');
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const response = await fetch(`${apiBase}/api/nearby-shops`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category, latitude: Number(location.lat), longitude: Number(location.lng), radius }) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Could not find nearby repair centres.');
  return payload.shops || [];
}
