import { describe, expect, it } from 'vitest';
import { hardenExportedHtmlForOutlook } from '../netlify/functions/convert-mjml.js';

describe('hardenExportedHtmlForOutlook', () => {
  it('adds outlook-safe attributes to standalone images', () => {
    const input = '<table><tr><td><img src="https://example.com/banner.png" /></td></tr></table>';
    const output = hardenExportedHtmlForOutlook(input);

    expect(output).toContain('border="0"');
    expect(output).toContain('style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"');
  });

  it('preserves existing styles while enforcing outlook-safe styles', () => {
    const input =
      '<table><tr><td><img src="https://example.com/banner.png" style="width:100%;height:auto" /></td></tr></table>';
    const output = hardenExportedHtmlForOutlook(input);

    expect(output).toContain('style="width:100%;height:auto;display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"');
  });

  it('hardens linked images and parent anchors', () => {
    const input =
      '<table><tr><td><a href="https://example.com"><img src="data:image/png;base64,abc" /></a></td></tr></table>';
    const output = hardenExportedHtmlForOutlook(input);

    expect(output).toContain('<a href="https://example.com" style="text-decoration:none;border:0">');
    expect(output).toContain('style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"');
    expect(output).toContain('border="0"');
  });
});
