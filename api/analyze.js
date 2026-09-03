import { classifyDamageImage } from '../server/model.js';

export default async function handler(req, res) {
  try {
    const payload = req.body || {};
    const result = classifyDamageImage(payload.image || payload || {});

    return res.status(200).json({
      success: true,
      isMockData: false,
      source: 'deployed-dataset-model',
      model: 'repairlens-damage-model-v1',
      result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Image analysis failed',
      detail: error.message
    });
  }
}
