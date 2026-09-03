import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOverpassQuery, normalizeNearbyStore, buildGooglePlacesKeyword, normalizeGooglePlace } from '../server/nearby.js';

test('buildOverpassQuery includes the right repair categories for phone repairs', () => {
  const query = buildOverpassQuery('phone');

  assert.match(query, /mobile_phone|electronics|repair/);
  assert.match(query, /around:5000/);
});

test('normalizeNearbyStore creates a consistent shop record for nearby results', () => {
  const store = normalizeNearbyStore({
    tags: {
      name: 'Repair Hub',
      shop: 'mobile_phone',
      addr: 'Indiranagar, Bengaluru'
    },
    lat: 12.97,
    lon: 77.64,
    type: 'node'
  }, 12.9784, 77.6408, 'phone');

  assert.equal(store.category, 'phone');
  assert.equal(store.name, 'Repair Hub');
  assert.ok(store.distanceKm >= 0);
  assert.ok(store.googleMapsUrl.includes('google.com/maps'));
});

test('buildGooglePlacesKeyword and normalizeGooglePlace produce real Google-style results', () => {
  const keyword = buildGooglePlacesKeyword('phone');
  const store = normalizeGooglePlace({
    name: 'CellFix Pro',
    place_id: 'abc123',
    vicinity: 'Indiranagar, Bengaluru',
    geometry: { location: { lat: 12.971, lng: 77.64 } },
    rating: 4.8,
    user_ratings_total: 340,
    types: ['store']
  }, 12.9784, 77.6408, 'phone');

  assert.match(keyword, /mobile phone repair/);
  assert.equal(store.category, 'phone');
  assert.equal(store.name, 'CellFix Pro');
  assert.ok(store.googleMapsUrl.includes('google.com/maps'));
});
