/**
 * RepairLens Nearby Service Centre & Price Match Service
 * Swiggy/Zomato style local repair shop discovery engine for India
 * Categorised specifically per selected item category (phone, electronics, auto, appliance, general).
 */

export const INDIAN_REPAIR_HUBS = [
  { id: 'blr-indiranagar', name: 'Indiranagar & Domlur', city: 'Bengaluru', lat: 12.9784, lng: 77.6408 },
  { id: 'blr-koramangala', name: 'Koramangala & HSR Layout', city: 'Bengaluru', lat: 12.9352, lng: 77.6245 },
  { id: 'blr-sproad', name: 'SP Road & City Market', city: 'Bengaluru', lat: 12.9654, lng: 77.5794 },
  { id: 'del-nehruplace', name: 'Nehru Place Tech Hub', city: 'New Delhi', lat: 28.5492, lng: 77.2517 },
  { id: 'del-lajpat', name: 'Lajpat Nagar & South Ex', city: 'New Delhi', lat: 28.5685, lng: 77.2433 },
  { id: 'mum-lamington', name: 'Lamington Road & Grant Road', city: 'Mumbai', lat: 18.9610, lng: 72.8164 },
  { id: 'mum-bandra', name: 'Bandra West & Linking Road', city: 'Mumbai', lat: 19.0596, lng: 72.8295 },
  { id: 'hyd-ameerpet', name: 'Ameerpet & Secunderabad', city: 'Hyderabad', lat: 17.4375, lng: 78.4482 },
  { id: 'chn-ritchie', name: 'Ritchie Street Tech Hub', city: 'Chennai', lat: 13.0645, lng: 80.2721 }
];

