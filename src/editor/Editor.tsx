// src/editor/Editor.tsx
import grapesjs from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import mjmlPlugin from 'grapesjs-mjml';

import 'grapesjs/dist/css/grapes.min.css';

export default function Editor() {
  return (
    <GjsEditor
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      options={{
        height: '100vh',
        width: 'auto',
        storageManager: false,
        plugins: [mjmlPlugin],
        canvas: {
          styles: ['https://unpkg.com/grapesjs-mjml/dist/grapesjs-mjml.min.css'],
        },
      }}
      onEditor={(editor) => {
        (window as any).editor = editor;
        console.log('Editor loaded:', editor);

        // Add initial MJML content to canvas
        editor.setComponents(`
          <mjml>
            <mj-body>
              <mj-section>
                <mj-column>
                  <mj-text>
                    <h1>Welcome to MJML Editor</h1>
                    <p>Drag and drop blocks from the left panel to build your email.</p>
                  </mj-text>
                  <mj-button href="#">
                    Click Me
                  </mj-button>
                </mj-column>
              </mj-section>
            </mj-body>
          </mjml>
        `);

        // Log block manager status
        const blocks = editor.BlockManager.getAll();
        console.log('Available blocks:', blocks.length);

        // Make sure blocks panel is rendered and visible
        const panels = editor.Panels;
        const blocksPanel = panels.getPanel('views-container');
        if (blocksPanel) {
          blocksPanel.set('visible', true);
          console.log('Blocks panel made visible');
        }

        // Get the blocks button and make sure it's visible
        const blocksBtn = panels.getButton('views', 'open-blocks');
        if (blocksBtn) {
          blocksBtn.set('active', true);
          console.log('Blocks button activated');
        }
      }}
    />
  );
}
