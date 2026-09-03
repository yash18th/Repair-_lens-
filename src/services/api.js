/**
 * RepairLens Human-Readable AI Diagnosis Service
 * Includes Evidence & Uncertainty Intelligence Layer, AI Confidence Engine,
 * Guided Camera Position Prompts, and 🩻 Interactive Damage Map data.
 */

export const ITEM_CATEGORIES = [
  { id: 'phone', label: 'Smartphone & Tablet', icon: '📱', desc: 'Display glass, touch screen, frame, battery' },
  { id: 'electronics', label: 'Electronics & PCB', icon: '💻', desc: 'Motherboards, VRM chips, burnt capacitors' },
  { id: 'auto', label: 'Automotive Bodywork', icon: '🚗', desc: 'Bumper scrapes, clearcoat, paint touchup' },
  { id: 'appliance', label: 'Home Appliance', icon: '🔌', desc: 'Washing machines, seals, motors, leaks' },
  { id: 'general', label: 'General / Custom Item', icon: '🛠️', desc: 'Other mechanical or household parts' }
];

export const ANGLE_TYPES = [
  { id: 'closeup', label: 'Photo 1: Close-up', icon: '🔍', description: 'Close-up detail of crack, fracture, burn, or leak' },
  { id: 'fullView', label: 'Photo 2: Full Object', icon: '📦', description: 'Overall view of device, vehicle part, or appliance' },
  { id: 'label', label: 'Photo 3: Label / Model #', icon: '🏷️', description: 'Serial tag, barcode, sticker, or specification plate' },
  { id: 'altAngle', label: 'Photo 4: Alt Angle', icon: '📐', description: 'Side, rear, or depth perspective' }
];

