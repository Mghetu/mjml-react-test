import { describe, expect, it } from 'vitest';
import {
  LOCAL_SESSION_SCHEMA_VERSION,
  computeSessionChecksum,
  parseLocalSession,
  serializeLocalSession,
} from '../src/editor/utils/localSession';

describe('localSession utils', () => {
  it('serializes and parses a valid session payload', () => {
    const mjml = '<mjml><mj-body><mj-section><mj-column><mj-text>Hello</mj-text></mj-column></mj-section></mj-body></mjml>';
    const savedAt = 1710000000000;
    const projectName = 'newsletter';
    const projectVersion = 3;
    const versionFingerprint = mjml;

    const raw = serializeLocalSession(mjml, savedAt, {
      projectName,
      projectVersion,
      versionFingerprint,
    });
    const parsed = parseLocalSession(raw);

    expect(parsed).not.toBeNull();
    expect(parsed?.mjml).toBe(mjml);
    expect(parsed?.savedAt).toBe(savedAt);
    expect(parsed?.projectName).toBe(projectName);
    expect(parsed?.projectVersion).toBe(projectVersion);
    expect(parsed?.versionFingerprint).toBe(versionFingerprint);
  });

  it('rejects payloads with invalid checksum', () => {
    const mjml = '<mjml><mj-body><mj-text>Mismatch</mj-text></mj-body></mjml>';
    const savedAt = 1710000000123;
    const corrupted = JSON.stringify({
      version: LOCAL_SESSION_SCHEMA_VERSION,
      mjml,
      savedAt,
      projectName: 'broken',
      projectVersion: 2,
      versionFingerprint: mjml,
      checksum: 'deadbeef',
    });

    expect(parseLocalSession(corrupted)).toBeNull();
  });

  it('rejects payloads with unsupported version', () => {
    const mjml = '<mjml><mj-body><mj-text>Version test</mj-text></mj-body></mjml>';
    const savedAt = 1710000000999;
    const checksum = computeSessionChecksum(999, mjml, savedAt);
    const wrongVersionPayload = JSON.stringify({
      version: 999,
      mjml,
      savedAt,
      checksum,
    });

    expect(parseLocalSession(wrongVersionPayload)).toBeNull();
  });

  it('parses legacy version 1 payloads', () => {
    const mjml = '<mjml><mj-body><mj-text>Legacy</mj-text></mj-body></mjml>';
    const savedAt = 1710000011111;
    let hash = 5381;
    const legacyInput = `1|${savedAt}|${mjml}`;
    for (let i = 0; i < legacyInput.length; i += 1) {
      hash = (hash * 33) ^ legacyInput.charCodeAt(i);
    }
    const legacyChecksum = (hash >>> 0).toString(16).padStart(8, '0');
    const legacyPayload = JSON.stringify({
      version: 1,
      mjml,
      savedAt,
      checksum: legacyChecksum,
    });

    const parsed = parseLocalSession(legacyPayload);
    expect(parsed).not.toBeNull();
    expect(parsed?.projectName).toBeNull();
    expect(parsed?.projectVersion).toBe(1);
    expect(parsed?.versionFingerprint).toBeNull();
  });
});
