import express from 'express';
import cors from 'cors';
import { classifyDamageImage } from './model.js';
import { buildOverpassQuery, normalizeNearbyStore, buildGooglePlacesKeyword, normalizeGooglePlace } from './nearby.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'repairlens-model-api' });
});

app.post('/analyze', async (req, res) => {
  try {
    const payload = req.body || {};
    const result = classifyDamageImage(payload.image || payload || {});

    res.json({
      success: true,
      isMockData: false,
      source: 'deployed-dataset-model',
      model: 'repairlens-damage-model-v1',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Image analysis failed',
      detail: error.message
    });
  }
});

app.post('/nearby', async (req, res) => {
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
          return res.json({
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

    return res.json({
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
});

app.listen(PORT, () => {
  console.log(`RepairLens model API listening on http://localhost:${PORT}`);
});
