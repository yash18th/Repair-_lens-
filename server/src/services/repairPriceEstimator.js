/**
 * RepairLens Server-Side Market-Based Repair Price Estimator
 * 
 * Generates realistic market-based preliminary estimates for ALL categories:
 * 1. Vehicles
 * 2. Smartphones & Tablets
 * 3. Computers & Laptops
 * 4. Electronics & PCB
 * 5. Home Appliances
 * 6. Other Equipment
 */

export const VEHICLE_CLASSES = {
  LUXURY: 'luxury',
  PREMIUM: 'premium',
  MID_RANGE: 'mid_range',
  ECONOMY: 'economy'
};

const LUXURY_BRANDS = [
  'bmw', 'mercedes', 'mercedes-benz', 'audi', 'jaguar', 'land rover', 'range rover', 
  'volvo', 'lexus', 'porsche', 'maserati', 'alfa romeo', 'bentley', 'rolls-royce'
];

const PREMIUM_BRANDS = [
  'jeep', 'volkswagen', 'skoda', 'mini', 'ds'
];

const PREMIUM_MODELS = [
  'fortuner', 'kodiaq', 'superb', 'octavia', 'tiguan', 'passat', 'gloster', 'compass', 'camry'
];

const MID_RANGE_BRANDS = [
  'honda', 'hyundai', 'kia', 'toyota', 'mahindra', 'tata', 'mg', 'ford', 'chevrolet', 'nissan'
];

export function detectVehicleClass(brand = '', model = '') {
  const normBrand = String(brand || '').toLowerCase().trim();
  const normModel = String(model || '').toLowerCase().trim();

  if (LUXURY_BRANDS.some(b => normBrand.includes(b))) {
    return VEHICLE_CLASSES.LUXURY;
  }
  if (PREMIUM_BRANDS.some(b => normBrand.includes(b)) || PREMIUM_MODELS.some(m => normModel.includes(m))) {
    return VEHICLE_CLASSES.PREMIUM;
  }
  if (MID_RANGE_BRANDS.some(b => normBrand.includes(b))) {
    if (normModel.includes('land cruiser') || normModel.includes('vellfire') || normModel.includes('prado')) {
      return VEHICLE_CLASSES.LUXURY;
    }
    return VEHICLE_CLASSES.MID_RANGE;
  }
  return VEHICLE_CLASSES.ECONOMY;
}

export function detectDeviceClass(category = '', brand = '', model = '') {
  const normCat = String(category || '').toLowerCase();
  const normBrand = String(brand || '').toLowerCase().trim();
  const normModel = String(model || '').toLowerCase().trim();

  if (normCat.includes('vehicle') || normCat.includes('auto') || normCat.includes('car')) {
    const vClass = detectVehicleClass(brand, model);
    return { tierKey: vClass, isFlagship: vClass === VEHICLE_CLASSES.LUXURY || vClass === VEHICLE_CLASSES.PREMIUM };
  }

  if (normCat.includes('phone') || normCat.includes('tablet') || normCat.includes('mobile')) {
    const isApple = normBrand.includes('apple') || normBrand.includes('iphone') || normModel.includes('iphone') || normModel.includes('ipad');
    const isSamsungUltra = (normBrand.includes('samsung') || normModel.includes('galaxy')) && (normModel.includes('ultra') || normModel.includes('fold') || normModel.includes('flip'));
    const isPixelPro = normBrand.includes('pixel') || normModel.includes('pixel pro');
    if (isApple || isSamsungUltra || isPixelPro) return { tierKey: 'flagship', isFlagship: true };
    const isMidRange = normBrand.includes('oneplus') || normBrand.includes('samsung') || normBrand.includes('xiaomi') || normBrand.includes('redmi') || normBrand.includes('vivo') || normBrand.includes('oppo');
    if (isMidRange) return { tierKey: 'mid_range', isFlagship: false };
    return { tierKey: 'budget', isFlagship: false };
  }

  if (normCat.includes('laptop') || normCat.includes('computer') || normCat.includes('pc')) {
    const isMacBook = normBrand.includes('apple') || normBrand.includes('macbook') || normModel.includes('macbook');
    const isWorkstation = isMacBook || normBrand.includes('xps') || normModel.includes('xps') || normModel.includes('thinkpad x1') || normModel.includes('rog') || normBrand.includes('alienware');
    if (isWorkstation) return { tierKey: 'workstation', isFlagship: true };
    const isMainstream = normBrand.includes('dell') || normBrand.includes('hp') || normBrand.includes('lenovo') || normBrand.includes('asus') || normBrand.includes('acer');
    if (isMainstream) return { tierKey: 'mainstream', isFlagship: false };
    return { tierKey: 'entry', isFlagship: false };
  }

  if (normCat.includes('electronic') || normCat.includes('pcb') || normCat.includes('circuit')) {
    if (normModel.includes('inverter') || normModel.includes('controller') || normModel.includes('industrial') || normBrand.includes('siemens')) {
      return { tierKey: 'industrial', isFlagship: true };
    }
    if (normModel.includes('smps') || normModel.includes('amplifier') || normModel.includes('power supply')) {
      return { tierKey: 'consumer', isFlagship: false };
    }
    return { tierKey: 'basic', isFlagship: false };
  }

  if (normCat.includes('appliance')) {
    if (normModel.includes('refrigerator') || normModel.includes('washing machine') || normModel.includes('air conditioner') || normModel.includes('dishwasher')) {
      return { tierKey: 'major', isFlagship: true };
    }
    if (normModel.includes('microwave') || normModel.includes('oven') || normModel.includes('induction')) {
      return { tierKey: 'kitchen', isFlagship: false };
    }
    return { tierKey: 'compact', isFlagship: false };
  }

  if (normModel.includes('rotary hammer') || normModel.includes('breaker') || normModel.includes('grinder') || normBrand.includes('bosch') || normBrand.includes('dewalt') || normBrand.includes('makita')) {
    return { tierKey: 'industrial', isFlagship: true };
  }
  return { tierKey: 'general', isFlagship: false };
}

