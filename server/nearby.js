const CATEGORY_KEYWORDS = {
  phone: ['repair', 'mobile_phone', 'mobile', 'smartphone', 'electronics'],
  electronics: ['electronics', 'repair', 'computer', 'laptop', 'motherboard', 'pcb'],
  auto: ['car_repair', 'automotive', 'garage', 'bodyshop', 'denting', 'paint'],
  appliance: ['appliance', 'washing_machine', 'repair', 'service'],
  general: ['repair', 'workshop', 'hardware', 'service']
};

export function buildOverpassQuery(category = 'phone', lat = 12.9784, lng = 77.6408, radiusMeters = 5000) {
  const keywords = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.phone;
  const keywordList = keywords.join('|');

  return `
    [out:json][timeout:25];
    (
      node["shop"~"${keywordList}"](around:${radiusMeters},${lat},${lng});
      node["service"~"${keywordList}"](around:${radiusMeters},${lat},${lng});
      node["amenity"~"${keywordList}"](around:${radiusMeters},${lat},${lng});
    );
    out center tags 20;
  `;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function normalizeNearbyStore(entry, userLat, userLng, category = 'phone') {
  const name = entry.tags?.name || 'Local Repair Shop';
  const address =
    entry.tags?.['addr:full'] ||
    entry.tags?.addr ||
    entry.tags?.['addr:street'] ||
    'Nearby local repair location';

  const latitude = Number(entry.lat ?? entry.center?.lat ?? userLat);
  const longitude = Number(entry.lon ?? entry.center?.lon ?? userLng);

  const distanceKm = Math.max(0.2, haversineKm(userLat, userLng, latitude, longitude));

  return {
    id: `${category}-${name}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    category,
    rating: 4.5 + Math.random() * 0.5,
    reviewsCount: 120 + Math.floor(Math.random() * 500),
    distanceKm: Number(distanceKm.toFixed(1)),
    locality: address.split(',')[0] || 'Local Area',
    city: address.includes(',') ? address.split(',').slice(-1)[0].trim() : 'Nearby City',
    address,
    phone: '+91 98XXX XXXXX',
    priceEstimate: 1200 + Math.floor(Math.random() * 5000),
    marketAvgDiff: -10 + Math.floor(Math.random() * 20),
    turnaround: 'Fast local repair',
    badge: '📍 Nearby Store',
    type: 'garage',
    hasDoorstepPickup: true,
    isAuthorised: false,
    timing: 'Open now',
    latitude,
    longitude,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`
  };
}

export function buildGooglePlacesKeyword(category = 'phone') {
  const keywordMap = {
    phone: 'mobile phone repair shop',
    electronics: 'electronics repair service',
    auto: 'car denting and painting garage',
    appliance: 'washing machine repair service',
    general: 'repair workshop nearby'
  };

  return keywordMap[category] || keywordMap.phone;
}

export function normalizeGooglePlace(place, userLat, userLng, category = 'phone') {
  const latitude = Number(place.geometry?.location?.lat ?? userLat);
  const longitude = Number(place.geometry?.location?.lng ?? userLng);
  const distanceKm = Math.max(0.2, haversineKm(userLat, userLng, latitude, longitude));

  return {
    id: `${category}-${place.place_id || place.name}-${Math.random().toString(36).slice(2, 8)}`,
    name: place.name || 'Google Nearby Repair Shop',
    category,
    rating: Number(place.rating || 4.6),
    reviewsCount: Number(place.user_ratings_total || 120),
    distanceKm: Number(distanceKm.toFixed(1)),
    locality: place.vicinity?.split(',')[0] || 'Local Area',
    city: place.vicinity?.split(',').slice(-1)[0]?.trim() || 'Nearby City',
    address: place.vicinity || 'Nearby repair location',
    phone: place.formatted_phone_number || '+91 98XXX XXXXX',
    priceEstimate: 1200 + Math.floor(Math.random() * 5000),
    marketAvgDiff: -10 + Math.floor(Math.random() * 20),
    turnaround: 'Google Places result',
    badge: '📍 Google Nearby',
    type: 'garage',
    hasDoorstepPickup: true,
    isAuthorised: Boolean(place.types?.includes('doctor') || place.types?.includes('store')),
    timing: 'Open now',
    latitude,
    longitude,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name || 'repair shop'} ${place.vicinity || 'near me'}`)}`
  };
}
