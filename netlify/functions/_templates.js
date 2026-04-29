import { connectLambda, getStore } from '@netlify/blobs';

const TEMPLATES_STORE = 'newsletter-templates';
const MANIFEST_KEY = 'manifest';
const TEMPLATE_KEY_PREFIX = 'template:';
const MAX_TEMPLATE_SIZE_BYTES = 2 * 1024 * 1024;

const LEGACY_TEMPLATE_IDS = new Set([
  'marketing-eminence-newsletter-ro',
  'marketing-eminence-newsletter-en',
]);

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
};

const normalizeMjml = (value) => (typeof value === 'string' ? value.trim() : '');

export const createJsonResponse = (statusCode, body) => ({
  statusCode,
  headers: jsonHeaders,
  body: JSON.stringify(body),
});

export const ensureBlobsContext = (event) => {
  connectLambda(event);
};

export const readJsonBody = (event) => {
  try {
    return event?.body ? JSON.parse(event.body) : {};
  } catch {
    return null;
  }
};

const isManifestEntry = (entry) =>
  entry &&
  typeof entry === 'object' &&
  typeof entry.id === 'string' &&
  typeof entry.name === 'string';

export const validateTemplatePayload = (payload) => {
  const id = typeof payload?.id === 'string' ? payload.id.trim() : '';
  const name = typeof payload?.name === 'string' ? payload.name.trim() : '';
  const locale = typeof payload?.locale === 'string' ? payload.locale.trim() : '';
  const description = typeof payload?.description === 'string' ? payload.description.trim() : '';
  const mjml = normalizeMjml(payload?.mjml);

  if (!id || !/^[a-z0-9-]+$/.test(id)) {
    return { ok: false, error: 'Template id is required and must contain only lowercase letters, numbers, and dashes.' };
  }
  if (!name) {
    return { ok: false, error: 'Template name is required.' };
  }
  if (!mjml) {
    return { ok: false, error: 'Template MJML is required.' };
  }
  if (!mjml.toLowerCase().startsWith('<mjml')) {
    return { ok: false, error: 'Template MJML must include an <mjml> root element.' };
  }
  if (Buffer.byteLength(mjml, 'utf8') > MAX_TEMPLATE_SIZE_BYTES) {
    return { ok: false, error: 'Template is too large. Maximum allowed size is 2 MB.' };
  }

  return {
    ok: true,
    value: {
      id,
      name,
      locale: locale || null,
      description,
      mjml,
    },
  };
};

const getTemplatesStore = () => getStore(TEMPLATES_STORE);
const templateKey = (id) => `${TEMPLATE_KEY_PREFIX}${id}`;

const removeLegacyTemplates = async (store, manifest) => {
  const filteredManifest = manifest.filter((entry) => !LEGACY_TEMPLATE_IDS.has(entry.id));
  if (filteredManifest.length === manifest.length) {
    return filteredManifest;
  }

  await Promise.all(
    manifest
      .filter((entry) => LEGACY_TEMPLATE_IDS.has(entry.id))
      .map((entry) => store.delete(templateKey(entry.id))),
  );
  await store.setJSON(MANIFEST_KEY, filteredManifest);
  return filteredManifest;
};

export const getManifest = async () => {
  const store = getTemplatesStore();
  const manifest = await store.get(MANIFEST_KEY, { type: 'json' });
  if (Array.isArray(manifest) && manifest.every(isManifestEntry)) {
    return removeLegacyTemplates(store, manifest);
  }
  await store.setJSON(MANIFEST_KEY, []);
  return [];
};

export const getTemplateById = async (id) => {
  if (LEGACY_TEMPLATE_IDS.has(id)) {
    return null;
  }
  const store = getTemplatesStore();
  const mjml = await store.get(templateKey(id), { type: 'text' });
  if (typeof mjml !== 'string') {
    return null;
  }
  return normalizeMjml(mjml);
};

export const upsertTemplate = async (templatePayload) => {
  const validation = validateTemplatePayload(templatePayload);
  if (!validation.ok) {
    return validation;
  }

  const store = getTemplatesStore();
  const template = validation.value;
  const existingManifest = await getManifest();
  const nowIso = new Date().toISOString();

  const nextManifest = existingManifest.filter((entry) => entry.id !== template.id);
  nextManifest.unshift({
    id: template.id,
    name: template.name,
    locale: template.locale,
    description: template.description,
    updatedAt: nowIso,
  });

  await store.set(templateKey(template.id), template.mjml);
  await store.setJSON(MANIFEST_KEY, nextManifest);

  return {
    ok: true,
    value: {
      id: template.id,
      updatedAt: nowIso,
    },
  };
};

export const deleteTemplate = async (id) => {
  const templateId = typeof id === 'string' ? id.trim() : '';
  if (!templateId) {
    return { ok: false, error: 'Template id is required.' };
  }

  const store = getTemplatesStore();
  const manifest = await getManifest();
  const exists = manifest.some((entry) => entry.id === templateId);
  if (!exists) {
    return { ok: false, error: 'Template not found.', statusCode: 404 };
  }

  const nextManifest = manifest.filter((entry) => entry.id !== templateId);
  await store.delete(templateKey(templateId));
  await store.setJSON(MANIFEST_KEY, nextManifest);

  return {
    ok: true,
    value: {
      id: templateId,
      deletedAt: new Date().toISOString(),
    },
  };
};
