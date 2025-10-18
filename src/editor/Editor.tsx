/**
 * @codex: In-browser MJML editor using GrapesJS.
 * - Use grapesjs-mjml (resetStyle: true).
 * - Local-only persistence (compressed localStorage).
 * - All assets must be data URIs (fully offline).
 * - Compile MJML->HTML via mjml-browser in a Web Worker.
 * - Outlook-first: VML button option, constrain img widths.
 */
import { GjsEditor, GjsIframe } from '@grapesjs/react';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-mjml/dist/grapesjs-mjml.css';

export default function Editor() {
  return (
    <GjsEditor
      grapesjs="grapesjs"
      options={{
        fromElement: false,
        height: '100%',
        storageManager: false,
        deviceManager: {
          devices: [
            { id: 'desktop', name: 'Desktop', width: '' },
            { id: 'tablet', name: 'Tablet', width: '768px' },
            { id: 'mobile', name: 'Mobile', width: '375px' },
          ],
        },
        plugins: ['grapesjs-mjml'],
        pluginsOpts: { 'grapesjs-mjml': { resetStyle: true } },
      }}
    >
      <GjsIframe />
    </GjsEditor>
  );
}
