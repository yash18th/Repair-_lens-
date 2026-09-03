import { buildOverpassQuery, normalizeNearbyStore, buildGooglePlacesKeyword, normalizeGooglePlace } from '../server/nearby.js';

export default async function handler(req, res) {
  try {
    const { category = 'phone', latitude = 12.9784, longitude = 77.6408, radius = 5000 } = req.body || {};
    const userLat = Number(latitude);
    const userLng = Number(longitude);
    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (googleApiKey) {
      const keyword = encodeURIComponent(buildGooglePlacesKeyword(category));
      const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=${radius}&keyword=${keyword}&key=${googleApiKey}`;
      const googleResponse = await fetch(googleUrl);

      if (googleResponse.ok) {
        const googleData = await googleResponse.json();
        const shops = (googleData.results || [])
          .slice(0, 12)
          .map((place) => normalizeGooglePlace(place, userLat, userLng, category));

        if (shops.length > 0) {
          return res.status(200).json({
            success: true,
            source: 'google-places-api',
            category,
            userLocation: { lat: userLat, lng: userLng },
            shops: shops.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)),
            fallback: false
          });
        }
      }
    }

    const query = buildOverpassQuery(category, userLat, userLng, Number(radius));
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      throw new Error(`Overpass request failed: ${response.status}`);
    }

    const data = await response.json();
    const shops = (data.elements || [])
      .filter((entry) => entry && (entry.tags?.name || entry.tags?.shop || entry.tags?.amenity || entry.tags?.service))
      .slice(0, 12)
      .map((entry) => normalizeNearbyStore(entry, userLat, userLng, category));

    return res.status(200).json({
      success: true,
      source: 'overpass-openstreetmap',
      category,
      userLocation: { lat: userLat, lng: userLng },
      shops: shops.length ? shops.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)) : [],
      fallback: shops.length === 0
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      source: 'fallback',
      category: req.body?.category || 'phone',
      userLocation: {
        lat: Number(req.body?.latitude || 12.9784),
        lng: Number(req.body?.longitude || 77.6408)
      },
      shops: [],
      error: error.message
    });
  }
}