export const MOCK_REPAIR_SHOPS = [
  // 📱 SMARTPHONE & TABLET SHOPS
  {
    id: 'phone-1',
    name: 'FixQuick Mobile & Display Hub',
    category: 'phone',
    rating: 4.8,
    reviewsCount: 342,
    distanceKm: 1.2,
    locality: 'Indiranagar 10th Main',
    city: 'Bengaluru',
    address: '#482, 10th Main Road, 100ft Road Junction, Indiranagar',
    phone: '+91 98860 12345',
    priceEstimate: 3200,
    marketAvgDiff: -15,
    turnaround: '30-min Express Screen Swap',
    badge: '⚡ Best Price Match',
    type: 'garage',
    hasDoorstepPickup: true,
    isAuthorised: false,
    timing: 'Open now · 10:00 AM - 9:00 PM'
  },
  {
    id: 'phone-2',
    name: 'Apple Authorised Care - Apex Tech',
    category: 'phone',
    rating: 4.9,
    reviewsCount: 1240,
    distanceKm: 2.8,
    locality: '100ft Road',
    city: 'Bengaluru',
    address: 'Ground Floor, Zenith Plaza, 100ft Road, Indiranagar',
    phone: '+91 80 4123 9988',
    priceEstimate: 6500,
    marketAvgDiff: 25,
    turnaround: 'Same Day OEM Glass Replacement',
    badge: '✅ Authorised Partner',
    type: 'authorized',
    hasDoorstepPickup: false,
    isAuthorised: true,
    timing: 'Open now · 10:00 AM - 8:00 PM'
  },
  {
    id: 'phone-3',
    name: 'CellRx Mobile Glass & Battery Lab',
    category: 'phone',
    rating: 4.7,
    reviewsCount: 210,
    distanceKm: 3.1,
    locality: 'Koramangala 5th Block',
    city: 'Bengaluru',
    address: '#92, 80ft Road, Opp Forum Mall, Koramangala',
    phone: '+91 97410 44332',
    priceEstimate: 2900,
    marketAvgDiff: -20,
    turnaround: '45-min Screen & OCA Glue Repair',
    badge: '💰 Budget Choice',
    type: 'garage',
    hasDoorstepPickup: true,
    isAuthorised: false,
    timing: 'Open now · 10:30 AM - 9:30 PM'
  },

  // 💻 ELECTRONICS & PCB SHOPS
  {
    id: 'elec-1',
    name: 'SP Road Component Masters & Rework Lab',
    category: 'electronics',
    rating: 4.8,
    reviewsCount: 512,
    distanceKm: 4.5,
    locality: 'SP Road',
    city: 'Bengaluru',
    address: 'Shop #14, Ground Floor, SP Road Electronics Market',
    phone: '+91 94480 87654',
    priceEstimate: 1200,
    marketAvgDiff: -25,
    turnaround: '2-Hour Hot-Air Rework',
    badge: '💰 Lowest Price Guaranteed',
    type: 'garage',
    hasDoorstepPickup: true,
    isAuthorised: false,
    timing: 'Open now · 11:00 AM - 8:30 PM'
  },
  {
    id: 'elec-2',
    name: 'ChipLevel Motherboard & PMIC Lab',
    category: 'electronics',
    rating: 4.9,
    reviewsCount: 380,
    distanceKm: 3.6,
    locality: 'Jayanagar 4th Block',
    city: 'Bengaluru',
    address: '#112, 11th Main, Near Shopping Complex, Jayanagar',
    phone: '+91 98450 99887',
    priceEstimate: 1800,
    marketAvgDiff: -10,
    turnaround: 'Microscope Soldering & Trace Repair',
    badge: '⭐ Micro-Soldering Specialist',
    type: 'garage',
    hasDoorstepPickup: true,
    isAuthorised: false,
    timing: 'Open now · 10:00 AM - 8:00 PM'
  },
  {
    id: 'elec-3',
    name: 'Dell & Lenovo Authorised Board Service',
    category: 'electronics',
    rating: 4.7,
    reviewsCount: 650,
    distanceKm: 5.2,
    locality: 'MG Road',
    city: 'Bengaluru',
    address: 'Unit 204, Brigade Towers, MG Road',
    phone: '+91 80 2558 1122',
    priceEstimate: 3500,
    marketAvgDiff: 30,
    turnaround: 'Official OEM Board Swap',
    badge: '✅ Authorised Service',
    type: 'authorized',
    hasDoorstepPickup: false,
    isAuthorised: true,
    timing: 'Open now · 9:30 AM - 6:30 PM'
  },

  // 🚗 AUTOMOTIVE BODYWORK SHOPS
  {
    id: 'auto-1',
    name: 'MotorCraft Bumper & Denting Studio',
    category: 'auto',
    rating: 4.8,
    reviewsCount: 288,
    distanceKm: 2.1,
    locality: 'Domlur Layout',
    city: 'Bengaluru',
    address: 'Plot 45, Near Flyover, Domlur Inner Ring Road',
    phone: '+91 99001 54321',
    priceEstimate: 2800,
    marketAvgDiff: -20,
    turnaround: 'Heat-Pop Dent + 2K Clearcoat Spray',
    badge: '⭐ Highest Rated Garage',
    type: 'garage',
    hasDoorstepPickup: true,
    isAuthorised: false,
    timing: 'Open now · 9:00 AM - 7:30 PM'
  },
  {
    id: 'auto-2',
    name: 'Maruti & TATA Authorised Body Shop',
    category: 'auto',
    rating: 4.9,
    reviewsCount: 1540,
    distanceKm: 4.2,
    locality: 'Old Airport Road',
    city: 'Bengaluru',
    address: '#88, Opposite Command Hospital, Old Airport Road',
    phone: '+91 80 4900 8800',
    priceEstimate: 5500,
    marketAvgDiff: 25,
    turnaround: 'Baking Oven Paint + Insurance Claim',
    badge: '✅ Authorised Partner',
    type: 'authorized',
    hasDoorstepPickup: true,
    isAuthorised: true,
    timing: 'Open now · 8:30 AM - 7:00 PM'
  },
  {
    id: 'auto-3',
    name: 'GoMechanic Express Paint & Dent Clinic',
    category: 'auto',
    rating: 4.6,
    reviewsCount: 420,
    distanceKm: 3.0,
    locality: 'Koramangala 1st Block',
    city: 'Bengaluru',
    address: 'Service Bay 4, Near Wipro Park, Koramangala',
    phone: '+91 98765 00112',
    priceEstimate: 3200,
    marketAvgDiff: -10,
    turnaround: 'Same-Day Bumper Spot Touchup',
    badge: '🚀 Free Doorstep Pick & Drop',
    type: 'garage',
    hasDoorstepPickup: true,
    isAuthorised: false,
    timing: 'Open now · 8:00 AM - 8:00 PM'
  },

  // 🔌 HOME APPLIANCE SHOPS
  {
    id: 'app-1',
    name: 'UrbanCare Appliance & Washer Repair Hub',
    category: 'appliance',
    rating: 4.8,
    reviewsCount: 890,
    distanceKm: 1.8,
    locality: 'HSR Layout Sector 1',
    city: 'Bengaluru',
    address: 'Doorstep Service Hub, HSR 27th Main',
    phone: '+91 80 6789 0000',
    priceEstimate: 1800,
    marketAvgDiff: -15,
    turnaround: '60-min Doorstep Visit',
    badge: '🚀 Free Doorstep Visit',
    type: 'garage',
    hasDoorstepPickup: true,
    isAuthorised: false,
    timing: 'Open now · 8:00 AM - 9:00 PM'
  },
  {
    id: 'app-2',
    name: 'Samsung & LG Authorised Appliance Care',
    category: 'appliance',
    rating: 4.9,
    reviewsCount: 1120,
    distanceKm: 3.5,
    locality: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    address: 'Plaza 300, 100ft Road, Indiranagar',
    phone: '+91 1800 40 7267864',
    priceEstimate: 3500,
    marketAvgDiff: 20,
    turnaround: 'Official OEM Gasket & Bearing Replacement',
    badge: '✅ Authorised Brand Care',
    type: 'authorized',
    hasDoorstepPickup: true,
    isAuthorised: true,
    timing: 'Open now · 9:00 AM - 8:00 PM'
  },

  // 🛠️ GENERAL / CUSTOM MECHANICAL SHOPS
  {
    id: 'gen-1',
    name: 'Industrial Metal & Polymer Fabrication Workshop',
    category: 'general',
    rating: 4.7,
    reviewsCount: 145,
    distanceKm: 2.9,
    locality: 'Peenya Industrial Area',
    city: 'Bengaluru',
    address: 'Shed 12, Phase 1, Peenya Industrial Area',
    phone: '+91 98440 33221',
    priceEstimate: 800,
    marketAvgDiff: -30,
    turnaround: 'Arrest Stop-Holes & Fibreglass Patching',
    badge: '🛠️ Hardware Specialist',
    type: 'garage',
    hasDoorstepPickup: false,
    isAuthorised: false,
    timing: 'Open now · 9:00 AM - 7:00 PM'
  }
];

