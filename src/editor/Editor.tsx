// src/editor/Editor.tsx
import grapesjs from 'grapesjs';
import GjsEditor, { Canvas, WithEditor } from '@grapesjs/react';
import mjmlPlugin from 'grapesjs-mjml';

import Topbar from './components/Topbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';

import 'grapesjs/dist/css/grapes.min.css';
import './editor.css';

export default function Editor() {
  return (
    <GjsEditor
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      options={{
        height: '100vh',
        storageManager: false,
        plugins: [mjmlPlugin],
      }}
      onEditor={(editor) => {
        (window as any).editor = editor;
        console.log('Editor loaded with React UI');

        // Add the Microsoft Aptos system font to the typography control
        const registerAptosFont = () => {
          const styleManager = editor.StyleManager as any;
          const fontProperty = styleManager?.getProperty?.('typography', 'font-family') as any;

          if (!fontProperty) {
            return;
          }

          const aptosStack = 'Aptos, Calibri, "Trebuchet MS", sans-serif';
          const aptosOption = { id: aptosStack, label: 'Aptos (system)' };
          const rawOptions =
            typeof fontProperty.getOptions === 'function'
              ? fontProperty.getOptions()
              : fontProperty.get?.('options') ?? fontProperty.get?.('list');
          const options: any[] = Array.isArray(rawOptions) ? rawOptions : [];

          const hasAptos = options.some((option) => {
            const optionId =
              typeof option === 'string'
                ? option
                : option?.id ?? option?.value;

            return typeof optionId === 'string' && optionId.toLowerCase().includes('aptos');
          });

          if (hasAptos) {
            return;
          }

          const updatedOptions = [aptosOption, ...options];

          if (typeof fontProperty.setOptions === 'function') {
            fontProperty.setOptions(updatedOptions);
          } else if (typeof fontProperty.addOption === 'function') {
            fontProperty.addOption(aptosOption);
          } else if (typeof fontProperty.set === 'function') {
            fontProperty.set('options', updatedOptions);
          }
        };

        registerAptosFont();
        editor.on('load', registerAptosFont);

        // Add initial MJML content
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

        console.log('Available blocks:', editor.BlockManager.getAll().length);
      }}
    >
      <div className="editor-container gjs-one-bg gjs-two-color">
        <WithEditor>
          <Topbar />
        </WithEditor>
        <div className="editor-body">
          <LeftSidebar />
          <div className="canvas-container">
            <Canvas className="canvas-area" />
          </div>
          <RightSidebar />
        </div>
      </div>
    </GjsEditor>
  );
}
