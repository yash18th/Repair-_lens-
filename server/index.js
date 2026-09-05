import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildOverpassQuery, normalizeNearbyStore, buildGooglePlacesKeyword, normalizeGooglePlace } from './nearby.js';
import authRoutes from './src/routes/authRoutes.js';
import scanRoutes from './src/routes/scanRoutes.js';
import searchRoutes from './src/routes/searchRoutes.js';
import savedRoutes from './src/routes/savedRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import diagnosisRoutes from './src/routes/diagnosisRoutes.js';
import { analyzeUploadedImage } from './src/services/diagnosisAI.js';
import { requireAuth } from './src/middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4000;
const distPath = path.resolve(__dirname, '../dist');

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/diagnosis', diagnosisRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'repairlens-model-api' });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const payload = req.body || {};
    const source = payload.imageDataUrl || payload.image?.dataUrl || payload.image?.previewUrl || payload.image?.imageUrl || '';

    if (!source) {
      return res.status(400).json({ success: false, message: 'No image was provided for analysis.' });
    }

    const diagnosis = await analyzeUploadedImage({
      imageDataUrl: source,
      fileName: payload.fileName || payload.image?.name || 'uploaded-image',
      category: payload.category || payload.image?.category,
      userDescription: payload.userDescription || payload.description || '',
      deviceBrand: payload.deviceBrand || payload.brand || '',
      deviceModel: payload.deviceModel || payload.model || '',
      latitude: payload.latitude,
      longitude: payload.longitude,
    });

    return res.json({
      success: true,
      isMockData: false,
      source: 'repairlens-ai-service',
      model: 'repairlens-ai-v1',
      result: diagnosis,
      diagnosis,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Image analysis failed',
      detail: error.message
    });
  }
});

app.post(['/api/nearby', '/api/nearby-shops'], requireAuth, async (req, res) => {
  try {
    const { category, latitude, longitude, radius = 5000 } = req.body || {};
    const userLat = Number(latitude);
    const userLng = Number(longitude);
    if (!category || !Number.isFinite(userLat) || !Number.isFinite(userLng)) return res.status(400).json({ success: false, message: 'A category and valid user location are required.' });
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
    return res.status(502).json({
      success: false,
      source: 'places-unavailable', category: req.body?.category,
      shops: [],
      error: error.message
    });
  }
});

app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`RepairLens app listening on http://localhost:${PORT}`);
});