export const AUTO_COMPONENT_BENCHMARKS = {
  'front bumper': {
    name: 'Front Bumper Cover / Fascia',
    rrHours: 2.5,
    paintUnits: 1.0,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [3800, 5600], aftermarket: [2000, 3200], used: [1400, 2200] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [8500, 14000], aftermarket: [4200, 7200], used: [2800, 4800] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [22000, 34000], aftermarket: [11000, 18000], used: [7500, 12000] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [42000, 62000], aftermarket: [18000, 28000], used: [11000, 18000] }
    }
  },
  'hood': {
    name: 'Hood / Engine Bonnet Assembly',
    rrHours: 2.0,
    paintUnits: 1.5,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [5200, 7800], aftermarket: [2800, 4200], used: [1900, 3000] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [11000, 18000], aftermarket: [5800, 9500], used: [3800, 6500] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [26000, 42000], aftermarket: [14000, 22000], used: [9000, 15000] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [48000, 72000], aftermarket: [24000, 36000], used: [16000, 25000] }
    }
  },
  'headlamp left': {
    name: 'Left Headlamp Assembly (LED/Matrix)',
    rrHours: 1.0,
    paintUnits: 0,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [3200, 5800], aftermarket: [1800, 3200], used: [1200, 2200] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [9500, 18500], aftermarket: [5000, 9800], used: [3500, 6800] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [32000, 54000], aftermarket: [18000, 28000], used: [12000, 20000] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [65000, 98000], aftermarket: [28000, 44000], used: [19000, 32000] }
    }
  },
  'headlamp right': {
    name: 'Right Headlamp Assembly (LED/Matrix)',
    rrHours: 1.0,
    paintUnits: 0,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [3200, 5800], aftermarket: [1800, 3200], used: [1200, 2200] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [9500, 18500], aftermarket: [5000, 9800], used: [3500, 6800] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [32000, 54000], aftermarket: [18000, 28000], used: [12000, 20000] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [65000, 98000], aftermarket: [28000, 44000], used: [19000, 32000] }
    }
  },
  'front grille': {
    name: 'Front Radiator Grille & Kidney Trim',
    rrHours: 1.2,
    paintUnits: 0.3,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [1400, 2600], aftermarket: [750, 1400], used: [500, 950] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [3800, 7200], aftermarket: [1900, 3600], used: [1200, 2400] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [9500, 18000], aftermarket: [4800, 9000], used: [3200, 6000] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [22000, 38000], aftermarket: [10000, 18000], used: [6500, 12000] }
    }
  },
  'radiator support': {
    name: 'Radiator Core Support Structure',
    rrHours: 3.5,
    paintUnits: 0.5,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [2800, 4800], aftermarket: [1600, 2800], used: [1100, 1900] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [6500, 11500], aftermarket: [3500, 6200], used: [2400, 4200] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [14000, 25000], aftermarket: [7500, 13000], used: [5000, 8500] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [28000, 46000], aftermarket: [14000, 24000], used: [9000, 16000] }
    }
  },
  'radiator': {
    name: 'Engine Cooling Radiator Assembly',
    rrHours: 2.5,
    paintUnits: 0,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [3200, 5600], aftermarket: [1800, 3200], used: [1200, 2100] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [7200, 13000], aftermarket: [3800, 7000], used: [2600, 4800] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [16000, 28000], aftermarket: [8500, 15000], used: [5800, 10000] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [32000, 52000], aftermarket: [16000, 27000], used: [11000, 18000] }
    }
  },
  'condenser': {
    name: 'A/C Condenser & Drier Assembly',
    rrHours: 2.5,
    paintUnits: 0,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [2900, 5200], aftermarket: [1700, 3000], used: [1100, 1900] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [6200, 11500], aftermarket: [3400, 6200], used: [2200, 4200] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [14000, 25000], aftermarket: [7500, 13500], used: [5000, 9000] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [28000, 46000], aftermarket: [14000, 24000], used: [9500, 16000] }
    }
  },
  'crash absorber': {
    name: 'Front Bumper Reinforcement / Crash Beam',
    rrHours: 1.5,
    paintUnits: 0,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [2200, 3800], aftermarket: [1200, 2100], used: [800, 1400] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [4800, 8800], aftermarket: [2600, 4800], used: [1800, 3200] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [11000, 20000], aftermarket: [6000, 11000], used: [4000, 7200] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [24000, 42000], aftermarket: [12000, 22000], used: [8000, 15000] }
    }
  },
  'fender': {
    name: 'Front Quarter Panel / Fender',
    rrHours: 2.0,
    paintUnits: 1.0,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [2400, 4200], aftermarket: [1300, 2300], used: [900, 1600] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [5200, 9200], aftermarket: [2800, 5000], used: [1900, 3400] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [14000, 24000], aftermarket: [7500, 13000], used: [5000, 8800] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [28000, 45000], aftermarket: [14000, 24000], used: [9500, 16000] }
    }
  },
  'parking sensors': {
    name: 'Ultrasonic Distance & ADAS Radar Sensor Pack',
    rrHours: 1.5,
    paintUnits: 0,
    pricing: {
      [VEHICLE_CLASSES.ECONOMY]: { oem: [1800, 3400], aftermarket: [950, 1800], used: [650, 1200] },
      [VEHICLE_CLASSES.MID_RANGE]: { oem: [4500, 9000], aftermarket: [2400, 4800], used: [1600, 3200] },
      [VEHICLE_CLASSES.PREMIUM]: { oem: [15000, 32000], aftermarket: [8000, 16000], used: [5200, 11000] },
      [VEHICLE_CLASSES.LUXURY]: { oem: [36000, 68000], aftermarket: [18000, 34000], used: [12000, 22000] }
    }
  }
};