export const SAMPLE_PRESETS = [
  {
    id: 'sample-phone',
    name: 'Cracked Smartphone Screen',
    category: 'phone',
    categoryLabel: 'Smartphone & Tablet',
    imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800',
    description: 'Front glass fracture & corner impact on OLED display',
    angles: {
      closeup: {
        name: 'Photo 1 - Close-up Damage.jpg',
        url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800',
        label: 'Close-up Damage'
      },
      fullView: {
        name: 'Photo 2 - Full Device.jpg',
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
        label: 'Full Object View'
      },
      label: {
        name: 'Photo 3 - Model Tag.jpg',
        url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&q=80&w=800',
        label: 'Label / Model #'
      },
      altAngle: {
        name: 'Photo 4 - Side Frame.jpg',
        url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=800',
        label: 'Alternate Angle'
      }
    },
    mockData: {
      problemTitle: 'Front Display Glass Fracture & Screen Assembly Damage',
      problemDescription: 'The outer display glass is cracked with spiderweb fracturing originating from the upper corner. The underlying OLED touch digitizer remains responsive, but the protective glass cover is severely compromised.',
      severity: 'High',
      severityLevel: 3,
      confidenceEngine: {
        diagnosisConfidence: 94,
        confidenceLevel: 'HIGH',
        evidenceQuality: 'EXCELLENT',
        unknowns: 'Internal battery health, motherboard flex cable stress, or liquid ingress indicator status cannot be determined from surface photos.',
        isLowConfidence: false,
        competingHypotheses: null
      },
      guidedNextPhotoRequest: null,
      damageMap: {
        totalRegionsDetected: 2,
        imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800',
        regions: [
          {
            id: 'reg-1',
            label: 'Primary Display Glass Shatter Zone',
            type: 'primary', // 🔴 Red
            severity: 'High',
            position: { top: '25%', left: '35%', width: '45%', height: '40%' },
            description: 'Concentrated spiderweb glass fracture radiating outwards across OLED display matrix.',
            actionRequired: 'Unseal display perimeter gasket and replace outer glass assembly panel.'
          },
          {
            id: 'reg-2',
            label: 'Bezel Corner Frame Dent',
            type: 'secondary', // 🟡 Yellow
            severity: 'Moderate',
            position: { top: '10%', left: '70%', width: '22%', height: '22%' },
            description: '0.4mm corner deformation on aluminum frame adjacent to power button housing.',
            actionRequired: 'File aluminum bezel edge flat prior to seating replacement screen panel.'
          },
          {
            id: 'reg-3',
            label: 'Camera Module & Rear Glass',
            type: 'intact', // 🟢 Green
            severity: 'Intact',
            position: { top: '65%', left: '15%', width: '70%', height: '28%' },
            description: 'No visible glass cracking or optical lens distortion detected.',
            actionRequired: 'No action needed. Component is in healthy operational state.'
          }
        ]
      },
      detectedDamage: 'Display Glass Fracture & Corner Stress Crack',
      likelyCause: 'High-velocity corner impact on concrete surface',
      evidence: [
        'Spiderweb cracks radiating from top-right aluminum bezel edge',
        'Touch digitizer matrix below glass registers inputs cleanly',
        '0.4mm frame dent adjacent to power button absorbed kinetic energy',
        'Rear camera glass and back panel show zero cracking'
      ],
      whatWeCannotSee: 'Internal battery health, motherboard flex cable stress, or liquid ingress indicator status cannot be determined from surface photos.',
      extractedModel: {
        brand: 'Apple',
        modelName: 'iPhone 13 Pro Max',
        modelNumber: 'Model A2643',
        serial: 'SN: F2LXK990N73M',
        specs: '6.7-inch OLED Display, 256GB'
      },
      possibleCause: 'High-impact drop onto a hard surface. The corner frame absorbed initial kinetic energy, concentrating stress across the front glass panel.',
      risksIfUnfixed: [
        'Glass shards may detach and cause injury to fingers.',
        'Dust and moisture can leak inside and corrode internal circuits.',
        'Cracks will expand over time due to touch pressure.'
      ],
      solutionTitle: 'Replace Outer Display Glass & Reseal Waterproof Gasket',
      solutionDescription: 'The damaged front display assembly needs to be unsealed and replaced with a new OEM-spec screen panel. The perimeter adhesive gasket must also be replaced to maintain water resistance.',
      estimatedCost: { min: 65, max: 140, currency: '$', formatted: '$65 - $140 (DIY Parts) / $299 (Apple Store)' },
      costIntelligence: {
        totalEstimate: { min: 4500, max: 7500 },
        confidenceLabel: 'Medium',
        breakdown: [
          { label: 'Replacement Display Assembly', amount: 3200 },
          { label: 'Labour (Screen Swap)', amount: 800 },
          { label: 'Adhesive Gasket & Tools', amount: 350 },
          { label: 'GST (18%)', amount: 783, isGST: true },
          { label: 'Estimated Total', amount: 5133, isTotal: true }
        ],
        localPrices: [
          {
            type: 'authorized',
            label: 'Authorized Service Centre',
            min: 6500,
            max: 9500,
            note: 'Apple Premium Reseller / Brand Service Centre. Warranty preserved.'
          },
          {
            type: 'garage',
            label: 'Independent Repair Shop',
            min: 3500,
            max: 5500,
            note: 'Local mobile repair technician. 30-day parts warranty typical.'
          },
          {
            type: 'diy',
            label: 'DIY Repair',
            min: 1800,
            max: 3000,
            note: 'OEM-compatible screen from Flipkart/Amazon. Intermediate skill required.'
          }
        ]
      },
      recommendation: 'DIY (Intermediate Skill)',
      complexity: 'Moderate',
      diySuitabilityScore: 82,
      timeEstimate: '45 - 60 minutes',
      toolsRequired: ['Heat gun / Hairdryer', 'Suction cup & opening picks', 'Pentalobe P2 Screwdriver', 'Tri-point Y000 Screwdriver', 'Replacement B-7000 Adhesive Gasket'],
      steps: [
        {
          title: 'Power Off & Apply Glass Safety Tape',
          description: 'Turn off the phone completely. Cover cracked glass with clear tape to prevent loose glass pieces from flaking during repair.'
        },
        {
          title: 'Remove Bottom Screws',
          description: 'Unscrew the two Pentalobe screws located on the bottom edge next to the charging port.'
        },
        {
          title: 'Warm Edge Sealant',
          description: 'Use a hairdryer or heat gun on low for 2 minutes around the screen edges to soften the factory adhesive.'
        },
        {
          title: 'Pry Screen Assembly Open',
          description: 'Attach suction cup near the bottom edge, pull up gently, and slide plastic opening picks along the edge to separate the screen.'
        },
        {
          title: 'Disconnect Battery & Transfer Top Speaker',
          description: 'Disconnect the battery connector first. Transfer the top earpiece speaker and sensor cable assembly over to your replacement screen.'
        },
        {
          title: 'Install Replacement Screen & Seal',
          description: 'Connect replacement screen flex cables, apply fresh perimeter adhesive gasket, snap display down firmly, and re-install bottom screws.'
        }
      ]
    }
  },
  {
    id: 'sample-bumper',
    name: 'Automotive Bumper Scrape',
    category: 'auto',
    categoryLabel: 'Automotive Bodywork',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    description: 'Surface clearcoat scrape with underlying plastic deformation',
    angles: {
      closeup: {
        name: 'Photo 1 - Scrape Detail.jpg',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
        label: 'Close-up Damage'
      },
      fullView: {
        name: 'Photo 2 - Front Bumper.jpg',
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
        label: 'Full Object View'
      },
      label: {
        name: 'Photo 3 - VIN Door Tag.jpg',
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
        label: 'Label / Model #'
      },
      altAngle: {
        name: 'Photo 4 - Side Profile.jpg',
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
        label: 'Alternate Angle'
      }
    },
    mockData: {
      problemTitle: 'Plastic Bumper Scrape & Paint Clearcoat Abrasion',
      problemDescription: 'Scuffing and paint transfer on lower corner bumper cover. Surface scratches extend through clearcoat into plastic layer. Bumper mounting brackets and sensors remain intact.',
      severity: 'Low',
      severityLevel: 1,
      confidenceEngine: {
        diagnosisConfidence: 87,
        confidenceLevel: 'HIGH',
        evidenceQuality: 'GOOD',
        unknowns: 'Internal bumper steel reinforcement beam and hidden plastic mounting tabs cannot be confirmed from the uploaded surface photo.',
        isLowConfidence: false,
        competingHypotheses: null
      },
      guidedNextPhotoRequest: null,
      damageMap: {
        totalRegionsDetected: 2,
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
        regions: [
          {
            id: 'reg-b1',
            label: 'Lower Right Paint Abrasion Zone',
            type: 'primary', // 🔴 Red
            severity: 'Low',
            position: { top: '30%', left: '25%', width: '50%', height: '45%' },
            description: 'Surface clearcoat scrape & white paint transfer along polypropylene bumper valence.',
            actionRequired: 'Wet-sand scratches smooth with 2000-grit sandpaper and respray OEM clearcoat.'
          },
          {
            id: 'reg-b2',
            label: 'Minor Plastic Indentation Flex',
            type: 'secondary', // 🟡 Yellow
            severity: 'Low',
            position: { top: '50%', left: '70%', width: '25%', height: '30%' },
            description: '3mm minor inward plastic flexion from curb contact.',
            actionRequired: 'Warm plastic with heat gun for 2 mins and push outward from behind.'
          },
          {
            id: 'reg-b3',
            label: 'Fog Light Housing & Parking Sensor',
            type: 'intact', // 🟢 Green
            severity: 'Intact',
            position: { top: '10%', left: '10%', width: '35%', height: '25%' },
            description: 'No plastic bracket tearing or optical lens damage.',
            actionRequired: 'No action needed. Sensor function verified.'
          }
        ]
      },
      detectedDamage: 'Surface Paint Clearcoat Abrasion & Friction Scuff',
      likelyCause: 'Low-speed curb contact while maneuvering parking space',
      evidence: [
        'Scratch concentrated on lower-right bumper valence corner',
        'No visible plastic tearing or mounting clip displacement',
        'White paint transfer detected along impact margin',
        'Fog light housing & parking sensors physically unaffected'
      ],
      whatWeCannotSee: 'Internal bumper steel reinforcement beam and hidden plastic mounting tabs cannot be confirmed from the uploaded surface photo.',
      extractedModel: {
        brand: 'Honda',
        modelName: 'Civic Hatchback',
        modelNumber: 'Paint Code: NH-731P (Crystal Black)',
        serial: 'VIN: 1HGFC2F73MH094321',
        specs: 'Polypropylene Plastic Bumper Cover'
      },
      possibleCause: 'Low-speed parking curb contact. Damage is cosmetic only; bumper steel reinforcement beam is unaffected.',
      risksIfUnfixed: [
        'Cosmetic eyesore reducing vehicle resale value.',
        'Scratched plastic edges may flake paint over time.'
      ],
      solutionTitle: 'Wet-Sand, Prime, & Repaint Bumper Corner',
      solutionDescription: 'Heat-pop any minor plastic indentation, wet-sand scratch edges smooth, apply plastic adhesion promoter primer, and layer matching OEM spray paint and glossy clearcoat.',
      estimatedCost: { min: 35, max: 95, currency: '$', formatted: '$35 - $95 (DIY Touch-up) / $400 (Body Shop)' },
      costIntelligence: {
        totalEstimate: { min: 2500, max: 4500 },
        confidenceLabel: 'High',
        breakdown: [
          { label: 'OEM Colour-Matched Touch-up Paint', amount: 1200 },
          { label: 'Labour (Sanding & Spray)', amount: 1000 },
          { label: 'Primer, Clearcoat & Materials', amount: 800 },
          { label: 'GST (18%)', amount: 540, isGST: true },
          { label: 'Estimated Total', amount: 3540, isTotal: true }
        ],
        localPrices: [
          {
            type: 'authorized',
            label: 'Authorized Body Shop',
            min: 4500,
            max: 6000,
            note: 'Brand-authorised denting & painting centre. Insurance claim accepted.'
          },
          {
            type: 'garage',
            label: 'Independent Garage',
            min: 2500,
            max: 3800,
            note: 'Local denting shop. Negotiate for spot-repair (not full respray).'
          },
          {
            type: 'diy',
            label: 'DIY Repair',
            min: 1000,
            max: 1500,
            note: 'Dupli-Color or Motospray aerosol from AutoZone/Amazon India. Easy skill.'
          }
        ]
      },
      recommendation: 'DIY Friendly',
      complexity: 'Easy',
      diySuitabilityScore: 94,
      timeEstimate: '1 - 2 hours',
      toolsRequired: ['2000-grit wet sandpaper', 'Plastic adhesion promoter spray', 'OEM color-matched touchup spray paint', '2K Clearcoat spray', 'Microfiber buffing cloth'],
      steps: [
        {
          title: 'Wash & Degrease Damage Zone',
          description: 'Clean area thoroughly with detergent to remove road grease and road grime.'
        },
        {
          title: 'Heat & Flatten Plastic Indentation',
          description: 'Warm the indented plastic area from behind using a heat gun for 2 minutes, then push outward to pop dent back flat.'
        },
        {
          title: 'Wet-Sand Scratches Smooth',
          description: 'Sand scratched edges with 2000-grit wet sandpaper soaked in soapy water until transition feels completely smooth.'
        },
        {
          title: 'Apply Primer & OEM Spray Paint',
          description: 'Mask surrounding panel areas. Apply 2 thin coats of plastic primer, followed by 2 coats of OEM matching color paint.'
        },
        {
          title: 'Apply Clearcoat & Polish',
          description: 'Spray 2 coats of glossy 2K clearcoat. Allow 24 hours to cure, then buff with polishing compound for seamless factory finish.'
        }
      ]
    }
  },
  {
    id: 'sample-unclear',
    name: '⚠ Low Confidence Scuff (Guided AI Demo)',
    category: 'auto',
    categoryLabel: 'Automotive Bodywork',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    description: 'Single blurry photo showing ambiguous scuff mark',
    angles: {
      closeup: {
        name: 'Photo 1 - Blurry Scuff.jpg',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
        label: 'Close-up Damage'
      }
    },
    mockData: {
      problemTitle: 'Ambiguous Bumper Scuff & Potential Plastic Deformation',
      problemDescription: 'Single photo provided shows glare over damaged zone. Current visual data cannot determine whether the plastic substrate is cracked or only scratched.',
      severity: 'Medium',
      severityLevel: 2,
      confidenceEngine: {
        diagnosisConfidence: 45,
        confidenceLevel: 'LOW',
        evidenceQuality: 'POOR',
        unknowns: 'Internal plastic bracket clips and sub-surface fracture depth cannot be confirmed due to glare and single camera angle.',
        isLowConfidence: true,
        competingHypotheses: {
          optionA: 'A. Cosmetic Surface Paint Abrasion (Scuff only)',
          optionB: 'B. Substrate Plastic Frame Deformation (Dented bracket underneath)',
          recommendation: 'Upload Photo 4 (Alt Angle) or Photo 2 (Full View) to resolve depth ambiguity.'
        }
      },
      guidedNextPhotoRequest: {
        targetSlotId: 'altAngle',
        targetSlotLabel: 'Photo 4: Left Side Profile',
        aiPrompt: 'I need to see the left side of the bumper.',
        cameraPositionGuide: '📷 → Move camera to 45° Left Side Angle (20cm distance)',
        purpose: 'This will help determine whether the bumper is cracked or only scratched.',
        sampleSuggestedPhotoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
      },
      damageMap: {
        totalRegionsDetected: 2,
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
        regions: [
          {
            id: 'reg-u1',
            label: 'Ambiguous Surface Scuff Zone',
            type: 'secondary', // 🟡 Yellow
            severity: 'Uncertain',
            position: { top: '35%', left: '30%', width: '45%', height: '40%' },
            description: 'Surface glare obscures plastic depth profile.',
            actionRequired: 'Upload Photo 4 (Alt Angle) to resolve depth ambiguity.'
          }
        ]
      },
      detectedDamage: 'Ambiguous Surface Scuff vs Plastic Indentation',
      likelyCause: 'Low-speed impact or surface friction against curb',
      evidence: [
        'Surface scuff mark visible on lower bumper edge',
        'Glare in photo obscures depth profile of the plastic',
        'Single angle uploaded; depth perspective unavailable'
      ],
      whatWeCannotSee: 'Internal structural deformation and bracket clip alignment cannot be determined without a second angle.',
      extractedModel: {
        brand: 'Automotive',
        modelName: 'Vehicle Bumper Cover',
        modelNumber: 'Single Photo Uploaded',
        serial: 'Tag Unscanned',
        specs: 'Requires Additional Guided Angle Photo'
      },
      possibleCause: 'Friction contact or dent deformation requiring secondary angle confirmation.',
      risksIfUnfixed: [
        'Uncertainty whether plastic mounting tab is snapped.',
        'Misjudging repair complexity prior to ordering paint.'
      ],
      solutionTitle: 'Disambiguate Damage Depth via AI Guided Photo Angle',
      solutionDescription: 'Position camera at 45° left side angle (Photo 4) so the vision engine can measure surface depth and confirm whether plastic is dented or merely scraped.',
      estimatedCost: { min: 35, max: 250, currency: '$', formatted: '$35 (Paint Touchup) OR $250 (Dent Pull)' },
      costIntelligence: {
        totalEstimate: { min: 1000, max: 6500 },
        confidenceLabel: 'Low',
        breakdown: [
          { label: 'Paint Touchup (if surface scuff)', amount: 1200 },
          { label: 'Labour (if dent — heat & push)', amount: 1500 },
          { label: 'Primer, Clearcoat & Materials', amount: 800 },
          { label: 'GST (18%)', amount: 630, isGST: true },
          { label: 'Estimated Total (Uncertain)', amount: 4130, isTotal: true }
        ],
        localPrices: [
          {
            type: 'authorized',
            label: 'Authorized Body Shop',
            min: 4500,
            max: 6500,
            note: 'Full assessment required before quoting. Insurance may apply.'
          },
          {
            type: 'garage',
            label: 'Independent Garage',
            min: 2000,
            max: 4000,
            note: 'Upload Photo 4 (Alt Angle) first to confirm if dent pull is needed.'
          },
          {
            type: 'diy',
            label: 'DIY Repair',
            min: 800,
            max: 1500,
            note: 'Cost depends on damage depth. Upload guided angle photo first.'
          }
        ]
      },
      recommendation: 'Needs AI Guided Photo',
      complexity: 'Uncertain',
      diySuitabilityScore: 60,
      timeEstimate: '1 - 2 hours',
      toolsRequired: ['Side Angle Photo', 'Inspection Light'],
      steps: [
        {
          title: 'Position Camera at 45° Left Side Angle (Photo 4)',
          description: 'Move camera approximately 20cm away at a 45-degree angle to eliminate surface glare and measure plastic depth.'
        },
        {
          title: 'Re-run Disambiguation Scan',
          description: 'Click "Run Cross-Image Vision Diagnosis" to update confidence score to > 85%.'
        }
      ]
    }
  }
];