export function getCurrentPositionPromise() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          locality: 'Detected via GPS'
        });
      },
      (err) => {
        reject(err);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  });
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

function getCityCoordinates(cityName) {
  const cityMap = {
    Bengaluru: { lat: 12.9784, lng: 77.6408 },
    'New Delhi': { lat: 28.6139, lng: 77.2090 },
    Mumbai: { lat: 19.0760, lng: 72.8777 },
    Hyderabad: { lat: 17.3850, lng: 78.4867 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
    default: { lat: 12.9784, lng: 77.6408 }
  };

  return cityMap[cityName] || cityMap.default;
}

export function getNearbyShops(category = 'phone', filter = 'all', userLocation = { lat: 12.9784, lng: 77.6408 }) {
  let shops = MOCK_REPAIR_SHOPS.filter(s => s.category === category);

  if (shops.length === 0) {
    shops = MOCK_REPAIR_SHOPS.filter(s => s.category === 'general');
  }

  const userLat = Number(userLocation?.lat) || 12.9784;
  const userLng = Number(userLocation?.lng) || 77.6408;

  shops = shops.map((shop) => {
    const cityCoords = getCityCoordinates(shop.city || 'Bengaluru');
    const distanceFromUser = haversineKm(userLat, userLng, cityCoords.lat, cityCoords.lng);
    const approxDistance = Math.max(0.5, Number((distanceFromUser + (shop.distanceKm || 0) * 0.35).toFixed(1)));

    return {
      ...shop,
      distanceFromUser: approxDistance,
      displayDistanceKm: approxDistance
    };
  });

  if (filter === 'express') {
    return [...shops].sort((a, b) => a.distanceFromUser - b.distanceFromUser);
  } else if (filter === 'price') {
    return [...shops].sort((a, b) => a.priceEstimate - b.priceEstimate);
  } else if (filter === 'rating') {
    return [...shops].sort((a, b) => b.rating - a.rating || a.distanceFromUser - b.distanceFromUser);
  } else if (filter === 'authorised') {
    return [...shops].filter(s => s.isAuthorised).sort((a, b) => a.distanceFromUser - b.distanceFromUser);
  }

  return [...shops].sort((a, b) => a.distanceFromUser - b.distanceFromUser);
}

export async function fetchNearbyShops(category = 'phone', userLocation = { lat: 12.9784, lng: 77.6408 }) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || (
    typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? '/api'
      : 'http://localhost:4000'
  );

  try {
    const response = await fetch(`${apiBase}/nearby`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        latitude: Number(userLocation?.lat) || 12.9784,
        longitude: Number(userLocation?.lng) || 77.6408,
        radius: 5000
      })
    });

    if (!response.ok) {
      throw new Error(`Nearby API request failed: ${response.status}`);
    }

    const data = await response.json();
    const shops = Array.isArray(data.shops) ? data.shops : [];

    if (shops.length > 0) {
      return shops.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }
  } catch (error) {
    console.warn('Live nearby-store lookup failed, using local list fallback:', error.message);
  }

  return getNearbyShops(category, 'all', userLocation);
}
