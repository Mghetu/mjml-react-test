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

    const raw = serializeLocalSession(mjml, savedAt);
    const parsed = parseLocalSession(raw);

    expect(parsed).not.toBeNull();
    expect(parsed?.mjml).toBe(mjml);
    expect(parsed?.savedAt).toBe(savedAt);
  });

  it('rejects payloads with invalid checksum', () => {
    const mjml = '<mjml><mj-body><mj-text>Mismatch</mj-text></mj-body></mjml>';
    const savedAt = 1710000000123;
    const corrupted = JSON.stringify({
      version: LOCAL_SESSION_SCHEMA_VERSION,
      mjml,
      savedAt,
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
});
