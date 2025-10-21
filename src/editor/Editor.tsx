// src/editor/Editor.tsx
import grapesjs from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import mjmlPlugin from 'grapesjs-mjml';

import 'grapesjs/dist/css/grapes.min.css';

export default function Editor() {
  return (
    <GjsEditor
      grapesjs={grapesjs}
      options={{
        height: '100vh',
        storageManager: false,
        // Don't disable default panels - let MJML plugin create them
        plugins: [mjmlPlugin],
      }}
      onEditor={(editor) => {
        (window as any).editor = editor;
        console.log('Editor loaded:', editor);
      }}
    />
  );
}
