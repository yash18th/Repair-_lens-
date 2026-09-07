const CATEGORIES = ['Smartphone & Tablet', 'Electronics & PCB', 'Home Appliance', 'Computers & Laptops', 'Vehicles', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const COMPLEXITIES = ['Low', 'Medium', 'High', 'Very High'];

function toGeminiImagePart(dataUrl) {
  const match = /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/i.exec(dataUrl || '');
  if (!match) throw new Error('Each image must be a supported base64-encoded image (PNG, JPEG, or WEBP).');
  return { inlineData: { mimeType: match[1].toLowerCase(), data: match[2] } };
}

function responseText(payload) {
  return payload.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
}

// Stage 14: Server-Side Validation Functions
export function validateImageClassification(pass1) {
  if (!pass1.is_usable || pass1.image_quality !== 'usable') {
    return {
      valid: false,
      status: 'invalid_image',
      reason: pass1.rejection_reason || `Image quality is ${pass1.image_quality || 'unclear'} and cannot support a reliable diagnosis.`
    };
  }
  return { valid: true };
}

export function validateCategoryMatch(pass1, selectedCategory) {
  const normCat = String(selectedCategory || '').toLowerCase();
  const detected = String(pass1.detected_object || '').toLowerCase();
  const desc = String(pass1.object_description || '').toLowerCase();

  const validMappings = {
    phone: ['smartphone', 'tablet', 'mobile phone', 'phone', 'cell phone', 'iphone', 'android', 'handset', 'mobile', 'screen', 'display'],
    computer: ['laptop', 'desktop/computer', 'computer', 'pc', 'monitor', 'macbook', 'desktop'],
    electronics: ['pcb/electronic board', 'circuit board', 'pcb', 'electronics', 'circuit', 'board', 'motherboard'],
    appliance: ['home appliance', 'appliance', 'microwave', 'refrigerator', 'washing machine'],
    vehicles: ['vehicle', 'car', 'automobile', 'bike', 'motorcycle', 'truck', 'van', 'auto'],
    other: ['smartphone', 'tablet', 'laptop', 'desktop/computer', 'pcb/electronic board', 'home appliance', 'vehicle', 'other', 'electronic', 'device', 'hardware']
  };

  let categoryKey = 'phone';
  if (normCat.includes('phone') || normCat.includes('tablet')) categoryKey = 'phone';
  else if (normCat.includes('computer') || normCat.includes('laptop')) categoryKey = 'computer';
  else if (normCat.includes('electronic') || normCat.includes('pcb')) categoryKey = 'electronics';
  else if (normCat.includes('appliance')) categoryKey = 'appliance';
  else if (normCat.includes('vehicle') || normCat.includes('auto')) categoryKey = 'vehicles';
  else categoryKey = 'other';

  const allowedObjects = validMappings[categoryKey] || [];
  const matches = allowedObjects.some(obj => detected.includes(obj) || desc.includes(obj));

  // Reject clearly unrelated non-device objects unconditionally
  const unrelatedObjects = ['person', 'human', 'face', 'clothing', 'food', 'animal', 'dog', 'cat', 'plant', 'tree', 'landscape', 'mountain', 'sky', 'building', 'street', 'road'];
  const isClearlyUnrelated = unrelatedObjects.some(unrelated => detected.includes(unrelated)) && !allowedObjects.some(obj => detected.includes(obj));

  if (isClearlyUnrelated || (!matches && pass1.category_match === false)) {
    return {
      valid: false,
      status: 'invalid_image',
      reason: pass1.rejection_reason || `The uploaded image shows ${pass1.object_description || pass1.detected_object || 'an unrelated object'} and does not match the selected category (${selectedCategory}).`
    };
  }

  if (!matches) {
    return {
      valid: false,
      status: 'invalid_image',
      reason: pass1.rejection_reason || `The uploaded image shows ${pass1.object_description || pass1.detected_object || 'an unrecognized object'} and does not match the selected category (${selectedCategory}).`
    };
  }

  return { valid: true };
}

export function validateConfidence(pass1, pass2 = null) {
  // Stage 8: Confidence Thresholds
  if ((pass1.object_confidence || 0) < 70) {
    return {
      valid: false,
      status: 'insufficient_evidence',
      reason: 'Visual evidence is too weak to identify the device with certainty.'
    };
  }
  if ((pass1.category_match_confidence || 0) < 80) {
    return {
      valid: false,
      status: 'invalid_image',
      reason: 'Image content does not match the required category with sufficient confidence.'
    };
  }
  if (pass2 && (pass2.damage_confidence || 0) < 70 && pass2.status === 'valid') {
    return {
      valid: false,
      status: 'insufficient_evidence',
      reason: 'Physical defect cannot be confirmed with high confidence from the provided visual evidence.'
    };
  }
  return { valid: true };
}

export function validateDiagnosisEvidence(pass2) {
  // Stage 6: Evidence Requirement
  if (pass2.status === 'valid') {
    if (!Array.isArray(pass2.visible_evidence) || pass2.visible_evidence.length === 0) {
      return {
        valid: false,
        status: 'insufficient_evidence',
        reason: 'No concrete visual evidence was found in the image to substantiate physical damage.'
      };
    }
  }
  return { valid: true };
}

export function validateDiagnosisConsistency(pass1, pass2) {
  // Stage 4 & 5: Device localization and consistency
  const elements = (pass1.visible_device_elements || []).map(e => String(e).toLowerCase());
  const issue = (pass2.issue || '').toLowerCase();

  // If pass2 claims front screen damage, but pass1 explicitly confirmed only rear panel or no screen visible
  if (issue.includes('screen') && elements.length > 0) {
    const hasScreenElement = elements.some(e => e.includes('screen') || e.includes('display') || e.includes('front'));
    const isOnlyRear = elements.some(e => e.includes('back') || e.includes('rear')) && !hasScreenElement;
    if (isOnlyRear) {
      return {
        valid: false,
        status: 'insufficient_evidence',
        reason: 'The image shows only the rear panel. Front display damage cannot be diagnosed from this angle.'
      };
    }
  }
  return { valid: true };
}

let cachedDiscoveredEndpoints = null;

async function getAvailableGeminiEndpoints(apiKey, signal) {
  if (cachedDiscoveredEndpoints && cachedDiscoveredEndpoints.length > 0) {
    return cachedDiscoveredEndpoints;
  }

  const versions = ['v1beta', 'v1'];
  for (const ver of versions) {
    try {
      const url = `https://generativelanguage.googleapis.com/${ver}/models?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        signal
      });

      if (res.ok) {
        const data = await res.json();
        const available = (data.models || [])
          .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
          .map(m => ({
            version: ver,
            name: m.name.replace(/^models\//, '')
          }));

        if (available.length > 0) {
          console.log(`[DiagnosisAI] Discovered ${available.length} models supporting generateContent on ${ver}:`, available.map(m => m.name));
          cachedDiscoveredEndpoints = available;
          return cachedDiscoveredEndpoints;
        }
      } else {
        const txt = await res.text();
        console.warn(`[DiagnosisAI] ListModels on ${ver} returned ${res.status}:`, txt.slice(0, 150));
      }
    } catch (err) {
      console.warn(`[DiagnosisAI] ListModels exception on ${ver}:`, err.message);
    }
  }

  return [];
}

export const PASS1_SCHEMA = {
  type: 'OBJECT',
  properties: {
    image_quality: {
      type: 'STRING',
      enum: ['usable', 'blurry', 'too_dark', 'too_bright', 'obstructed', 'too_small', 'unclear', 'no_relevant_object', 'invalid']
    },
    is_usable: { type: 'BOOLEAN' },
    detected_object: { type: 'STRING' },
    object_description: { type: 'STRING' },
    object_confidence: { type: 'INTEGER' },
    category_match: { type: 'BOOLEAN' },
    category_match_confidence: { type: 'INTEGER' },
    valid_for_diagnosis: { type: 'BOOLEAN' },
    rejection_reason: { type: 'STRING' },
    suggested_action: { type: 'STRING' },
    visible_device_elements: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    }
  },
  required: [
    'image_quality',
    'is_usable',
    'detected_object',
    'object_confidence',
    'category_match',
    'valid_for_diagnosis'
  ]
};

export const PASS2_SCHEMA = {
  type: 'OBJECT',
  properties: {
    valid_for_diagnosis: { type: 'BOOLEAN' },
    status: {
      type: 'STRING',
      enum: ['valid', 'no_visible_damage', 'insufficient_evidence']
    },
    selected_category: { type: 'STRING' },
    detected_object: { type: 'STRING' },
    object_confidence: { type: 'INTEGER' },
    category_match_confidence: { type: 'INTEGER' },
    damage_confidence: { type: 'INTEGER' },
    rejection_reason: { type: 'STRING' },
    issue: { type: 'STRING' },
    summary: { type: 'STRING' },
    detailed_explanation: { type: 'STRING' },
    visible_evidence: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    affected_components: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    severity: {
      type: 'STRING',
      enum: ['Low', 'Medium', 'High', 'Critical', 'low', 'medium', 'high', 'critical', 'unknown']
    },
    urgency: { type: 'STRING' },
    likely_causes: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    recommended_solution: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    estimated_repair_cost: {
      type: 'OBJECT',
      properties: {
        min: { type: 'NUMBER' },
        max: { type: 'NUMBER' },
        currency: { type: 'STRING' },
        basis: { type: 'STRING' }
      }
    },
    safety_notes: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    additional_checks: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    repair_complexity: {
      type: 'STRING',
      enum: ['Low', 'Medium', 'High', 'Very High']
    },
    estimated_duration: { type: 'STRING' },
    repair_blueprint: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' }
        }
      }
    },
    damage_regions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          label: { type: 'STRING' },
          description: { type: 'STRING' },
          confidence: { type: 'INTEGER' },
          box: {
            type: 'OBJECT',
            properties: {
              x: { type: 'NUMBER' },
              y: { type: 'NUMBER' },
              width: { type: 'NUMBER' },
              height: { type: 'NUMBER' }
            }
          }
        }
      }
    }
  },
  required: [
    'valid_for_diagnosis',
    'status',
    'detected_object',
    'damage_confidence',
    'issue',
    'summary',
    'visible_evidence',
    'affected_components',
    'severity',
    'recommended_solution'
  ]
};

export function parseGeminiDiagnosisResponse(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return { success: false, error: 'Empty response from model' };
  }

  let text = rawText.trim();

  // 1. Strip markdown code fence block if present
  const codeBlockMatch = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(text);
  if (codeBlockMatch) {
    text = codeBlockMatch[1].trim();
  }

  // 2. Direct JSON.parse attempt
  try {
    const data = JSON.parse(text);
    if (data && typeof data === 'object') {
      return { success: true, data };
    }
  } catch (_) {
    // Continue to substring extraction
  }

  // 3. Extract JSON object between first '{' and last '}'
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonSubstring = text.slice(firstBrace, lastBrace + 1);
    try {
      const data = JSON.parse(jsonSubstring);
      if (data && typeof data === 'object') {
        return { success: true, data };
      }
    } catch (_) {
      // 4. Clean common trailing commas or smart quotes
      const cleaned = jsonSubstring
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2018\u2019]/g, "'");

      try {
        const data = JSON.parse(cleaned);
        if (data && typeof data === 'object') {
          return { success: true, data };
        }
      } catch (_) {
        // Fall through
      }
    }
  }

  return { success: false, error: 'Could not extract valid JSON from response' };
}

async function callGemini(parts, systemInstruction, signal, schema = null, scanTraceId = 'anonymous') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the backend.');
  }

  // 1. Try to discover supported models directly from Google's ModelService.ListModels
  const discovered = await getAvailableGeminiEndpoints(apiKey, signal);

  // 2. High-priority candidate endpoints
  const standardCandidates = [
    { version: 'v1beta', name: 'gemini-1.5-flash' },
    { version: 'v1', name: 'gemini-1.5-flash' },
    { version: 'v1beta', name: 'gemini-1.5-flash-latest' },
    { version: 'v1beta', name: 'gemini-2.0-flash' },
    { version: 'v1beta', name: 'gemini-1.5-pro' },
    { version: 'v1', name: 'gemini-1.5-pro' }
  ];

  const envModel = process.env.GEMINI_VISION_MODEL?.replace(/^models\//, '');
  const prioritized = [];
  if (envModel && !envModel.includes('2.5')) {
    prioritized.push({ version: 'v1beta', name: envModel }, { version: 'v1', name: envModel });
  }

  // Order: Prioritized env model -> Discovered models from Google -> Standard fallback candidates
  const allEndpoints = [...prioritized, ...discovered, ...standardCandidates];

  const seen = new Set();
  const endpointsToTry = [];
  for (const ep of allEndpoints) {
    const key = `${ep.version}:${ep.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      endpointsToTry.push(ep);
    }
  }

  let lastError = null;
  for (const { version, name } of endpointsToTry) {
    const cleanModel = name.replace(/^models\//, '');
    const url = `https://generativelanguage.googleapis.com/${version}/models/${encodeURIComponent(cleanModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const generationConfig = {
      responseMimeType: 'application/json',
      temperature: 0.1
    };

    // Attach strict response schema on v1beta endpoints
    if (schema && version === 'v1beta') {
      generationConfig.responseSchema = schema;
    }

    const body = {
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ],
      generationConfig
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    try {
      console.log(`[DiagnosisAI][${scanTraceId}] Requesting ${version}/${cleanModel} (schema: ${Boolean(generationConfig.responseSchema)})`);
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(body),
        signal
      });

      // If endpoint rejects responseSchema (e.g. 400 schema error), retry without responseSchema
      if (!response.ok && response.status === 400 && generationConfig.responseSchema) {
        const errorPreview = await response.text();
        if (errorPreview.includes('responseSchema') || errorPreview.includes('unknown field') || errorPreview.includes('schema')) {
          console.warn(`[DiagnosisAI][${scanTraceId}] ${version}/${cleanModel} rejected responseSchema, retrying without schema...`);
          delete body.generationConfig.responseSchema;
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey
            },
            body: JSON.stringify(body),
            signal
          });
        }
      }

      if (response.ok) {
        console.log(`[DiagnosisAI][${scanTraceId}] ${version}/${cleanModel} responded 200 OK`);
        return await response.json();
      }

      const errorText = await response.text();
      lastError = new Error(`Gemini API (${version}/${cleanModel}) error (${response.status}): ${errorText.slice(0, 300)}`);
      console.warn(`[DiagnosisAI][${scanTraceId}] ${version}/${cleanModel} failed with status ${response.status}:`, errorText.slice(0, 150));

      if (response.status === 404 || response.status === 429 || response.status === 503) {
        continue;
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      lastError = err;
      console.warn(`[DiagnosisAI][${scanTraceId}] ${version}/${cleanModel} fetch exception:`, err.message);
    }
  }

  throw lastError || new Error('All Gemini vision models failed to respond.');
}

export async function analyzeUploadedImages({ images, category = 'Smartphone & Tablet', userDescription = '', deviceBrand = '', deviceModel = '' }) {
  if (!Array.isArray(images) || !images.length) {
    const error = new Error('At least one readable image is required.');
    error.statusCode = 400;
    throw error;
  }

  const scanTraceId = `trace_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  console.log(`[DiagnosisAI][${scanTraceId}] Beginning AI diagnosis for category "${category}" with ${images.length} image(s)`);

  // If GEMINI_API_KEY is missing, refuse to generate fake diagnoses!
  if (!process.env.GEMINI_API_KEY) {
    console.warn(`[DiagnosisAI][${scanTraceId}] GEMINI_API_KEY is not configured on the backend.`);
    return {
      valid_for_diagnosis: false,
      status: 'provider_error',
      detected_object: 'unknown',
      object_confidence: 0,
      selected_category: category,
      category_match: false,
      category_match_confidence: 0,
      rejection_reason: 'AI vision inference is not configured on the server (GEMINI_API_KEY missing). Cannot perform visual damage inspection without API credentials.',
      suggested_action: 'Please set GEMINI_API_KEY in the backend environment variables.',
      visible_evidence: []
    };
  }

  const imageParts = images.map(img => toGeminiImagePart(img.dataUrl));

  // =========================================================================
  // PASS 1: STAGE 1-4 GATEKEEPER (Usability, Object & Category Identification)
  // =========================================================================
  const pass1SystemInstruction = `You are RepairLens Stage 1 Gatekeeper: Visual Image Quality, Usability & Object Classification.
Your critical job is to inspect the uploaded image(s) with clinical objectivity.

Selected Category: "${category}".
Claimed Brand/Model: "${deviceBrand || 'none'} / ${deviceModel || 'none'}".
User Notes: "${userDescription || 'none'}".

Determine:
1. "image_quality": One of ["usable", "blurry", "too_dark", "too_bright", "obstructed", "too_small", "unclear", "no_relevant_object", "invalid"].
   - "usable": The photograph clarity/resolution is sufficient to inspect the hardware (even if the phone/hardware is cracked, broken, glitching, or has lines!).
2. "is_usable": boolean (true if image resolution/lighting allows inspection. A damaged, cracked, or glitching screen phone IS usable for inspection!).
3. "detected_object": One of ["smartphone", "tablet", "laptop", "desktop/computer", "PCB/electronic board", "home appliance", "vehicle", "person", "clothing", "food", "animal", "landscape", "other", "unknown"].
   - If any phone, iPhone, Android, or mobile screen is in the photo (working or broken, displaying vertical or horizontal lines, color bars, or cracked), set detected_object to "smartphone" or "tablet".
4. "object_description": Concise description of what is actually visible in the photo.
5. "object_confidence": Integer from 0 to 100 representing confidence in object identification.
6. "category_match": boolean (true if detected_object matches the selected category:
   - "Smartphone & Tablet" matches smartphone or tablet.
   - "Computers & Laptops" matches laptop or desktop/computer.
   - "Electronics & PCB" matches PCB/electronic board.
   - "Home Appliance" matches home appliance.
   - "Vehicles" matches vehicle.
   - "Other" matches any repairable hardware).
7. "category_match_confidence": Integer from 0 to 100.
8. "valid_for_diagnosis": boolean (true if a device matching the category is visible in the photo, even if damaged, cracked, or glitching! Set to false ONLY if the image shows an unrelated object like a person, clothes, food, landscape, animal, or if the photo is so blurry nothing can be seen).
9. "rejection_reason": string or null (null if valid).
10. "suggested_action": string or null.
11. "visible_device_elements": Array of visible component parts (e.g. ["screen", "display", "frame", "bezel"]).

CRITICAL RULES:
- A damaged, cracked, shattered, lines-on-screen, glitching, or broken phone IS 100% VALID FOR DIAGNOSIS! Set valid_for_diagnosis = true, is_usable = true, and category_match = true!
- REJECT (valid_for_diagnosis = false, category_match = false) ONLY when the photo depicts a person, outdoor scene, food, clothing, animal, or completely unrelated non-device content.`;

  const pass1UserPrompt = `Inspect the attached image(s) for Stage 1 Verification. Return ONLY JSON matching the gatekeeper schema without markdown or text outside JSON.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000);

  let pass1Result = null;
  let pass1Error = null;

  // Maximum one controlled retry if response parsing fails
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const pass1Payload = await callGemini(
        [{ text: pass1UserPrompt }, ...imageParts],
        pass1SystemInstruction,
        controller.signal,
        PASS1_SCHEMA,
        scanTraceId
      );
      const rawText = responseText(pass1Payload);
      const parseResult = parseGeminiDiagnosisResponse(rawText);

      if (parseResult.success) {
        pass1Result = parseResult.data;
        console.log(`[DiagnosisAI][${scanTraceId}] Pass 1 parsed successfully on attempt ${attempt + 1}`);
        break;
      } else {
        console.warn(`[DiagnosisAI][${scanTraceId}] Pass 1 parse failed on attempt ${attempt + 1}: ${parseResult.error}. Snippet: ${rawText.slice(0, 100)}`);
        pass1Error = new Error(parseResult.error);
      }
    } catch (err) {
      console.warn(`[DiagnosisAI][${scanTraceId}] Pass 1 attempt ${attempt + 1} exception:`, err.message);
      pass1Error = err;
      if (err.message && (err.message.includes('429') || err.message.includes('503') || err.message.includes('quota') || err.message.includes('rate limit'))) {
        clearTimeout(timeoutId);
        return {
          valid_for_diagnosis: false,
          status: 'provider_error',
          detected_object: 'unknown',
          object_confidence: 0,
          selected_category: category,
          category_match: false,
          category_match_confidence: 0,
          rejection_reason: 'AI diagnostic service is temporarily busy or rate limited. Please try again in a few moments.',
          suggested_action: 'Please wait a moment and click Retry Diagnosis.',
          visible_evidence: []
        };
      }
    }
  }

  if (!pass1Result) {
    clearTimeout(timeoutId);
    console.error(`[DiagnosisAI][${scanTraceId}] Pass 1 failed all attempts:`, pass1Error?.message);
    const isProviderFailure = pass1Error && (pass1Error.message?.includes('429') || pass1Error.message?.includes('503') || pass1Error.message?.includes('failed to respond'));
    return {
      valid_for_diagnosis: false,
      status: isProviderFailure ? 'provider_error' : 'analysis_error',
      detected_object: 'unknown',
      object_confidence: 0,
      selected_category: category,
      category_match: false,
      category_match_confidence: 0,
      rejection_reason: isProviderFailure
        ? 'AI service is temporarily unavailable. Please try again.'
        : 'The vision model returned an invalid response format. Please retry the diagnosis.',
      suggested_action: 'Please click Retry Diagnosis to re-analyze your image.',
      visible_evidence: []
    };
  }

  console.log(`[DiagnosisAI][${scanTraceId}] Pass 1 Gatekeeper Result:`, {
    quality: pass1Result.image_quality,
    object: pass1Result.detected_object,
    conf: pass1Result.object_confidence,
    match: pass1Result.category_match,
    valid: pass1Result.valid_for_diagnosis
  });

  // Stage 14: Server-Side Validation on Pass 1
  const qCheck = validateImageClassification(pass1Result);
  if (!qCheck.valid) {
    clearTimeout(timeoutId);
    return {
      valid_for_diagnosis: false,
      status: 'insufficient_evidence',
      detected_object: pass1Result.detected_object || 'unusable_image',
      object_confidence: pass1Result.object_confidence || 0,
      selected_category: category,
      category_match: false,
      category_match_confidence: 0,
      rejection_reason: qCheck.reason,
      suggested_action: 'Please upload a sharp, well-lit image centered on the damaged component.'
    };
  }

  const matchCheck = validateCategoryMatch(pass1Result, category);
  if (!matchCheck.valid) {
    clearTimeout(timeoutId);
    return {
      valid_for_diagnosis: false,
      status: 'invalid_image',
      detected_object: pass1Result.detected_object || 'unknown',
      object_confidence: pass1Result.object_confidence || 0,
      selected_category: category,
      category_match: false,
      category_match_confidence: pass1Result.category_match_confidence || 0,
      rejection_reason: matchCheck.reason,
      suggested_action: pass1Result.suggested_action || `Please upload a clear photo of your ${category}.`
    };
  }

  const confCheck = validateConfidence(pass1Result);
  if (!confCheck.valid) {
    clearTimeout(timeoutId);
    return {
      valid_for_diagnosis: false,
      status: confCheck.status,
      detected_object: pass1Result.detected_object || 'unknown',
      object_confidence: pass1Result.object_confidence || 0,
      selected_category: category,
      category_match: false,
      category_match_confidence: pass1Result.category_match_confidence || 0,
      rejection_reason: confCheck.reason,
      suggested_action: 'Please take a closer, higher-resolution photo centered on the device.'
    };
  }

  // If Pass 1 explicitly determined not valid:
  if (!pass1Result.valid_for_diagnosis) {
    clearTimeout(timeoutId);
    return {
      valid_for_diagnosis: false,
      status: 'invalid_image',
      detected_object: pass1Result.detected_object || 'unknown',
      object_confidence: pass1Result.object_confidence || 0,
      selected_category: category,
      category_match: false,
      category_match_confidence: pass1Result.category_match_confidence || 0,
      rejection_reason: pass1Result.rejection_reason || 'The uploaded image does not contain the selected device category.',
      suggested_action: pass1Result.suggested_action || `Upload a clear photo of the ${category} you want to diagnose.`
    };
  }

  // =========================================================================
  // PASS 2: STAGE 5-11 CLINICAL DAMAGE INSPECTION (Only if Pass 1 Passed!)
  // =========================================================================
  const pass2SystemInstruction = `You are RepairLens Stage 2 Clinical Damage Inspector.
The image has PASSED initial category verification.
Confirmed Object: "${pass1Result.detected_object}" (${pass1Result.object_description}).
Selected Category: "${category}".
Visible Elements: ${JSON.stringify(pass1Result.visible_device_elements || [])}.

Perform a clinical, evidence-based damage inspection of the image:
1. Examine what is visibly present. Do NOT assume damage exists.
2. If the device/component is intact with NO visible cracks, breaks, dents, burns, or defect:
   - Set "status": "no_visible_damage"
   - Set "issue": "No visible physical damage detected"
   - Set "summary": "The ${pass1Result.detected_object} is clearly visible and its exterior appears intact based on the provided photo(s)."
   - Set "damage_confidence": 95
   - Set "visible_evidence": ["Intact surface without visible fractures", "Uniform panel reflections without cracks"]
   - Set "affected_components": []
   - Set "severity": "Low"
   - Set "urgency": "None - Device Intact"
   - Set "likely_causes": []
   - Set "risks_if_unfixed": []
   - Set "recommended_solution": ["No immediate repair required. Perform internal diagnostic if experiencing software or battery symptoms."]
   - Set "repair_complexity": "Low"
   - Set "estimated_duration": "0 minutes"
   - Set "repair_blueprint": []
   - Set "damage_regions": []
3. If physical damage or hardware malfunction IS visibly observed:
   - Detail the exact observed issue:
     * If the screen has visible vertical lines, horizontal lines, color bars, or visual glitches, diagnose "Display abnormality detected" or "Display panel defect / line artifacts".
     * If the outer glass is intact without impact fractures, DO NOT claim "shattered screen" or "cracked glass"; note that outer glass is physically intact while display panel produces line artifacts!
     * If outer glass has cracks, describe the crack pattern (e.g. hairline crack, spiderweb fracture).
     * Distinguish carefully between outer glass, OLED/LCD matrix, frame, and back panel.
     * Every positive damage finding MUST cite explicit visual evidence directly from the image.
   - Set "status": "valid"
   - Set "damage_confidence": Integer 0-100 based on visible clarity.
   - Set "severity": One of ["Low", "Medium", "High", "Critical"].
   - Provide realistic "estimated_repair_cost" with min, max, and currency ("INR").

Return ONLY a valid JSON object matching the requested schema without markdown or text outside JSON.`;

  const pass2UserPrompt = `Perform Stage 2 clinical damage inspection on the verified image(s). Return ONLY valid JSON matching the schema.`;

  let pass2Result = null;
  let pass2Error = null;

  // Maximum one controlled retry if response parsing fails
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const pass2Payload = await callGemini(
        [{ text: pass2UserPrompt }, ...imageParts],
        pass2SystemInstruction,
        controller.signal,
        PASS2_SCHEMA,
        scanTraceId
      );
      const rawText = responseText(pass2Payload);
      const parseResult = parseGeminiDiagnosisResponse(rawText);

      if (parseResult.success) {
        pass2Result = parseResult.data;
        console.log(`[DiagnosisAI][${scanTraceId}] Pass 2 parsed successfully on attempt ${attempt + 1}`);
        break;
      } else {
        console.warn(`[DiagnosisAI][${scanTraceId}] Pass 2 parse failed on attempt ${attempt + 1}: ${parseResult.error}. Snippet: ${rawText.slice(0, 100)}`);
        pass2Error = new Error(parseResult.error);
      }
    } catch (err) {
      console.warn(`[DiagnosisAI][${scanTraceId}] Pass 2 attempt ${attempt + 1} exception:`, err.message);
      pass2Error = err;
      if (err.message && (err.message.includes('429') || err.message.includes('503') || err.message.includes('quota') || err.message.includes('rate limit'))) {
        clearTimeout(timeoutId);
        return {
          valid_for_diagnosis: false,
          status: 'provider_error',
          detected_object: pass1Result.detected_object,
          object_confidence: pass1Result.object_confidence,
          selected_category: category,
          category_match: true,
          category_match_confidence: pass1Result.category_match_confidence,
          rejection_reason: 'AI diagnostic service is temporarily busy or rate limited. Please try again in a few moments.',
          suggested_action: 'Please wait a moment and click Retry Diagnosis.',
          visible_evidence: []
        };
      }
    }
  }

  clearTimeout(timeoutId);

  if (!pass2Result) {
    console.error(`[DiagnosisAI][${scanTraceId}] Pass 2 failed all attempts:`, pass2Error?.message);
    const isProviderFailure = pass2Error && (pass2Error.message?.includes('429') || pass2Error.message?.includes('503') || pass2Error.message?.includes('failed to respond'));
    return {
      valid_for_diagnosis: false,
      status: isProviderFailure ? 'provider_error' : 'analysis_error',
      detected_object: pass1Result.detected_object,
      object_confidence: pass1Result.object_confidence,
      selected_category: category,
      category_match: true,
      category_match_confidence: pass1Result.category_match_confidence,
      rejection_reason: isProviderFailure
        ? 'AI service is temporarily unavailable. Please try again.'
        : 'The vision model returned an invalid response format. Please retry the diagnosis.',
      suggested_action: 'Please click Retry Diagnosis to re-analyze your image.',
      visible_evidence: []
    };
  }

  // Stage 14: Server-side validation on Pass 2
  const evidCheck = validateDiagnosisEvidence(pass2Result);
  if (!evidCheck.valid) {
    pass2Result.status = 'insufficient_evidence';
    pass2Result.issue = 'Insufficient visual evidence for damage confirmation';
    pass2Result.summary = evidCheck.reason;
    pass2Result.affected_components = [];
  }

  const consCheck = validateDiagnosisConsistency(pass1Result, pass2Result);
  if (!consCheck.valid) {
    pass2Result.status = 'insufficient_evidence';
    pass2Result.issue = 'Component angle mismatch';
    pass2Result.summary = consCheck.reason;
    pass2Result.affected_components = [];
  }

  const conf2Check = validateConfidence(pass1Result, pass2Result);
  if (!conf2Check.valid) {
    pass2Result.status = 'insufficient_evidence';
    pass2Result.issue = 'Uncertain damage assessment';
    pass2Result.summary = conf2Check.reason;
  }

  // Standardize severity
  const rawSev = String(pass2Result.severity || 'Medium').toLowerCase();
  const severityMap = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical', unknown: 'Medium' };
  pass2Result.severity = severityMap[rawSev] || 'Medium';

  // Map Pass 2 output into standardized diagnosis structure
  pass2Result.valid_for_diagnosis = (pass2Result.status === 'valid' || pass2Result.status === 'no_visible_damage');
  pass2Result.category = category;
  pass2Result.deviceType = pass1Result.detected_object;
  pass2Result.brand = deviceBrand || 'Identified Device';
  pass2Result.model = deviceModel || pass1Result.detected_object;
  pass2Result.confidence = (pass2Result.damage_confidence || 85) / 100;
  pass2Result.imageCount = images.length;
  pass2Result.detailedIssueExplanation = pass2Result.detailed_explanation || pass2Result.summary;
  pass2Result.plainEnglishSummary = pass2Result.summary;
  pass2Result.rootCause = (pass2Result.likely_causes && pass2Result.likely_causes[0]) || 'Visual stress point';
  pass2Result.affectedComponents = pass2Result.affected_components || [];
  pass2Result.risksIfUnfixed = pass2Result.risks_if_unfixed || [];
  pass2Result.recommendedSolution = Array.isArray(pass2Result.recommended_solution)
    ? pass2Result.recommended_solution.join(' ')
    : String(pass2Result.recommended_solution || 'Professional service advised');

  pass2Result.issues = (pass2Result.status === 'valid') ? [
    {
      issue: pass2Result.issue,
      damageDescription: pass2Result.summary,
      detailedExplanation: pass2Result.detailed_explanation,
      rootCause: pass2Result.rootCause,
      affectedComponents: pass2Result.affectedComponents,
      risksIfUnfixed: pass2Result.risksIfUnfixed,
      urgency: pass2Result.urgency || 'Immediate Attention Required',
      severity: pass2Result.severity || 'Medium',
      visualEvidence: pass2Result.visible_evidence || [],
      recommendedSolution: pass2Result.recommendedSolution,
      repairComplexity: pass2Result.repair_complexity || 'Medium'
    }
  ] : [];

  pass2Result.repairBlueprint = pass2Result.repair_blueprint || [];
  pass2Result.damageRegions = pass2Result.damage_regions || [];

  return pass2Result;
}