export function matchComponentKey(compName = '', category = 'Vehicles') {
  const norm = String(compName || '').toLowerCase().trim();
  const normCat = String(category || '').toLowerCase();

  if (normCat.includes('vehicle') || normCat.includes('auto') || normCat.includes('car')) {
    if (norm.includes('headlamp') || norm.includes('headlight') || norm.includes('light')) {
      if (norm.includes('right')) return 'headlamp right';
      return 'headlamp left';
    }
    if (norm.includes('crash') || norm.includes('absorber') || norm.includes('reinforcement') || norm.includes('beam') || norm.includes('impact bar')) return 'crash absorber';
    if (norm.includes('bumper') || norm.includes('fascia')) return 'front bumper';
    if (norm.includes('hood') || norm.includes('bonnet')) return 'hood';
    if (norm.includes('grille') || norm.includes('intake') || norm.includes('kidney')) return 'front grille';
    if (norm.includes('radiator support') || norm.includes('core support')) return 'radiator support';
    if (norm.includes('condenser') || norm.includes('ac')) return 'condenser';
    if (norm.includes('radiator') || norm.includes('cooling')) return 'radiator';
    if (norm.includes('fender') || norm.includes('quarter panel')) return 'fender';
    if (norm.includes('sensor') || norm.includes('radar') || norm.includes('adas') || norm.includes('parking')) return 'parking sensors';
    return null;
  }

  // Device / electronics / appliance matching
  if (norm.includes('screen') || norm.includes('display') || norm.includes('panel') || norm.includes('oled') || norm.includes('amoled') || norm.includes('retina')) return 'display';
  if (norm.includes('back glass') || norm.includes('rear glass') || norm.includes('housing') || norm.includes('casing') || norm.includes('door gasket')) return 'housing';
  if (norm.includes('motherboard') || norm.includes('logic board') || norm.includes('board') || norm.includes('pcb') || norm.includes('control') || norm.includes('mosfet')) return 'board';
  if (norm.includes('battery') || norm.includes('compressor') || norm.includes('motor') || norm.includes('armature')) return 'power_drive';
  return 'general';
}

