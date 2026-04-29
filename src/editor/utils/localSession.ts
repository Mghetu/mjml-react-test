export interface LocalSessionPayload {
  version: number;
  mjml: string;
  savedAt: number;
  projectName?: string | null;
  projectVersion?: number;
  versionFingerprint?: string | null;
  checksum: string;
}

export interface StoredSession {
  mjml: string;
  savedAt: number;
  projectName: string | null;
  projectVersion: number;
  versionFingerprint: string | null;
}

export const LOCAL_SESSION_SCHEMA_VERSION = 2;

const computeHash = (input: string) => {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const computeSessionChecksum = (
  version: number,
  mjml: string,
  savedAt: number,
  projectName: string | null = null,
  projectVersion = 1,
  versionFingerprint: string | null = null,
) =>
  computeHash(
    `${version}|${savedAt}|${mjml}|${projectName ?? ''}|${projectVersion}|${versionFingerprint ?? ''}`,
  );

interface SessionMeta {
  projectName?: string | null;
  projectVersion?: number;
  versionFingerprint?: string | null;
}

export const serializeLocalSession = (mjml: string, savedAt: number, meta: SessionMeta = {}): string => {
  const version = LOCAL_SESSION_SCHEMA_VERSION;
  const projectName = typeof meta.projectName === 'string' && meta.projectName.trim().length > 0
    ? meta.projectName.trim()
    : null;
  const projectVersion =
    typeof meta.projectVersion === 'number' && Number.isInteger(meta.projectVersion) && meta.projectVersion > 0
      ? meta.projectVersion
      : 1;
  const versionFingerprint =
    typeof meta.versionFingerprint === 'string' && meta.versionFingerprint.trim().length > 0
      ? meta.versionFingerprint
      : null;
  const payload: LocalSessionPayload = {
    version,
    mjml,
    savedAt,
    projectName,
    projectVersion,
    versionFingerprint,
    checksum: computeSessionChecksum(
      version,
      mjml,
      savedAt,
      projectName,
      projectVersion,
      versionFingerprint,
    ),
  };

  return JSON.stringify(payload);
};

export const parseLocalSession = (raw: string | null): StoredSession | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LocalSessionPayload>;

    if (parsed.version !== 1 && parsed.version !== LOCAL_SESSION_SCHEMA_VERSION) {
      return null;
    }

    if (typeof parsed.mjml !== 'string' || parsed.mjml.trim().length === 0) {
      return null;
    }

    if (typeof parsed.savedAt !== 'number' || !Number.isFinite(parsed.savedAt)) {
      return null;
    }

    if (typeof parsed.checksum !== 'string' || parsed.checksum.length < 8) {
      return null;
    }

    const projectName =
      typeof parsed.projectName === 'string' && parsed.projectName.trim().length > 0
        ? parsed.projectName.trim()
        : null;
    const projectVersion =
      typeof parsed.projectVersion === 'number' &&
      Number.isInteger(parsed.projectVersion) &&
      parsed.projectVersion > 0
        ? parsed.projectVersion
        : 1;
    const versionFingerprint =
      typeof parsed.versionFingerprint === 'string' && parsed.versionFingerprint.trim().length > 0
        ? parsed.versionFingerprint
        : null;
    const expected =
      parsed.version === 1
        ? computeHash(`${parsed.version}|${parsed.savedAt}|${parsed.mjml}`)
        : computeSessionChecksum(
            parsed.version,
            parsed.mjml,
            parsed.savedAt,
            projectName,
            projectVersion,
            versionFingerprint,
          );
    if (parsed.checksum !== expected) {
      return null;
    }

    return {
      mjml: parsed.mjml,
      savedAt: parsed.savedAt,
      projectName,
      projectVersion,
      versionFingerprint,
    };
  } catch {
    return null;
  }
};
