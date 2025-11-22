// src/editor/utils/mjmlConversion.ts
import type { Editor } from 'grapesjs';
// We use mjml-browser for client-side MJML → HTML conversion so the editor works on GitHub Pages without any backend API.
import mjml2html from 'mjml-browser';

export function convertCurrentMjmlToHtml(editor: Editor) {
  const mjml = editor.getHtml();

  try {
    const { html, errors } = mjml2html(mjml, {
      validationLevel: 'strict',
      minify: true,
      beautify: false,
      keepComments: false,
    });

    if (errors && errors.length > 0) {
      console.error('MJML validation errors:', errors);
      alert(
        'MJML validation errors:\n\n' +
          errors
            .map((e: unknown) => {
              if (e && typeof e === 'object') {
                const error = e as { formattedMessage?: string; message?: string };
                return error.formattedMessage || error.message || JSON.stringify(e);
              }

              if (typeof e === 'string') {
                return e;
              }

              try {
                return JSON.stringify(e);
              } catch (serializationError) {
                console.error('Unable to serialize MJML error', serializationError);
                return 'Unknown MJML validation error.';
              }
            })
            .join('\n')
      );
      return;
    }

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
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
      'MJML conversion failed:\n\n' + (message ?? 'Unknown error, see console for details.')
    );
  }
}
