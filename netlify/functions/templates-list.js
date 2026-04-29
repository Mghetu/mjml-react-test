import { createJsonResponse, ensureBlobsContext, getManifest } from './_templates.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 };
  }

  if (event.httpMethod !== 'GET') {
    return createJsonResponse(405, { error: 'Method Not Allowed' });
  }

  try {
    ensureBlobsContext(event);
    const manifest = await getManifest();
    return createJsonResponse(200, { templates: manifest });
  } catch (error) {
    console.error('Failed to load templates manifest.', error);
    return createJsonResponse(500, { error: 'Failed to load templates.' });
  }
};
