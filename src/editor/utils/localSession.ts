export interface LocalSessionPayload {
  version: number;
  mjml: string;
  savedAt: number;
  checksum: string;
}

export interface StoredSession {
  mjml: string;
  savedAt: number;
}

export const LOCAL_SESSION_SCHEMA_VERSION = 1;

const computeHash = (input: string) => {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const computeSessionChecksum = (version: number, mjml: string, savedAt: number) =>
  computeHash(`${version}|${savedAt}|${mjml}`);

export const serializeLocalSession = (mjml: string, savedAt: number): string => {
  const version = LOCAL_SESSION_SCHEMA_VERSION;
  const payload: LocalSessionPayload = {
    version,
    mjml,
    savedAt,
    checksum: computeSessionChecksum(version, mjml, savedAt),
  };

  return JSON.stringify(payload);
};

export const parseLocalSession = (raw: string | null): StoredSession | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LocalSessionPayload>;

    if (parsed.version !== LOCAL_SESSION_SCHEMA_VERSION) {
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

    const expected = computeSessionChecksum(parsed.version, parsed.mjml, parsed.savedAt);
    if (parsed.checksum !== expected) {
      return null;
    }

    return {
      mjml: parsed.mjml,
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
};