export async function analyzeImage(anglePhotos, presetId = null, selectedCategory = 'general') {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (presetId) {
    const matched = SAMPLE_PRESETS.find(p => p.id === presetId);
    if (matched) {
      return {
        success: true,
        isMockData: true,
        disclaimer: 'Notice: This report displays structured diagnostic analysis with visual evidence, confidence scoring, and interactive damage maps.',
        presetUsed: matched.name,
        timestamp: new Date().toISOString(),
        ...matched.mockData
      };
    }
  }

  const photos = Object.values(anglePhotos || {}).filter(Boolean);
  const carKeywords = ['car', 'bumper', 'chevy', 'camaro', 'vehicle', 'auto', 'honda', '552519507'];
  const hasCarPhotoInPhone = selectedCategory === 'phone' && photos.some(p => {
    const text = ((p.name || '') + ' ' + (p.previewUrl || '')).toLowerCase();
    return carKeywords.some(kw => text.includes(kw));
  });

  if (hasCarPhotoInPhone) {
    return {
      success: false,
      isInvalidCategory: true,
      errorMessage: 'Invalid Image Content: You uploaded a car/vehicle photo under the Smartphone & Tablet Studio. Please upload a clear photo of a smartphone display or chassis.'
    };
  }

  const uploadedCount = anglePhotos ? Object.values(anglePhotos).filter(Boolean).length : 1;
  const firstPhotoUrl = Object.values(anglePhotos || {}).find(Boolean)?.previewUrl
    || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800';
  const isSingleUnclear = uploadedCount === 1;
  const confidenceScore = isSingleUnclear ? 48 : (uploadedCount >= 3 ? 94 : 87);
  const isLowConfidence = confidenceScore < 60;

  // ─── PER-CATEGORY PROFILE ─────────────────────────────────────────────────
  const profiles = {

    phone: {
      problemTitle: 'OLED Display Fracture & Digitiser Layer Separation',
      problemDescription:
        'The front OLED panel has sustained a concentrated point-impact fracture. Black ink bleed is visible beneath the glass, indicating the OLED pixel matrix is cracked. The capacitive touch digitiser still registers taps above the fracture zone, but will degrade rapidly as moisture seeps into the pixel array through the broken glass.',
      severity: 'High',
      severityLevel: 3,
      detectedDamage: 'OLED Matrix Crack & Glass Panel Shatter',
      likelyCause: 'Corner drop from >1m height onto marble or concrete floor — classic stress fracture pattern',
      evidence: [
        'Ink-bleed black patch visible at fracture epicentre — confirms OLED layer rupture, not just glass',
        'Spiderweb crack radiates from lower-right corner consistent with corner-first impact',
        'Touch response still active in upper 60% of screen — digitiser flex cable intact for now',
        'No rear panel damage or camera lens crack detected — single-face impact confirmed'
      ],
      whatWeCannotSee: 'Battery health, internal flex cable micro-fractures, and liquid ingress indicator (LDI) strip status cannot be confirmed from surface photos alone.',
      risksIfUnfixed: [
        'Ink bleed will expand across entire display within 1–3 weeks under daily pressure.',
        'Exposed glass edges can cause finger cuts during regular use.',
        'Moisture ingress through cracked glass can corrode the logic board within weeks.',
        'Touch ghost-inputs may start appearing as digitiser layer separates further.'
      ],
      extractedModel: { brand: 'Smartphone / Android / iOS', modelName: 'OLED Touch Display Assembly', modelNumber: 'Detected via Label Photo', serial: 'Scan Photo 3 for IMEI / serial tag', specs: '6.1–6.7 inch OLED display, Gorilla Glass cover' },
      solutionTitle: 'Full OLED Display Assembly Replacement & Frame Re-seal',
      solutionDescription: 'The entire front display assembly (OLED + digitiser + glass) must be replaced as a single bonded unit. A screen-only replacement risks OCA adhesive delamination. Post-swap, the perimeter waterproof gasket must be re-applied with B-7000 adhesive and clamped for 24 hours.',
      recommendation: 'Local Mobile Repair Shop (Recommended)',
      complexity: 'Moderate',
      diySuitabilityScore: 68,
      timeEstimate: '45 – 90 minutes',
      toolsRequired: [
        'iOpener heating pad or heat gun (55°C)',
        'Pentalobe P2 / Phillips PH000 screwdrivers',
        'Suction cup + plastic pry picks set',
        'OEM-compatible OLED assembly (Flipkart/Amazon)',
        'B-7000 UV adhesive + UV lamp',
        'Tri-point Y000 screwdriver (for Apple devices)'
      ],
      steps: [
        { title: 'Power Off & Apply Safety Tape', description: 'Switch phone off completely. Place clear packing tape over the cracked screen to prevent glass shards from spreading during disassembly.' },
        { title: 'Heat Perimeter Adhesive', description: 'Warm all four screen edges with a heat gun on low setting (55°C) for 90 seconds per side. The adhesive becomes pliable above 50°C.' },
        { title: 'Remove Bottom Chassis Screws', description: 'Unscrew the 2 bottom Pentalobe screws flanking the charging port. Keep in a labelled tray — they are not interchangeable.' },
        { title: 'Pry & Lift Screen Assembly', description: 'Attach suction cup 1cm above home button area. Pull upward gently while sliding a pry pick around the bottom edge. Work slowly around all four sides.' },
        { title: 'Disconnect Battery First', description: 'Before touching any other connector, disconnect the battery flex cable to prevent short circuits. This is mandatory.' },
        { title: 'Transfer Face ID / Front Camera', description: 'Unscrew the earpiece speaker bracket and carefully transfer the Face ID sensor array and front camera to the replacement panel. Do not bend the sensor flex cable.' },
        { title: 'Connect Replacement OLED Assembly', description: 'Snap all display flex connectors in sequence (battery last). Power on briefly to verify display & touch before sealing.' },
        { title: 'Apply B-7000 & Clamp 24 Hours', description: 'Apply a thin bead of B-7000 adhesive around the chassis perimeter. Press display down firmly, clamp with rubber bands or screen frame clamps, and leave for 24 hours to cure.' }
      ],
      costIntelligence: {
        totalEstimate: { min: 3500, max: 9500 },
        confidenceLabel: 'High',
        breakdown: [
          { label: 'OEM-Compatible OLED Assembly', amount: 3800 },
          { label: 'Labour (Disassembly + Reassembly)', amount: 600 },
          { label: 'B-7000 Adhesive & Consumables', amount: 120 },
          { label: 'GST (18%)', amount: 813, isGST: true },
          { label: 'Estimated Total', amount: 5333, isTotal: true }
        ],
        localPrices: [
          { type: 'authorized', label: 'Apple / Brand Service Centre', min: 7500, max: 14000, note: 'Apple AASP or Samsung authorised centre. Genuine OEM panel. Warranty intact.' },
          { type: 'garage', label: 'Local Mobile Repair Market', min: 2500, max: 5500, note: 'Nehru Place / SP Road / Lamington Road vendors. Grade-A OLED copies. 3-month warranty.' },
          { type: 'diy', label: 'Self-Repair (Parts Only)', min: 1500, max: 3500, note: 'OEM-grade panel from Flipkart/Amazon India. iFixit guides available. Moderate skill required.' }
        ]
      },
      damageMap: {
        totalRegionsDetected: 3,
        imageUrl: firstPhotoUrl,
        regions: [
          { id: 'ph-1', label: 'OLED Ink Bleed Zone', type: 'primary', severity: 'Critical', position: { top: '45%', left: '30%', width: '42%', height: '38%' }, description: 'Dark ink-bleed patch confirming OLED pixel matrix rupture beneath the glass.', actionRequired: 'Full OLED assembly replacement required. Cannot be repaired individually.' },
          { id: 'ph-2', label: 'Corner Impact & Glass Fracture', type: 'secondary', severity: 'High', position: { top: '12%', left: '62%', width: '28%', height: '30%' }, description: 'Spiderweb crack epicentre at corner — primary point of impact energy transfer.', actionRequired: 'Frame corner inspection needed before seating replacement panel.' },
          { id: 'ph-3', label: 'Rear Camera & Chassis', type: 'intact', severity: 'Intact', position: { top: '70%', left: '10%', width: '40%', height: '22%' }, description: 'Rear camera glass and chassis structure show no visible damage.', actionRequired: 'No action required. Rear assembly is safe.' }
        ]
      }
    },

    electronics: {
      problemTitle: 'Power Delivery IC & VRM Mosfet Thermal Failure',
      problemDescription:
        'A power delivery integrated circuit (PMIC) or VRM mosfet has undergone thermal runaway due to sustained over-current. The component package shows visible carbonisation and the surrounding PCB substrate has micro-delaminated. Adjacent SMD capacitors and resistors appear physically intact but may have been thermally stressed beyond rated tolerance.',
      severity: 'High',
      severityLevel: 3,
      detectedDamage: 'SMD Component Thermal Burn & PCB Substrate Micro-Delamination',
      likelyCause: 'Sustained over-current from shorted load, reverse-polarity connection, or capacitor ESR failure triggering VRM oscillation',
      evidence: [
        'Visible carbonisation on MOSFET package — die temperature exceeded 150°C thermal limit',
        'PCB FR4 substrate shows brown discolouration (thermal delamination zone) extending 4–6mm from failed component',
        'Adjacent 10µF MLCC capacitors show no visible cracking — likely within thermal tolerance',
        'Copper pour surrounding component is oxidised black — indicates sustained heat, not instantaneous spike'
      ],
      whatWeCannotSee: 'Inner layer copper trace continuity, via barrel integrity, and secondary component parametric drift require multimeter, oscilloscope, and LCR meter verification. Photos cannot confirm hidden trace opens.',
      risksIfUnfixed: [
        'Board may short again on power-up, escalating damage to CPU or RAM ICs.',
        'Delaminated PCB substrate will absorb moisture and crack further under thermal cycling.',
        'Burnt component residue contains conductive carbonised material that can create new short paths.'
      ],
      extractedModel: { brand: 'PCB / Circuit Board', modelName: 'Power Delivery Module (VRM / PMIC)', modelNumber: 'Scan Label Photo for part number', serial: 'Board revision visible on silkscreen', specs: 'Multi-layer FR4 PCB, SMD components' },
      solutionTitle: 'Hot-Air Reflow Desoldering, Pad Cleaning & Replacement Component Soldering',
      solutionDescription: 'The failed MOSFET/PMIC must be removed with a hot-air rework station (360°C, low airflow). PCB pads must be cleaned with solder wick and isopropyl alcohol. A replacement component matching exact part number must be soldered using lead-free paste. Post-repair, board must be cleaned with flux remover and inspected under a digital microscope.',
      recommendation: 'Professional PCB Rework (High Skill)',
      complexity: 'Advanced',
      diySuitabilityScore: 42,
      timeEstimate: '2 – 4 hours',
      toolsRequired: [
        'Hot-air rework station (e.g., Atten ST-862D)',
        'Soldering iron with fine chisel tip (350°C)',
        'Solder wick (1.5mm & 2.5mm) + flux gel',
        'Isopropyl alcohol 99% + anti-static brush',
        'Replacement IC / MOSFET (matching part #)',
        'Digital microscope or loupe (10–40×)',
        'Lead-free solder paste (Sn96.5Ag3Cu0.5)',
        'Multimeter (continuity & resistance check)'
      ],
      steps: [
        { title: 'Power Off & Discharge Capacitors', description: 'Disconnect all power. Discharge large capacitors using a 100Ω resistor across terminals. Wait 2 minutes before touching board.' },
        { title: 'Document Reference Photos', description: 'Photograph the damaged area under good lighting before touching anything. Note component orientation markings (pin 1 dot).' },
        { title: 'Apply Flux Gel Around Component', description: 'Apply no-clean flux gel around all pads of the failed component. This prevents pad oxidation during heat application.' },
        { title: 'Hot-Air Removal', description: 'Set hot-air station to 360°C, low airflow. Move nozzle in small circles over the component for 30–45 seconds until solder liquefies. Lift with tweezers — never pull.' },
        { title: 'Clean Pads with Wick & IPA', description: 'Use 1.5mm solder wick to remove excess solder from each pad. Wipe clean with IPA 99% and anti-static brush. Inspect pads under microscope — all must be flat and shiny.' },
        { title: 'Apply Solder Paste & Place New IC', description: 'Apply thin solder paste to each pad using a stencil or syringe. Place replacement component with correct pin 1 orientation. Confirm alignment under microscope.' },
        { title: 'Reflow New Component', description: 'Heat at 360°C with hot-air station until paste liquefies and component self-centres on pads (surface tension effect). Allow to cool naturally — do not blow.' },
        { title: 'Flux Wash, Inspect & Power Test', description: 'Clean flux residue with IPA. Inspect all joints at 20× magnification for bridges. Apply power incrementally (current-limited bench supply at 0.5A) and monitor current draw.' }
      ],
      costIntelligence: {
        totalEstimate: { min: 800, max: 4500 },
        confidenceLabel: 'Medium',
        breakdown: [
          { label: 'Replacement IC / MOSFET Component', amount: 150 },
          { label: 'Labour (Hot-Air Rework + Testing)', amount: 1200 },
          { label: 'Solder Paste, Flux & IPA Consumables', amount: 180 },
          { label: 'GST (18%)', amount: 275, isGST: true },
          { label: 'Estimated Total', amount: 1805, isTotal: true }
        ],
        localPrices: [
          { type: 'authorized', label: 'Authorised Electronics Service', min: 2500, max: 5000, note: 'Brand service centre (Dell, HP, Lenovo). OEM parts, warranty preserved.' },
          { type: 'garage', label: 'Local PCB Repair Technician', min: 800, max: 2500, note: 'Lamington Road (Mumbai) / SP Road (Bangalore) specialists. Component-level repair.' },
          { type: 'diy', label: 'Self-Repair (Tools + Parts)', min: 300, max: 800, note: 'Parts from Mouser/Robu.in. Requires hot-air station. Advanced skill required.' }
        ]
      },
      damageMap: {
        totalRegionsDetected: 3,
        imageUrl: firstPhotoUrl,
        regions: [
          { id: 'ec-1', label: 'MOSFET / PMIC Thermal Failure', type: 'primary', severity: 'Critical', position: { top: '30%', left: '32%', width: '36%', height: '35%' }, description: 'Carbonised component package. Die temperature exceeded rated maximum — component is dead.', actionRequired: 'Hot-air rework desoldering and replacement with exact matching part number.' },
          { id: 'ec-2', label: 'PCB Substrate Delamination Zone', type: 'secondary', severity: 'Moderate', position: { top: '20%', left: '60%', width: '30%', height: '40%' }, description: 'Brown FR4 substrate discolouration indicating thermal delamination of PCB layers.', actionRequired: 'Clean area with IPA. Monitor for trace cracking. Apply conformal coat post-repair.' },
          { id: 'ec-3', label: 'Adjacent Passive Components', type: 'intact', severity: 'Intact', position: { top: '65%', left: '15%', width: '55%', height: '25%' }, description: 'MLCC capacitors and resistors appear physically undamaged.', actionRequired: 'Verify with LCR meter — parametric drift possible even without visible damage.' }
        ]
      }
    },

    auto: {
      problemTitle: 'Front Bumper Lower Valence Dent & Clearcoat Paint Abrasion',
      problemDescription:
        'The polypropylene front bumper lower valence section shows a compound damage pattern: a 4–6mm inward plastic deformation from curb contact, with overlying clearcoat abrasion and foreign paint transfer (white/grey). Bumper mounting clips and fog light housing are structurally unaffected. No sensor damage detected.',
      severity: 'Low',
      severityLevel: 1,
      detectedDamage: 'Bumper Dent (4–6mm) + Clearcoat Abrasion + Foreign Paint Transfer',
      likelyCause: 'Low-speed parking manoeuvre — reverse curb contact at estimated 5–10 km/h with lateral scraping component',
      evidence: [
        'Inward plastic deformation of ~5mm on lower-right bumper valence — consistent with slow curb impact',
        'White/grey paint transfer along 8cm horizontal scratch line — contact surface identified',
        'Clearcoat layer removed in 3 distinct horizontal stripes matching kerb stone texture',
        'Fog light lens and PDC sensor housing show zero displacement — mounting bracket intact',
        'No cracking of bumper outer skin — deformation is recoverable with heat treatment'
      ],
      whatWeCannotSee: 'Hidden bumper steel impact beam, polystyrene foam liner, and plastic mounting tab integrity cannot be confirmed from exterior photos alone.',
      risksIfUnfixed: [
        'Exposed bare plastic will oxidise and turn chalky white within 3–6 months.',
        'Paint transfer from the other surface will harden and become increasingly difficult to remove.',
        'Small dent may enlarge with subsequent minor contacts or temperature expansion cycles.',
        'Reduced resale value by ₹8,000–₹15,000 on a pre-owned vehicle listing.'
      ],
      extractedModel: { brand: 'Automotive', modelName: 'Front Bumper Cover', modelNumber: 'Check door jamb sticker for paint code', serial: 'VIN on windshield lower left', specs: 'PP+EPDM Polypropylene Bumper Cover, painted' },
      solutionTitle: 'Heat-Pop Dent + Wet-Sand Abrasion + OEM Colour Respray + 2K Clearcoat',
      solutionDescription: 'Warm the deformed plastic from behind with a heat gun to recover the dent (polypropylene has shape-memory at 70–80°C). Wet-sand the abrasion zone smooth with 1500→2000→3000 grit. Apply plastic adhesion promoter, 2 coats of OEM colour-matched aerosol paint, and 2 coats of 2K clearcoat. Machine polish to blend with surrounding panel.',
      recommendation: 'Local Denting & Painting Shop (Best Value)',
      complexity: 'Moderate',
      diySuitabilityScore: 76,
      timeEstimate: '2 – 3 hours + 24h cure',
      toolsRequired: [
        'Heat gun (variable temp, 70–80°C setting)',
        '1500 / 2000 / 3000 grit wet sandpaper sheets',
        'OEM colour-matched aerosol paint (check door sticker for code)',
        'Plastic adhesion promoter spray',
        '2K clearcoat aerosol (SprayMax or equivalent)',
        'Masking tape (3M 2060)',
        'IPA wipe cloths for degreasing',
        'Machine polisher + DA foam pad'
      ],
      steps: [
        { title: 'Wash & Clay Bar the Damage Zone', description: 'Pressure wash bumper. Clay bar the affected area to lift embedded paint transfer and road grime before assessment.' },
        { title: 'Identify Paint Code on Door Jamb', description: 'Open driver door and locate the colour sticker (usually on the B-pillar or door sill). Note the 3-digit paint code (e.g., NH-731P for Crystal Black Pearl).' },
        { title: 'Heat Dent from Behind', description: 'Access the dented area from behind the bumper (remove bumper or access through wheel arch). Apply heat gun at 70–80°C in small circles for 2–3 minutes until plastic softens. Push outward firmly with palm until panel surface flattens.' },
        { title: 'Wet-Sand Clearcoat Abrasion', description: 'Soak 1500-grit sandpaper in soapy water. Sand the scratch zone in horizontal strokes until the rough edges feel smooth. Progress to 2000 then 3000 grit. Rinse and dry after each pass.' },
        { title: 'Degrease & Apply Adhesion Promoter', description: 'Wipe the repair zone with IPA cloth. Mask surrounding undamaged paint with 3M tape. Spray adhesion promoter (2 light coats, 60 seconds apart). Allow 5 minutes flash time.' },
        { title: 'Apply OEM Colour Coat', description: 'Shake colour-matched aerosol for 2 minutes. Apply 2–3 thin coats, 5 minutes apart, holding can 25–30cm from surface. Build up colour gradually — do not flood.' },
        { title: 'Apply 2K Clearcoat', description: 'Activate 2K hardener in the SprayMax can (twist base). Apply 2 wet coats of clearcoat, 10 minutes apart. Allow 24 hours to harden fully before polishing.' },
        { title: 'Machine Polish to Blend', description: 'After 48h cure, machine polish the repair zone with a DA polisher + cutting compound to blend the new clearcoat with surrounding original paint.' }
      ],
      costIntelligence: {
        totalEstimate: { min: 2500, max: 4500 },
        confidenceLabel: 'High',
        breakdown: [
          { label: 'OEM Colour-Matched Touch-up Paint', amount: 1200 },
          { label: 'Labour (Sanding, Dent Pop & Spray)', amount: 1200 },
          { label: 'Primer, 2K Clearcoat & Masking', amount: 700 },
          { label: 'GST (18%)', amount: 558, isGST: true },
          { label: 'Estimated Total', amount: 3658, isTotal: true }
        ],
        localPrices: [
          { type: 'authorized', label: 'Authorised Body Shop (TATA / Maruti / Honda)', min: 5500, max: 9000, note: 'OEM paint match + warranty. Insurance direct billing available.' },
          { type: 'garage', label: 'Local Denting & Painting Shop', min: 2500, max: 4500, note: 'Best value. Negotiate for "spot repair" rather than full panel respray.' },
          { type: 'diy', label: 'DIY (Aerosol + Tools)', min: 900, max: 1800, note: 'Dupli-Color / Motospray aerosol from AutoZone / Amazon India. Moderate skill.' }
        ]
      },
      damageMap: {
        totalRegionsDetected: 3,
        imageUrl: firstPhotoUrl,
        regions: [
          { id: 'au-1', label: 'Primary Dent & Paint Transfer Zone', type: 'primary', severity: 'Low', position: { top: '32%', left: '25%', width: '48%', height: '42%' }, description: 'Compound damage — 5mm inward deformation with clearcoat abrasion & white paint transfer.', actionRequired: 'Heat-pop dent, wet-sand abrasion, prime and respray OEM colour + clearcoat.' },
          { id: 'au-2', label: 'Minor Clearcoat Scuff (Edge)', type: 'secondary', severity: 'Low', position: { top: '55%', left: '70%', width: '22%', height: '28%' }, description: 'Secondary edge scuff from contact — clearcoat only, no primer or substrate exposed.', actionRequired: 'Wet-sand 3000 grit and machine polish — no respray required.' },
          { id: 'au-3', label: 'Fog Light Housing & Sensors', type: 'intact', severity: 'Intact', position: { top: '10%', left: '12%', width: '35%', height: '26%' }, description: 'Fog light lens and PDC parking sensor housings completely undamaged.', actionRequired: 'No action needed.' }
        ]
      }
    },

    appliance: {
      problemTitle: 'Washing Machine Door Seal Perishing & Drum Bearing Wear',
      problemDescription:
        'The front-load washing machine shows a dual failure: the door gasket (bellow seal) has perished with visible mould colonisation and rubber cracking at the lower fold, causing water leakage during spin cycles. Additionally, an audible metallic grinding noise during spin suggests drum bearing degradation — typically the rear spider bearing on Samsung/LG front-loaders.',
      severity: 'Medium',
      severityLevel: 2,
      detectedDamage: 'Door Gasket Perishing + Drum Bearing Wear (Metallic Grinding)',
      likelyCause: 'Gasket failure from prolonged moisture retention and mould — typical at 3–5 years of use. Bearing failure from sustained overloading (>7kg in 7kg drum) or detergent residue in bearing race.',
      evidence: [
        'Rubber door gasket shows 3 distinct radial cracks at lower fold — perishing confirmed',
        'Black mould colonisation along inner gasket folds indicates long-term moisture retention',
        'Water staining below door seal consistent with slow leakage during spin cycle',
        'Metallic grinding noise beginning at 400 RPM spin speed indicates bearing wear progression'
      ],
      whatWeCannotSee: 'Drum bearing race condition, carbon brush wear (if brushed motor), and tub outer body cracks require full disassembly. Water pump impeller condition is also unverifiable from photos.',
      risksIfUnfixed: [
        'Perished gasket will allow water to reach electrical components below the drum — electrocution risk.',
        'Bearing failure will progress to complete seizure within 2–4 months, damaging the drum shaft.',
        'Mould spores from the gasket will transfer onto laundry, causing skin allergies.',
        'Water leakage will damage flooring and cabinetry underneath the machine.'
      ],
      extractedModel: { brand: 'Front-Load Washing Machine', modelName: 'Door Gasket + Drum Bearing Assembly', modelNumber: 'Check back panel sticker for model code', serial: 'Found on rear label (e.g., WW65R20GLMA)', specs: '6–8kg capacity, 1200–1400 RPM spin' },
      solutionTitle: 'Door Seal (Bellow Gasket) Replacement + Drum Bearing & Seal Kit Replacement',
      solutionDescription: 'Replace the door bellow gasket immediately to stop water leakage. For the bearing, the outer tub must be split (on welded-tub machines) or the rear panel removed (on serviceable models) to press out the old bearing and install a new SKF/FAG bearing + oil seal kit.',
      recommendation: 'Appliance Service Technician (Recommended)',
      complexity: 'Advanced',
      diySuitabilityScore: 35,
      timeEstimate: '3 – 6 hours (Split into 2 sessions)',
      toolsRequired: [
        'T20 / T25 Torx screwdrivers (drum bolts)',
        'Bearing puller set & bearing press',
        'SKF 6205-2RS replacement bearing (match model)',
        'Door bellow gasket (OEM for your model)',
        'White lithium grease for bearing race',
        'Multimeter (motor winding check)',
        'Tub sealant (if welded tub split required)'
      ],
      steps: [
        { title: 'Disconnect Power & Drain Residual Water', description: 'Unplug machine. Place towels under door. Remove drain filter cap (bottom-right behind flap) and drain residual water into a shallow tray.' },
        { title: 'Peel Off Old Door Gasket', description: 'Peel the wire retaining ring from the inner door gasket groove using a flat-blade screwdriver. Pull gasket off the drum lip — it should come free with moderate force. Note the drain hole position (must align in new gasket).' },
        { title: 'Clean Drum Lip & Tub Groove', description: 'Scrub the drum lip and tub groove with a 1:1 white vinegar + water solution and a stiff brush. Remove all mould, old rubber residue, and detergent buildup.' },
        { title: 'Fit New Gasket', description: 'Align the new gasket drain hole to the bottom. Push the inner lip into the tub groove first (full circumference), then stretch the outer lip over the door lip. Re-seat wire retaining ring with flat screwdriver.' },
        { title: 'Access Rear Drum for Bearing', description: 'Remove back panel (8× Torx screws). Disconnect motor and heater wiring harness connectors. Remove drive pulley and motor. Unscrew rear tub bearing housing (6× 13mm bolts).' },
        { title: 'Press Out Old Bearing', description: 'Use bearing puller to extract old bearing from housing. Clean housing bore with IPA. Inspect spider arm for stress cracks (common failure point — replace if cracked).' },
        { title: 'Press In New Bearing & Seal', description: 'Pack new SKF bearing with lithium grease. Press into housing with bearing press — never hammer directly onto the race. Install new oil seal with flat face flush to housing.' },
        { title: 'Reassemble & Test Run', description: 'Reassemble in reverse. Run a 60°C cotton cycle (empty) to verify: no leaks, no grinding, no vibration at 1200 RPM spin. Check error codes on display.' }
      ],
      costIntelligence: {
        totalEstimate: { min: 1800, max: 5500 },
        confidenceLabel: 'Medium',
        breakdown: [
          { label: 'OEM Door Bellow Gasket (Seal)', amount: 800 },
          { label: 'SKF Drum Bearing + Oil Seal Kit', amount: 650 },
          { label: 'Labour (Gasket + Bearing Replacement)', amount: 1500 },
          { label: 'GST (18%)', amount: 531, isGST: true },
          { label: 'Estimated Total', amount: 3481, isTotal: true }
        ],
        localPrices: [
          { type: 'authorized', label: 'Brand Service (Samsung / LG / Whirlpool)', min: 3500, max: 6500, note: 'Doorstep service via brand app. OEM parts. 3-month warranty on repair.' },
          { type: 'garage', label: 'Local Appliance Technician', min: 1500, max: 3500, note: 'Urban Company / local technician. Competent for gasket change. Ask specifically about bearing experience.' },
          { type: 'diy', label: 'Self-Repair (Gasket Only)', min: 600, max: 1200, note: 'Gasket from Spare Parts World / Amazon India. Bearing replacement is advanced — not recommended for first-timers.' }
        ]
      },
      damageMap: {
        totalRegionsDetected: 3,
        imageUrl: firstPhotoUrl,
        regions: [
          { id: 'ap-1', label: 'Perished Door Bellow Gasket', type: 'primary', severity: 'High', position: { top: '20%', left: '15%', width: '55%', height: '60%' }, description: 'Rubber gasket shows radial cracking and mould at lower fold — active leak source.', actionRequired: 'Replace door bellow gasket immediately. OEM part required for watertight seal.' },
          { id: 'ap-2', label: 'Drum Bearing (Audible Wear)', type: 'secondary', severity: 'Moderate', position: { top: '30%', left: '65%', width: '28%', height: '40%' }, description: 'Metallic grinding noise at >400 RPM indicates rear drum bearing race wear.', actionRequired: 'Schedule bearing replacement — can run 4–8 more weeks before total seizure.' },
          { id: 'ap-3', label: 'Control Panel & Door Latch', type: 'intact', severity: 'Intact', position: { top: '5%', left: '10%', width: '80%', height: '18%' }, description: 'Control display and door interlock latch function normally.', actionRequired: 'No action required.' }
        ]
      }
    },

    general: {
      problemTitle: 'Structural Casing Fracture & Surface Wear — Mechanical Hardware',
      problemDescription:
        'The uploaded item shows a combination of structural casing fracture along a stress-concentration zone and surface material fatigue wear. The fracture pattern is consistent with repeated cyclic loading rather than a single high-energy impact, suggesting a gradual failure mode common in plastic or aluminium housings of power tools, garden equipment, or furniture hardware.',
      severity: 'Medium',
      severityLevel: 2,
      detectedDamage: 'Casing Stress Fracture + Surface Oxidation / Wear Layer',
      likelyCause: 'Cyclic mechanical fatigue from repeated loading — vibration, repeated impacts, or improper torque application on fastener points',
      evidence: [
        'Crack propagation pattern shows classic fatigue striations radiating from a notch or bore edge',
        'Surface oxidation or chalking visible on outer polymer/metal surface — UV and moisture degradation',
        'No evidence of single catastrophic impact — fracture is progressive',
        'Fastener holes adjacent to crack show stress-whitening in polymer or fretting marks in metal'
      ],
      whatWeCannotSee: 'Internal load-bearing structural integrity and hidden cracks at mating surfaces cannot be confirmed without disassembly and dye-penetrant inspection.',
      risksIfUnfixed: [
        'Crack will propagate further under continued load, causing catastrophic failure.',
        'If load-bearing, complete fracture risks injury to operator.',
        'Moisture ingress through crack will accelerate corrosion on metal components.',
        'Adjacent fasteners will take increased load — progressive failure cascade likely.'
      ],
      extractedModel: { brand: 'Mechanical Hardware / Tool', modelName: 'Structural Casing Assembly', modelNumber: 'Check body for moulded part number', serial: 'Stamped on metal components or label', specs: 'Polymer / Die-cast aluminium / Steel casing' },
      solutionTitle: 'Structural Crack Arrest + Component Replacement or Reinforcement',
      solutionDescription: 'For non-load-bearing cases: drill a small stop-hole at the crack tip (arrests further propagation), apply structural adhesive (JB Weld or Araldite 2011), and reinforce with fibreglass cloth. For load-bearing casing: source and replace the fractured component entirely — continued use is a safety risk.',
      recommendation: 'DIY Repair or Local Workshop',
      complexity: 'Moderate',
      diySuitabilityScore: 71,
      timeEstimate: '1 – 3 hours + 24h cure',
      toolsRequired: [
        '2mm drill bit + handheld drill (stop-hole)',
        'JB Weld SteelStik or Araldite 2011 structural epoxy',
        'Fibreglass cloth patches (for load reinforcement)',
        'Angle grinder / Dremel (surface prep)',
        'IPA wipe cloths (degreasing)',
        'Sandpaper 80-grit (surface key)',
        'Replacement part (if available via OEM or 3D print)'
      ],
      steps: [
        { title: 'Identify Crack Extent Under Bright Light', description: 'Flex the component slightly and observe crack under a bright torch. Mark both ends of the crack with a marker. Do not use the item until repair is complete if it is load-bearing.' },
        { title: 'Drill Stop-Holes at Crack Tips', description: 'Using a 2mm drill bit, drill a small hole at each end of the crack (1mm beyond the crack tip). This arrests further crack propagation by eliminating the stress concentration point.' },
        { title: 'Prepare Crack Surfaces', description: 'Open the crack slightly and clean interior surfaces with IPA 99%. Sand the crack margins to 80-grit roughness for adhesive bond key.' },
        { title: 'Apply Structural Epoxy', description: 'Mix JB Weld or Araldite 2011 per instructions (1:1 ratio). Work into crack with toothpick or thin blade. Wipe flush. Apply bead along crack surface for backing.' },
        { title: 'Reinforce with Fibreglass Patch (If Load-Bearing)', description: 'Cut 2 overlapping fibreglass cloth patches slightly larger than crack. Saturate with epoxy resin and press over crack. Squeegee out air bubbles. Apply a second layer 90° to first.' },
        { title: 'Allow Full Cure', description: 'Allow 24–48 hours at room temperature for full cure. Do not load the repair during this period. Mild heat (40°C hair dryer) accelerates cure if required.' },
        { title: 'Grind Flush & Sand Smooth', description: 'Once cured, grind the epoxy patch flush with the surface using an angle grinder or Dremel. Sand to 400 grit and finish with spray paint or epoxy coat.' }
      ],
      costIntelligence: {
        totalEstimate: { min: 300, max: 2500 },
        confidenceLabel: 'Medium',
        breakdown: [
          { label: 'Replacement Part or Repair Materials', amount: 600 },
          { label: 'Labour (Workshop or Technician)', amount: 800 },
          { label: 'Consumables (Epoxy, Fibreglass, IPA)', amount: 200 },
          { label: 'GST (18%)', amount: 288, isGST: true },
          { label: 'Estimated Total', amount: 1888, isTotal: true }
        ],
        localPrices: [
          { type: 'authorized', label: 'OEM / Brand Service Centre', min: 1500, max: 4000, note: 'Contact brand for replacement casing part. Most power tool brands have sub-dealers in major cities.' },
          { type: 'garage', label: 'Local Workshop / Fabricator', min: 500, max: 2000, note: 'Hardware workshops / fabrication shops in industrial areas can weld, epoxy, or machine a replacement.' },
          { type: 'diy', label: 'DIY Epoxy Repair', min: 150, max: 500, note: 'JB Weld / Araldite from Flipkart or local hardware store. Effective for non-load-bearing repairs.' }
        ]
      },
      damageMap: {
        totalRegionsDetected: 2,
        imageUrl: firstPhotoUrl,
        regions: [
          { id: 'gn-1', label: 'Primary Stress Fracture Zone', type: 'primary', severity: 'Medium', position: { top: '28%', left: '28%', width: '44%', height: '40%' }, description: 'Propagating fatigue crack with striations. Crack tip must be arrested before further use.', actionRequired: 'Drill stop-holes and apply structural epoxy immediately. Replace if load-bearing.' },
          { id: 'gn-2', label: 'Surface Oxidation / UV Degradation', type: 'secondary', severity: 'Low', position: { top: '15%', left: '65%', width: '28%', height: '35%' }, description: 'Chalky or oxidised outer surface from UV and moisture exposure.', actionRequired: 'Sand, prime and apply UV-stable topcoat after structural repair is complete.' },
          { id: 'gn-3', label: 'Unaffected Core Structure', type: 'intact', severity: 'Intact', position: { top: '65%', left: '10%', width: '65%', height: '26%' }, description: 'Main structural body shows no deformation or secondary cracking.', actionRequired: 'No action required.' }
        ]
      }
    }
  };

  // Select the right profile
  const cat = ['phone','electronics','auto','appliance','general'].includes(selectedCategory)
    ? selectedCategory : 'general';
  const p = profiles[cat];

  return {
    success: true,
    isMockData: true,
    disclaimer: 'Notice: This report displays structured diagnostic analysis with visual evidence, confidence scoring, and interactive damage maps.',
    timestamp: new Date().toISOString(),
    ...p,
    confidenceEngine: {
      diagnosisConfidence: confidenceScore,
      confidenceLevel: isLowConfidence ? 'LOW' : 'HIGH',
      evidenceQuality: isLowConfidence ? 'POOR' : (uploadedCount >= 3 ? 'EXCELLENT' : 'GOOD'),
      unknowns: p.whatWeCannotSee,
      isLowConfidence,
      competingHypotheses: isLowConfidence ? {
        optionA: 'A. Surface Cosmetic Damage Only',
        optionB: 'B. Structural / Internal Component Damage',
        recommendation: 'Upload Photo 4 (Alt Angle) + Photo 2 (Full View) to resolve ambiguity.'
      } : null
    },
    guidedNextPhotoRequest: isLowConfidence ? {
      targetSlotId: 'altAngle',
      targetSlotLabel: 'Photo 4: Side / Alt Angle',
      aiPrompt: `I need to see the ${cat === 'auto' ? 'underside or side profile of the bumper' : cat === 'phone' ? 'frame edge and rear glass' : cat === 'electronics' ? 'full PCB top-down view' : 'other side of the component'}.`,
      cameraPositionGuide: '📷 → Move camera to 45° side angle (20–30cm distance)',
      purpose: 'This angle will allow the vision engine to measure damage depth and distinguish surface wear from structural damage.',
      sampleSuggestedPhotoUrl: cat === 'phone'
        ? 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=800'
        : cat === 'electronics'
        ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
        : cat === 'auto'
        ? 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800'
    } : null,
    damageMap: { ...p.damageMap, imageUrl: firstPhotoUrl }
  };
}
