import { isRequestAuthenticated } from './_auth.js';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
};

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: jsonHeaders,
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 };
  }

  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method Not Allowed' });
  }

  if (!isRequestAuthenticated(event)) {
    return createResponse(401, { authenticated: false });
  }

  return createResponse(200, { authenticated: true });
};