export function estimateRepairCost({
  category = 'Other',
  deviceType = 'device',
  brand = 'Unknown',
  model = 'Unknown',
  issue = 'Issue detected',
  affectedComponents = [],
  severity = 'Medium',
  repairComplexity = 'Medium',
  currency = 'INR',
  locationCity = 'Bengaluru',
  damageDetails = []
}) {
  const normCat = String(category || '').toLowerCase();
  const isVehicle = normCat.includes('vehicle') || normCat.includes('auto') || normCat.includes('car');

  if (!isVehicle) {
    const classDetection = detectDeviceClass(category, brand, model);
    const isPhone = normCat.includes('phone') || normCat.includes('tablet') || normCat.includes('mobile');
    const isLaptop = normCat.includes('laptop') || normCat.includes('computer') || normCat.includes('pc');
    const isPCB = normCat.includes('electronic') || normCat.includes('pcb') || normCat.includes('circuit');
    const isAppliance = normCat.includes('appliance');

    let partsMin = 2500;
    let partsMax = 5500;
    let laborMin = 750;
    let laborMax = 1400;

    if (isPhone) {
      if (classDetection.isFlagship) {
        partsMin = 8500;
        partsMax = 22000;
        laborMin = 1100;
        laborMax = 1900;
      } else {
        partsMin = 2800;
        partsMax = 6500;
        laborMin = 650;
        laborMax = 1200;
      }
    } else if (isLaptop) {
      if (classDetection.isFlagship) {
        partsMin = 14000;
        partsMax = 36000;
        laborMin = 1500;
        laborMax = 2600;
      } else {
        partsMin = 4800;
        partsMax = 14000;
        laborMin = 950;
        laborMax = 1800;
      }
    } else if (isPCB) {
      partsMin = classDetection.isFlagship ? 2800 : 1200;
      partsMax = classDetection.isFlagship ? 7500 : 3500;
      laborMin = 850;
      laborMax = 1600;
    } else if (isAppliance) {
      partsMin = classDetection.isFlagship ? 4500 : 2000;
      partsMax = classDetection.isFlagship ? 11000 : 4800;
      laborMin = 800;
      laborMax = 1500;
    } else {
      partsMin = 1800;
      partsMax = 4500;
      laborMin = 650;
      laborMax = 1200;
    }

    const sevMult = severity === 'Critical' ? 1.4 : severity === 'High' ? 1.25 : 1.0;
    const compCount = Array.isArray(affectedComponents) ? Math.max(1, affectedComponents.length) : 1;
    const compFactor = 1 + (compCount - 1) * 0.25;

    partsMin = Math.round(partsMin * sevMult * compFactor);
    partsMax = Math.round(partsMax * sevMult * compFactor);
    laborMin = Math.round(laborMin * sevMult);
    laborMax = Math.round(laborMax * sevMult);

    const totalMin = partsMin + laborMin;
    const totalMax = partsMax + laborMax;

    return {
      currency,
      unit: currency,
      partsCostMin: partsMin,
      partsCostMax: partsMax,
      laborCostMin: laborMin,
      laborCostMax: laborMax,
      estimatedTotalMin: totalMin,
      estimatedTotalMax: totalMax,
      formatted: `${currency} ${totalMin.toLocaleString('en-IN')} – ${currency} ${totalMax.toLocaleString('en-IN')}`,
      estimateLabel: `${currency} ${totalMin.toLocaleString('en-IN')} – ${currency} ${totalMax.toLocaleString('en-IN')}`,
      note: 'Bench cost estimate for hardware replacement and calibration.'
    };
  }

  // Realistic Automotive Collision Engine
  const vehicleClass = detectVehicleClass(brand, model);
  const hourlyGeneral = 1200;
  const hourlyAuthorized = 2400;

  let compList = Array.isArray(damageDetails) && damageDetails.length > 0 ? damageDetails : (Array.isArray(affectedComponents) ? affectedComponents.map(c => ({ component: c })) : []);
  if (compList.length === 0) {
    compList = [{ component: 'Front Bumper Cover' }, { component: 'Left Headlamp' }, { component: 'Hood' }];
  }

  let oemMinSum = 0;
  let oemMaxSum = 0;
  let totalHours = 0;
  let totalPaintUnits = 0;
  let confirmedCount = 0;

  const seen = new Set();
  for (const item of compList) {
    const key = matchComponentKey(item.component, 'Vehicles');
    const dedupeKey = key || String(item.component).toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const compData = key ? AUTO_COMPONENT_BENCHMARKS[key] : null;
    const pricing = compData ? compData.pricing[vehicleClass] || compData.pricing[VEHICLE_CLASSES.MID_RANGE] : null;

    if (pricing) {
      oemMinSum += pricing.oem[0];
      oemMaxSum += pricing.oem[1];
      totalHours += compData.rrHours;
      totalPaintUnits += compData.paintUnits;
      confirmedCount++;
    } else {
      const fallbackMin = vehicleClass === VEHICLE_CLASSES.LUXURY ? 28000 : 7500;
      const fallbackMax = vehicleClass === VEHICLE_CLASSES.LUXURY ? 45000 : 13000;
      oemMinSum += fallbackMin;
      oemMaxSum += fallbackMax;
      totalHours += 1.5;
      totalPaintUnits += 0.8;
      confirmedCount++;
    }
  }

  const laborMin = Math.round(totalHours * hourlyGeneral);
  const laborMax = Math.round(totalHours * hourlyAuthorized);

  const paintClassMult = vehicleClass === VEHICLE_CLASSES.LUXURY ? 1.9 : vehicleClass === VEHICLE_CLASSES.PREMIUM ? 1.4 : 1.0;
  const paintMin = Math.round(totalPaintUnits * 5500 * paintClassMult);
  const paintMax = Math.round(totalPaintUnits * 8500 * paintClassMult);

  const calMin = vehicleClass === VEHICLE_CLASSES.LUXURY ? 14000 : 4500;
  const calMax = vehicleClass === VEHICLE_CLASSES.LUXURY ? 22000 : 8000;

  let totalMin = Math.round(oemMinSum + laborMin + paintMin + calMin);
  let totalMax = Math.round(oemMaxSum + laborMax + paintMax + calMax);

  if (vehicleClass === VEHICLE_CLASSES.LUXURY && confirmedCount >= 3) {
    totalMin = Math.max(totalMin, 110000);
    totalMax = Math.max(totalMax, 185000);
  } else if (vehicleClass === VEHICLE_CLASSES.LUXURY && confirmedCount >= 1) {
    totalMin = Math.max(totalMin, 42000);
    totalMax = Math.max(totalMax, 75000);
  }

  return {
    currency,
    unit: currency,
    partsCostMin: oemMinSum,
    partsCostMax: oemMaxSum,
    laborCostMin: laborMin + paintMin,
    laborCostMax: laborMax + paintMax,
    calibrationMin: calMin,
    calibrationMax: calMax,
    estimatedTotalMin: totalMin,
    estimatedTotalMax: totalMax,
    formatted: `${currency} ${totalMin.toLocaleString('en-IN')} – ${currency} ${totalMax.toLocaleString('en-IN')}`,
    estimateLabel: `${currency} ${totalMin.toLocaleString('en-IN')} – ${currency} ${totalMax.toLocaleString('en-IN')}`,
    note: 'Preliminary market-based workshop estimate. Physical tear-down inspection required before final authorization.'
  };
}

export function estimateRepairCostBreakdown(payload = {}) {
  const estimate = estimateRepairCost(payload);
  return {
    currency: estimate.currency,
    parts: {
      min: estimate.partsCostMin,
      max: estimate.partsCostMax,
      label: `${estimate.currency} ${estimate.partsCostMin.toLocaleString('en-IN')} – ${estimate.currency} ${estimate.partsCostMax.toLocaleString('en-IN')}`
    },
    labor: {
      min: estimate.laborCostMin,
      max: estimate.laborCostMax,
      label: `${estimate.currency} ${estimate.laborCostMin.toLocaleString('en-IN')} – ${estimate.currency} ${estimate.laborCostMax.toLocaleString('en-IN')}`
    },
    total: {
      min: estimate.estimatedTotalMin,
      max: estimate.estimatedTotalMax,
      label: `${estimate.currency} ${estimate.estimatedTotalMin.toLocaleString('en-IN')} – ${estimate.currency} ${estimate.estimatedTotalMax.toLocaleString('en-IN')}`
    },
    note: estimate.note
  };
}
