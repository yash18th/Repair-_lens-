const CATEGORIES = ['Smartphone & Tablet', 'Electronics & PCB', 'Home Appliance', 'Computers & Laptops', 'Vehicles', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical', 'Unknown'];
const COMPLEXITIES = ['Low', 'Medium', 'High', 'Very High', 'Unknown'];
function toGeminiImagePart(dataUrl) {
  const match = /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/i.exec(dataUrl || '');
  if (!match) throw new Error('Each image must be a supported base64-encoded image.');
  return { inlineData: { mimeType: match[1].toLowerCase(), data: match[2] } };
}

function responseText(payload) {
  return payload.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
}

export async function analyzeUploadedImages({ images, category, userDescription = '', deviceBrand = '', deviceModel = '' }) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('AI diagnosis is not configured. Set GEMINI_API_KEY on the backend.');
    error.statusCode = 503;
    error.code = 'AI_MODEL_NOT_CONFIGURED';
    throw error;
  }
  if (!Array.isArray(images) || !images.length) {
    const error = new Error('At least one readable image is required.');
    error.statusCode = 400;
    throw error;
  }

  const prompt = `You are RepairLens, a conservative visual repair assessor. Analyze the supplied image(s), not the filename. Category context: ${category || 'none'}. User notes: ${userDescription || 'none'}. Claimed brand/model: ${deviceBrand || 'none'}/${deviceModel || 'none'}. Report only visible evidence. Never invent hidden faults. If evidence is insufficient, return LOW_CONFIDENCE and explain what is missing. Return only a JSON object with these fields: category (one of ${CATEGORIES.join(', ')}), deviceType, brand, model, issues (array of objects with issue, damageDescription, affectedComponents, severity, visualEvidence, recommendedSolution, repairComplexity), severity (one of ${SEVERITIES.join(', ')}), confidence (number from 0 to 1), status (CONFIDENT or LOW_CONFIDENCE), visualEvidence (array), uncertainty, recommendedSolution, repairComplexity (one of ${COMPLEXITIES.join(', ')}), estimatedDuration, repairBlueprint (array of {title, description}), and damageRegions (array of {label, description, confidence, box: {x, y, width, height}}). Damage-region coordinates must be fractions from 0 to 1.`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);
  let response;
  try {
    const model = process.env.GEMINI_VISION_MODEL || 'gemini-3.6-flash';
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }, ...images.map(image => toGeminiImagePart(image.dataUrl))] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
      }),
      signal: controller.signal
    });
  } catch (cause) {
    const error = new Error(cause.name === 'AbortError' ? 'Vision provider timed out.' : 'Vision provider could not be reached.');
    error.statusCode = 502;
    error.code = cause.name === 'AbortError' ? 'AI_PROVIDER_TIMEOUT' : 'AI_PROVIDER_UNREACHABLE';
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const providerBody = await response.text();
    const error = new Error(`Vision provider request failed (${response.status}): ${providerBody.slice(0, 500)}`);
    error.statusCode = 502;
    error.code = 'AI_PROVIDER_ERROR';
    throw error;
  }

  const payload = await response.json();
  let diagnosis;
  try {
    diagnosis = JSON.parse(responseText(payload));
  } catch (cause) {
    const error = new Error('Vision provider returned invalid structured diagnosis.');
    error.statusCode = 502;
    error.code = 'AI_INVALID_RESPONSE';
    error.cause = cause;
    throw error;
  }
  diagnosis.imageCount = images.length;
  diagnosis.status = diagnosis.confidence < 0.6 ? 'LOW_CONFIDENCE' : diagnosis.status;
  diagnosis.damageRegions = (diagnosis.damageRegions || []).filter(region => region.confidence >= 0.7);
  return diagnosis;
}
