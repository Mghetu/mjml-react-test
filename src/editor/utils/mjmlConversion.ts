// src/editor/utils/mjmlConversion.ts
import type { Editor } from 'grapesjs';
import mjml2htmlBrowser from 'mjml-browser';
import { sanitizeMjmlMarkup } from './mjml';

export type HtmlExportProfile = 'email-safe' | 'aggressive';

const formatError = (error: unknown) => {
  if (error && typeof error === 'object') {
    const typedError = error as { formattedMessage?: string; message?: string };
    return typedError.formattedMessage || typedError.message || JSON.stringify(error);
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error.';
  }
};

export async function convertCurrentMjmlToHtml(
  editor: Editor,
  profile: HtmlExportProfile = 'email-safe',
) {
  const mjml = sanitizeMjmlMarkup(editor.getHtml());

  if (!mjml || mjml.trim().length === 0) {
    alert('There is no MJML content to export.');
    return;
  }

  try {
    const response = await fetch('/api/convert-mjml', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mjml, profile }),
    });

    const canUseBrowserFallback =
      response.status === 404 &&
      typeof window !== 'undefined' &&
      ['localhost', '127.0.0.1'].includes(window.location.hostname);

    if (canUseBrowserFallback) {
      const localResult = mjml2htmlBrowser(mjml, {
        validationLevel: 'strict',
        minify: true,
        beautify: false,
        keepComments: false,
      });

      const html = typeof localResult?.html === 'string' ? localResult.html : '';
      const errors = Array.isArray(localResult?.errors) ? localResult.errors : [];

      if (errors.length > 0) {
        const message = errors.map(formatError).join('\n');
        alert(`MJML export failed:\n\n${message}`);
        return;
      }

      if (!html) {
        alert('MJML export failed: local browser conversion returned no HTML.');
        return;
      }

      alert(
        'Running local fallback conversion (mjml-browser).\nImage compression via Tinify is skipped in this mode.'
      );

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.html';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const payload = (await response.json().catch(() => null)) as
      | { html?: string; errors?: unknown[]; error?: string }
      | null;

    if (!response.ok) {
      const validationErrors = Array.isArray(payload?.errors)
        ? payload.errors.map(formatError).join('\n')
        : null;
      const message = validationErrors || payload?.error || `Request failed (${response.status}).`;
      alert(`MJML export failed:\n\n${message}`);
      return;
    }

    if (!payload?.html) {
      alert('MJML export failed: server did not return HTML output.');
      return;
    }

    const blob = new Blob([payload.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.html';
    a.click();
    URL.revokeObjectURL(url);
  } catch (err: unknown) {
    console.error('MJML conversion failed:', err);
    const message =
      typeof err === 'object' && err && 'message' in err ? String((err as { message?: unknown }).message) : null;
    alert(
      'MJML export failed:\n\n' +
        (message ??
          'Could not reach /api/convert-mjml. Use Netlify Functions (netlify dev or deployed site).')
    );
  }
}
