// src/editor/Editor.tsx
import grapesjs from 'grapesjs';
import mjmlPlugin from 'grapesjs-mjml';
import GjsEditor from '@grapesjs/react';
import 'grapesjs/dist/css/grapes.min.css';

const SEED = `
<mjml>
  <mj-body background-color="#f5f5f7">
    <mj-section background-color="#ffffff" padding="20px 0">
      <mj-column>
        <mj-text font-size="18px" font-weight="700">MJML Studio</mj-text>
        <mj-text>This is a minimal seed. Use the default device buttons (top bar) to preview.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`.trim();

export default function Editor() {
  return (
    <div className="h-screen w-full">
      <GjsEditor
        grapesjs={grapesjs}
        options={{
          height: '100vh',
          fromElement: false,
          storageManager: false,
          // Vanilla deviceManager — the default UI will create the “devices” panel with its buttons
          deviceManager: {
            // IDs match what your theme returns in gjs.getDevice()
            devices: [
              { id: 'Desktop', name: 'Desktop', width: '' },   // full width
              { id: 'Tablet', name: 'Tablet', width: '768px' },
              { id: 'Mobile portrait', name: 'Mobile portrait', width: '375px' },
            ],
          },

          plugins: [mjmlPlugin],
        }}
        onEditor={(editor) => {
          (window as any).gjs = editor; // optional: for console checks
          if (!editor.getHtml()) editor.setComponents(SEED);
          // start on desktop (default behavior)
          editor.setDevice('desktop');
        }}
      />
    </div>
  );
}
