import { buildSessionClearCookieHeader } from './_auth.js';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
};

const createResponse = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    ...jsonHeaders,
    ...extraHeaders,
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 };
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method Not Allowed' });
  }

  return createResponse(
    200,
    { authenticated: false },
    { 'Set-Cookie': buildSessionClearCookieHeader() },
  );
};
