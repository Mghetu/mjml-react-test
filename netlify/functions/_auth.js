import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'mjml_auth';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const textEncoder = new TextEncoder();

const base64UrlEncode = (input) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const base64UrlDecode = (input) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(normalized + '='.repeat(padLength), 'base64').toString('utf8');
};

const parseCookieHeader = (cookieHeader = '') => {
  const entries = cookieHeader.split(';').map((chunk) => chunk.trim()).filter(Boolean);
  const parsed = {};

  entries.forEach((entry) => {
    const separatorIndex = entry.indexOf('=');
    if (separatorIndex <= 0) {
      return;
    }
    const key = entry.slice(0, separatorIndex).trim();
    const value = entry.slice(separatorIndex + 1).trim();
    parsed[key] = decodeURIComponent(value);
  });

  return parsed;
};

const createSignature = (payload, secret) =>
  crypto.createHmac('sha256', textEncoder.encode(secret)).update(payload).digest('base64url');

const getSessionSecret = () => process.env.SESSION_SECRET || '';

export const createSessionCookieValue = () => {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('SESSION_SECRET is missing.');
  }

  const payload = JSON.stringify({
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });
  const payloadToken = base64UrlEncode(payload);
  const signature = createSignature(payloadToken, secret);
  return `${payloadToken}.${signature}`;
};

export const isRequestAuthenticated = (event) => {
  const secret = getSessionSecret();
  if (!secret) {
    return false;
  }

  const cookies = parseCookieHeader(event.headers?.cookie || event.headers?.Cookie || '');
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token || !token.includes('.')) {
    return false;
  }

  const [payloadToken, providedSignature] = token.split('.');
  if (!payloadToken || !providedSignature) {
    return false;
  }

  const expectedSignature = createSignature(payloadToken, secret);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }
  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadToken));
    const expiration = Number(payload?.exp);
    if (!Number.isFinite(expiration) || Date.now() >= expiration) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const buildSessionSetCookieHeader = () =>
  `${SESSION_COOKIE_NAME}=${encodeURIComponent(createSessionCookieValue())}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}`;

export const buildSessionClearCookieHeader = () =>
  `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
