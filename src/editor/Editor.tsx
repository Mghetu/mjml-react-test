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

        // Log block manager status
        const blocks = editor.BlockManager.getAll();
        console.log('Available blocks:', blocks.length);
        blocks.forEach((block: any) => {
          console.log('Block:', block.get('id'), block.get('label'));
        });
      }}
    />
  );
}
