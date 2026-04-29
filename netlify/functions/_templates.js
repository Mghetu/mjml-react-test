import { connectLambda, getStore } from '@netlify/blobs';

const TEMPLATES_STORE = 'newsletter-templates';
const MANIFEST_KEY = 'manifest';
const TEMPLATE_KEY_PREFIX = 'template:';
const MAX_TEMPLATE_SIZE_BYTES = 2 * 1024 * 1024;

const defaultTemplates = [
  {
    id: 'marketing-eminence-newsletter-ro',
    name: 'Marketing Eminence Newsletter RO',
    locale: 'ro-RO',
    description: 'Template principal pentru newsletter-ul Marketing Eminence in romana.',
    mjml: `<mjml>
  <mj-body background-color="#f5f7fb">
    <mj-section background-color="#ffffff" padding="24px">
      <mj-column>
        <mj-text font-size="26px" font-family="Arial, sans-serif" font-weight="700" color="#1f2a44">
          Marketing Eminence
        </mj-text>
        <mj-text font-size="15px" color="#56637a">
          Buna! Acesta este template-ul RO pentru newsletter.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
  },
  {
    id: 'marketing-eminence-newsletter-en',
    name: 'Marketing Eminence Newsletter EN',
    locale: 'en-US',
    description: 'Primary newsletter template for Marketing Eminence in English.',
    mjml: `<mjml>
  <mj-body background-color="#f5f7fb">
    <mj-section background-color="#ffffff" padding="24px">
      <mj-column>
        <mj-text font-size="26px" font-family="Arial, sans-serif" font-weight="700" color="#1f2a44">
          Marketing Eminence
        </mj-text>
        <mj-text font-size="15px" color="#56637a">
          Hello! This is the EN newsletter template.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
  },
];

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

const toManifestEntry = (template) => {
  const nowIso = new Date().toISOString();
  return {
    id: template.id,
    name: template.name,
    locale: template.locale || null,
    description: template.description || '',
    updatedAt: nowIso,
  };
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

const writeSeedTemplates = async (store) => {
  const manifest = [];
  for (const template of defaultTemplates) {
    const entry = toManifestEntry(template);
    manifest.push(entry);
    await store.set(templateKey(template.id), template.mjml);
  }
  await store.setJSON(MANIFEST_KEY, manifest);
  return manifest;
};

export const getManifest = async () => {
  const store = getTemplatesStore();
  const manifest = await store.get(MANIFEST_KEY, { type: 'json' });
  if (Array.isArray(manifest) && manifest.every(isManifestEntry)) {
    return manifest;
  }
  return writeSeedTemplates(store);
};

export const getTemplateById = async (id) => {
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
