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

function resolveModel() {
  const envModel = process.env.GEMINI_VISION_MODEL;
  if (!envModel || envModel.includes('2.5')) {
    return 'gemini-1.5-flash';
  }
  return envModel;
}

async function callGemini(parts, systemInstruction, signal) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the backend.');
  }

  const primaryModel = resolveModel();
  const candidateModels = [
    primaryModel,
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-pro'
  ];
  const modelsToTry = Array.from(new Set(candidateModels));

  const body = {
    contents: [
      {
        role: 'user',
        parts: parts
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1
    }
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  let lastError = null;
  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(body),
        signal
      });

      if (response.ok) {
        return await response.json();
      }

      const errorText = await response.text();
      lastError = new Error(`Gemini API (${model}) error (${response.status}): ${errorText.slice(0, 300)}`);
      console.warn(`[DiagnosisAI] Model ${model} failed with status ${response.status}:`, errorText.slice(0, 150));

      if (response.status === 404 || response.status === 429) {
        continue;
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      lastError = err;
      console.warn(`[DiagnosisAI] Model ${model} fetch exception:`, err.message);
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

  // If GEMINI_API_KEY is missing, refuse to generate fake diagnoses!
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[DiagnosisAI] GEMINI_API_KEY is not configured on the backend.');
    return {
      valid_for_diagnosis: false,
      status: 'insufficient_evidence',
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
   - If any phone, iPhone, Android, or mobile screen is in the photo (working or broken, displaying lines or cracked), set detected_object to "smartphone" or "tablet".
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

  const pass1UserPrompt = `Inspect the attached image(s) for Stage 1 Verification. Return ONLY JSON matching the gatekeeper schema.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  let pass1Result;
  try {
    const pass1Payload = await callGemini(
      [{ text: pass1UserPrompt }, ...imageParts],
      pass1SystemInstruction,
      controller.signal
    );
    pass1Result = JSON.parse(responseText(pass1Payload));
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('[DiagnosisAI] Pass 1 Gatekeeper failed:', err.message);
    return {
      valid_for_diagnosis: false,
      status: 'insufficient_evidence',
      detected_object: 'unknown',
      object_confidence: 0,
      selected_category: category,
      category_match: false,
      category_match_confidence: 0,
      rejection_reason: `Visual verification could not be completed: ${err.message}`,
      suggested_action: 'Please try uploading a smaller, clearer image.'
    };
  }

  console.log('[DiagnosisAI] Pass 1 Gatekeeper Result:', {
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
      status: 'invalid_image',
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
   - Detail the exact observed issue (e.g. vertical/horizontal screen lines, OLED display matrix glitch or line artifacts, cracked front glass, broken camera lens, dented bumper, burnt resistor).
   - Distinguish carefully between components (e.g. front glass vs OLED matrix vs back glass vs camera lens vs frame). If the display shows lines or color bars, diagnose display matrix/panel defect!
   - Every positive damage finding MUST cite explicit visual evidence directly from the image.
   - Multi-hypothesis check: could this be screen reflection/glare or surface dirt rather than a crack or defect? Explain in "alternative_hypotheses".
   - Set "status": "valid"
   - Set "damage_confidence": Integer 0-100. If damage cannot be distinguished from glare/dirt with confidence >= 70, set "status": "insufficient_evidence".

Return ONLY a valid JSON object matching this schema:
{
  "valid_for_diagnosis": true,
  "status": "valid" | "no_visible_damage" | "insufficient_evidence",
  "selected_category": "${category}",
  "detected_object": "${pass1Result.detected_object}",
  "object_confidence": ${pass1Result.object_confidence},
  "category_match_confidence": ${pass1Result.category_match_confidence},
  "damage_confidence": number,
  "rejection_reason": null,
  "issue": string,
  "summary": string,
  "detailed_explanation": string,
  "visible_evidence": string[],
  "alternative_hypotheses": string[],
  "affected_components": string[],
  "severity": "Low" | "Medium" | "High" | "Critical",
  "urgency": "Immediate Attention Required" | "Moderate" | "None - Device Intact",
  "likely_causes": string[],
  "risks_if_unfixed": string[],
  "recommended_solution": string[],
  "repair_complexity": "Low" | "Medium" | "High" | "Very High",
  "estimated_duration": string,
  "repair_blueprint": [ { "title": string, "description": string } ],
  "damage_regions": [ { "label": string, "description": string, "confidence": number, "box": { "x": number, "y": number, "width": number, "height": number } } ]
}`;

  const pass2UserPrompt = `Perform Stage 2 clinical damage inspection on the verified image(s). Return ONLY valid JSON.`;

  let pass2Result;
  try {
    const pass2Payload = await callGemini(
      [{ text: pass2UserPrompt }, ...imageParts],
      pass2SystemInstruction,
      controller.signal
    );
    pass2Result = JSON.parse(responseText(pass2Payload));
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('[DiagnosisAI] Pass 2 Damage Inspection failed:', err.message);
    return {
      valid_for_diagnosis: false,
      status: 'insufficient_evidence',
      detected_object: pass1Result.detected_object,
      object_confidence: pass1Result.object_confidence,
      selected_category: category,
      category_match: true,
      category_match_confidence: pass1Result.category_match_confidence,
      rejection_reason: `Damage inspection could not be completed: ${err.message}`,
      suggested_action: 'Please try again with a clear photo.'
    };
  } finally {
    clearTimeout(timeoutId);
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

  // Map Pass 2 output into standardized diagnosis structure
  pass2Result.valid_for_diagnosis = true;
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
