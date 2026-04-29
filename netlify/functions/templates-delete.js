import { createJsonResponse, deleteTemplate, ensureBlobsContext, readJsonBody } from './_templates.js';

const getAdminTokenFromHeaders = (headers = {}) =>
  headers['x-admin-token'] || headers['X-Admin-Token'] || headers['x-templates-admin-token'];

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 };
  }

  if (event.httpMethod !== 'POST') {
    return createJsonResponse(405, { error: 'Method Not Allowed' });
  }

  const expectedToken = process.env.APP_ACCESS_PASSWORD;
  if (!expectedToken) {
    return createJsonResponse(500, { error: 'Missing APP_ACCESS_PASSWORD on server.' });
  }

  const providedToken = getAdminTokenFromHeaders(event.headers);
  if (providedToken !== expectedToken) {
    return createJsonResponse(401, { error: 'Unauthorized.' });
  }

  const payload = readJsonBody(event);
  if (!payload) {
    return createJsonResponse(400, { error: 'Invalid JSON payload.' });
  }

  try {
    ensureBlobsContext(event);
    const result = await deleteTemplate(payload.id);
    if (!result.ok) {
      return createJsonResponse(result.statusCode || 400, { error: result.error });
    }
    return createJsonResponse(200, {
      message: 'Template deleted.',
      template: result.value,
    });
  } catch (error) {
    console.error('Failed to delete template.', error);
    return createJsonResponse(500, { error: 'Failed to delete template.' });
  }
};
