// src/editor/Editor.tsx
import { useCallback, useEffect, useRef } from 'react';
import grapesjs, { type Editor as GrapesEditor } from 'grapesjs';
import GjsEditor, { Canvas, WithEditor } from '@grapesjs/react';
import mjmlPlugin from 'grapesjs-mjml';

import Topbar from './components/Topbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';

import 'grapesjs/dist/css/grapes.min.css';
import './editor.css';

export default function Editor() {
  const editorRef = useRef<GrapesEditor | null>(null);

  useEffect(() => {
    return () => {
      const editor = editorRef.current;
      if (editor) {
        editor.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleEditorReady = useCallback((editor: GrapesEditor) => {
    editorRef.current = editor;

    (window as unknown as { editor?: GrapesEditor }).editor = editor;
    console.log('Editor loaded with React UI');

    // Add custom visual styling for native mj-group components
    editor.on('load', () => {
      const style = document.createElement('style');
      style.textContent = `
        .gjs-selected [data-gjs-type="mj-group"] {
          outline: 2px dashed #4CAF50 !important;
          outline-offset: 2px;
        }

        [data-gjs-type="mj-group"]::before {
          content: "GROUP";
          display: inline-block;
          background: #4CAF50;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 3px;
          margin-right: 8px;
        }
      `;
      document.head.appendChild(style);

      // Fix for MJML components with zero padding disappearing from canvas
      // Inject CSS into the canvas iframe after a delay to ensure it's ready
      setTimeout(() => {
        const injectCanvasStyles = () => {
          const canvasFrames = editor.Canvas.getFrames();
          canvasFrames.forEach((frame: { view?: { el?: HTMLIFrameElement } }) => {
            const iframe = frame.view?.el;
            if (iframe?.contentDocument?.head) {
              // Check if styles already injected
              if (iframe.contentDocument.getElementById('mjml-padding-fix')) {
                return;
              }

              const canvasStyle = iframe.contentDocument.createElement('style');
              canvasStyle.id = 'mjml-padding-fix';
              canvasStyle.textContent = `
                /* Ensure MJML wrapper components have minimum height */
                [data-gjs-type="mj-body"],
                [data-gjs-type="mj-wrapper"],
                [data-gjs-type="mj-section"],
                [data-gjs-type="mj-group"],
                [data-gjs-type="mj-column"] {
                  min-height: 20px !important;
                }

                /* Make components with zero padding visible with subtle outline */
                [data-gjs-type="mj-section"][style*="padding: 0"],
                [data-gjs-type="mj-section"][style*="padding:0"],
                [data-gjs-type="mj-group"][style*="padding: 0"],
                [data-gjs-type="mj-group"][style*="padding:0"] {
                  min-height: 50px !important;
                  box-shadow: inset 0 0 0 1px rgba(150, 150, 150, 0.3) !important;
                }
              `;
              iframe.contentDocument.head.appendChild(canvasStyle);
            }
          });
        };

        // Inject styles initially
        injectCanvasStyles();

        // Re-inject on frame updates (when canvas reloads)
        editor.on('frame:load', injectCanvasStyles);
      }, 100);
    });

    console.log('Tip: mj-group contains columns that stay side-by-side on mobile (instead of stacking)');

    // Add the Microsoft Aptos system font to the typography control
    const registerAptosFont = () => {
      const styleManager = editor.StyleManager as unknown as {
        getProperty: (sector: string, id: string) => unknown;
      };
      const fontProperty =
        (styleManager?.getProperty?.('typography', 'font-family') as {
          getOptions?: () => unknown;
          get?: (key: string) => unknown;
          setOptions?: (options: unknown) => void;
          addOption?: (option: unknown) => void;
          set?: (key: string, value: unknown) => void;
        } | undefined) ?? undefined;

      if (!fontProperty) {
        return;
      }

      const aptosStack = 'Aptos, Calibri, "Trebuchet MS", sans-serif';
      const aptosOption = { id: aptosStack, label: 'Aptos (system)' };
      const rawOptions =
        typeof fontProperty.getOptions === 'function'
          ? fontProperty.getOptions()
          : fontProperty.get?.('options') ?? fontProperty.get?.('list');
      const options: unknown[] = Array.isArray(rawOptions) ? rawOptions : [];

      const hasAptos = options.some((option) => {
        if (typeof option === 'string') {
          return option.toLowerCase().includes('aptos');
        }

        if (option && typeof option === 'object') {
          const candidate =
            (option as { id?: unknown }).id ?? (option as { value?: unknown }).value;
          return typeof candidate === 'string' && candidate.toLowerCase().includes('aptos');
        }

        return false;
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
              <mj-section>
                <mj-group>
                  <mj-column width="50%">
                    <mj-text>
                      <p><strong>mj-group Example:</strong> These columns stay side-by-side on mobile!</p>
                    </mj-text>
                  </mj-column>
                  <mj-column width="50%">
                    <mj-text>
                      <p>Normally columns stack on mobile, but mj-group prevents this.</p>
                    </mj-text>
                  </mj-column>
                </mj-group>
              </mj-section>
            </mj-body>
          </mjml>
        `);

    console.log('Available blocks:', editor.BlockManager.getAll().length);
    console.log('Block IDs:', editor.BlockManager.getAll().map((b: { getId: () => string }) => b.getId()));

    // Add mj-group block to the Block Manager
    // mj-group wraps columns to keep them side-by-side on mobile
    editor.BlockManager.add('mj-group', {
      label: 'Group',
      category: 'Basic',
      content: `<mj-group>
        <mj-column width="50%">
          <mj-text>Column 1</mj-text>
        </mj-column>
        <mj-column width="50%">
          <mj-text>Column 2</mj-text>
        </mj-column>
      </mj-group>`,
      media: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3,3H21V7H3V3M3,9H21V11H3V9M3,13H21V21H3V13M5,15V19H19V15H5Z" />
      </svg>`,
      attributes: { class: 'fa fa-object-group' },
    });

    console.log('Available blocks after adding mj-group:', editor.BlockManager.getAll().length);
  }, []);

  return (
    <GjsEditor
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      options={{
        height: '100vh',
        storageManager: false,
        plugins: [mjmlPlugin],
      }}
      onEditor={handleEditorReady}
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
