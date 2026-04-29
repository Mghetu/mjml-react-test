import { createJsonResponse, ensureBlobsContext, getManifest, getTemplateById } from './_templates.js';

const parseTemplateId = (event) => {
  const pathParamsId = event?.pathParameters?.id;
  if (typeof pathParamsId === 'string' && pathParamsId.trim()) {
    return pathParamsId.trim();
  }
  const path = typeof event?.path === 'string' ? event.path : '';
  const match = path.match(/\/api\/templates\/([^/]+)$/);
  if (match?.[1]) {
    return decodeURIComponent(match[1]).trim();
  }
  return '';
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 };
  }

  if (event.httpMethod !== 'GET') {
    return createJsonResponse(405, { error: 'Method Not Allowed' });
  }

  const id = parseTemplateId(event);
  if (!id) {
    return createJsonResponse(400, { error: 'Template id is required.' });
  }

  try {
    ensureBlobsContext(event);
    const [manifest, mjml] = await Promise.all([getManifest(), getTemplateById(id)]);
    if (!mjml) {
      return createJsonResponse(404, { error: 'Template not found.' });
    }
    const metadata = manifest.find((item) => item.id === id) ?? null;
    return createJsonResponse(200, { id, metadata, mjml });
  } catch (error) {
    console.error(`Failed to load template ${id}.`, error);
    return createJsonResponse(500, { error: 'Failed to load template.' });
  }
};
