const CATEGORIES = ['Smartphone & Tablet', 'Electronics & PCB', 'Home Appliance', 'Computers & Laptops', 'Vehicles', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical', 'Unknown'];
const COMPLEXITIES = ['Low', 'Medium', 'High', 'Very High', 'Unknown'];
const responseFormat = {
  type: 'json_schema',
  name: 'repair_diagnosis',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['category', 'deviceType', 'brand', 'model', 'issues', 'severity', 'confidence', 'status', 'visualEvidence', 'uncertainty', 'recommendedSolution', 'repairComplexity', 'estimatedDuration', 'repairBlueprint', 'damageRegions'],
    properties: {
      category: { type: 'string', enum: CATEGORIES },
      deviceType: { type: 'string' },
      brand: { type: 'string' },
      model: { type: 'string' },
      severity: { type: 'string', enum: SEVERITIES },
      confidence: { type: 'number', minimum: 0, maximum: 1 },
      status: { type: 'string', enum: ['CONFIDENT', 'LOW_CONFIDENCE'] },
      visualEvidence: { type: 'array', items: { type: 'string' } },
      uncertainty: { type: 'string' },
      recommendedSolution: { type: 'string' },
      repairComplexity: { type: 'string', enum: COMPLEXITIES },
      estimatedDuration: { type: 'string' },
      issues: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['issue', 'damageDescription', 'affectedComponents', 'severity', 'visualEvidence', 'recommendedSolution', 'repairComplexity'],
          properties: {
            issue: { type: 'string' },
            damageDescription: { type: 'string' },
            affectedComponents: { type: 'array', items: { type: 'string' } },
            severity: { type: 'string', enum: SEVERITIES },
            visualEvidence: { type: 'array', items: { type: 'string' } },
            recommendedSolution: { type: 'string' },
            repairComplexity: { type: 'string', enum: COMPLEXITIES }
          }
        }
      },
      repairBlueprint: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'description'], properties: { title: { type: 'string' }, description: { type: 'string' } } } },
      damageRegions: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['label', 'description', 'confidence', 'box'], properties: { label: { type: 'string' }, description: { type: 'string' }, confidence: { type: 'number', minimum: 0, maximum: 1 }, box: { type: 'object', additionalProperties: false, required: ['x', 'y', 'width', 'height'], properties: { x: { type: 'number', minimum: 0, maximum: 1 }, y: { type: 'number', minimum: 0, maximum: 1 }, width: { type: 'number', minimum: 0, maximum: 1 }, height: { type: 'number', minimum: 0, maximum: 1 } } } } } }
    }
  }
};

function responseText(payload) {
  return payload.output_text || payload.output?.flatMap(item => item.content || []).map(part => part.text || '').join('') || '';
}

export async function analyzeUploadedImages({ images, category, userDescription = '', deviceBrand = '', deviceModel = '' }) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('AI diagnosis is not configured. Set OPENAI_API_KEY on the backend.');
    error.statusCode = 503;
    error.code = 'AI_MODEL_NOT_CONFIGURED';
    throw error;
  }
  if (!Array.isArray(images) || !images.length) {
    const error = new Error('At least one readable image is required.');
    error.statusCode = 400;
    throw error;
  }

  const prompt = `You are RepairLens, a conservative visual repair assessor. Analyze the supplied image(s), not the filename. Category context: ${category || 'none'}. User notes: ${userDescription || 'none'}. Claimed brand/model: ${deviceBrand || 'none'}/${deviceModel || 'none'}. Report only visible evidence. Never invent hidden faults. If evidence is insufficient, return LOW_CONFIDENCE and explain what is missing.`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);
  let response;
  try {
    response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || 'gpt-4.1-mini',
        input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }, ...images.map(image => ({ type: 'input_image', image_url: image.dataUrl, detail: 'high' }))] }],
        text: { format: responseFormat }
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
  diagnosis.damageRegions = diagnosis.damageRegions.filter(region => region.confidence >= 0.7);
  return diagnosis;
}
