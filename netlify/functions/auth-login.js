import { buildSessionSetCookieHeader } from './_auth.js';

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

  const configuredPassword = process.env.APP_ACCESS_PASSWORD || '';
  if (!configuredPassword) {
    return createResponse(500, { error: 'Server is missing APP_ACCESS_PASSWORD.' });
  }

  let payload;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return createResponse(400, { error: 'Invalid JSON payload.' });
  }

  const providedPassword = typeof payload?.password === 'string' ? payload.password : '';
  if (!providedPassword) {
    return createResponse(400, { error: 'Password is required.' });
  }

  if (providedPassword !== configuredPassword) {
    return createResponse(401, { error: 'Invalid password.' });
  }

  let setCookie;
  try {
    setCookie = buildSessionSetCookieHeader();
  } catch (error) {
    console.error('Failed to create session cookie:', error);
    return createResponse(500, { error: 'Server is missing SESSION_SECRET.' });
  }

  return createResponse(
    200,
    { authenticated: true },
    { 'Set-Cookie': setCookie },
  );
};
