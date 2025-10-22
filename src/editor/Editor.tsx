// src/editor/Editor.tsx
import { useCallback, useEffect, useRef } from 'react';
import grapesjs, { type Editor as GrapesEditor } from 'grapesjs';
import GjsEditor, { Canvas, WithEditor } from '@grapesjs/react';
import mjmlPlugin from 'grapesjs-mjml';

import Topbar from './components/Topbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import { sanitizeMjmlMarkup } from './utils/mjml';

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

    type UnknownComponent = {
      set?: (props: Record<string, unknown>) => void;
      findType?: (type: string) => unknown[];
      append?: (component: unknown, options?: Record<string, unknown>) => unknown;
      move?: (target: unknown, options?: Record<string, unknown>) => unknown;
      components?: () => unknown;
      parent?: () => UnknownComponent | null | undefined;
      get?: (prop: string) => unknown;
      remove?: (options?: Record<string, unknown>) => void;
    };

    let isRestoringMjBody = false;
    let isRoutingComponentIntoBody = false;

    const getComponentType = (component: UnknownComponent | null | undefined) =>
      ((component?.get?.('type') as string | undefined) ??
        (component?.get?.('tagName') as string | undefined) ??
        '').toLowerCase();

    const toComponentArray = (collection: unknown): UnknownComponent[] => {
      if (!collection) {
        return [];
      }

      if (Array.isArray(collection)) {
        return collection as UnknownComponent[];
      }

      if (typeof collection === 'object') {
        const record = collection as Record<string, unknown>;
        const maybeModels = record.models;

        if (Array.isArray(maybeModels)) {
          return maybeModels as UnknownComponent[];
        }

        const maybeToArray = record.toArray as (() => unknown) | undefined;
        if (typeof maybeToArray === 'function') {
          const arrayResult = maybeToArray.call(collection) as unknown;
          if (Array.isArray(arrayResult)) {
            return arrayResult as UnknownComponent[];
          }
        }
      }

      return [];
    };

    const removeIfEmptyDiv = (candidate?: UnknownComponent | null) => {
      if (!candidate) {
        return;
      }

      const type = getComponentType(candidate);
      const tagName = (candidate.get?.('tagName') as string | undefined)?.toLowerCase();

      if (type !== 'div' && tagName !== 'div') {
        return;
      }

      const children = toComponentArray(candidate.components?.());
      if (children.length > 0) {
        return;
      }

      const rawContent = candidate.get?.('content');
      if (typeof rawContent === 'string' && rawContent.trim().length > 0) {
        return;
      }

      if (rawContent && typeof rawContent !== 'string') {
        return;
      }

      candidate.remove?.({ temporary: true });
    };

    const cleanupWrapperChildren = (wrapper?: UnknownComponent | null) => {
      if (!wrapper) {
        return;
      }

      toComponentArray(wrapper.components?.()).forEach(removeIfEmptyDiv);
    };

    const headOnlyComponentTypes = new Set([
      'mj-head',
      'mj-title',
      'mj-preview',
      'mj-style',
      'mj-font',
      'mj-attributes',
      'mj-html',
    ]);

    const lockRootComponents = () => {
      const wrapperComponent = editor.getWrapper() as UnknownComponent | null;

      if (!wrapperComponent) {
        return;
      }

      wrapperComponent.set?.({
        removable: false,
        draggable: false,
        copyable: false,
        badgable: false,
      });

      cleanupWrapperChildren(wrapperComponent);

      const bodyComponents = wrapperComponent.findType?.('mj-body');

      if (!Array.isArray(bodyComponents)) {
        return;
      }

      bodyComponents.forEach((bodyComponent) => {
        (bodyComponent as UnknownComponent).set?.({
          removable: false,
          draggable: false,
        });
      });
    };

    const ensureMjBodyPresence = () => {
      if (isRestoringMjBody || isRoutingComponentIntoBody) {
        return;
      }

      const wrapperComponent = editor.getWrapper() as UnknownComponent | null;

      if (!wrapperComponent) {
        return;
      }

      const existingBodies = wrapperComponent.findType?.('mj-body');

      if (Array.isArray(existingBodies) && existingBodies.length > 0) {
        lockRootComponents();
        return;
      }

      isRestoringMjBody = true;

      try {
        const mjmlComponents = wrapperComponent.findType?.('mjml');
        const mjmlComponent = Array.isArray(mjmlComponents)
          ? (mjmlComponents[0] as UnknownComponent | undefined)
          : undefined;

        if (mjmlComponent && typeof mjmlComponent.append === 'function') {
          mjmlComponent.append({ type: 'mj-body' });
        } else {
          editor.setComponents('<mjml><mj-body></mj-body></mjml>');
        }
      } finally {
        isRestoringMjBody = false;
      }

      lockRootComponents();
    };

    const ensureComponentInMjBody = (component: UnknownComponent) => {
      if (isRestoringMjBody || isRoutingComponentIntoBody) {
        return;
      }

      const componentType = getComponentType(component);

      if (!componentType.startsWith('mj-')) {
        return;
      }

      if (
        componentType === 'mj-body' ||
        componentType === 'mjml' ||
        headOnlyComponentTypes.has(componentType)
      ) {
        return;
      }

      const parentComponent = component.parent?.() ?? null;
      const parentType = getComponentType(parentComponent);
      const isDivUnderRoot =
        parentType === 'div' &&
        (() => {
          const ancestorType = getComponentType(parentComponent?.parent?.() ?? null);
          return ancestorType === 'wrapper' || ancestorType === 'mjml';
        })();

      if (parentType !== 'wrapper' && parentType !== 'mjml' && !isDivUnderRoot) {
        return;
      }

      const wrapperComponent = editor.getWrapper() as UnknownComponent | null;

      if (!wrapperComponent) {
        return;
      }

      let bodyComponents = wrapperComponent.findType?.('mj-body');

      if (!Array.isArray(bodyComponents) || bodyComponents.length === 0) {
        ensureMjBodyPresence();
        bodyComponents = wrapperComponent.findType?.('mj-body');
      }

      if (!Array.isArray(bodyComponents) || bodyComponents.length === 0) {
        return;
      }

      const bodyComponent = bodyComponents[0] as UnknownComponent;

      if (parentComponent === bodyComponent) {
        return;
      }

      const appendFn =
        typeof bodyComponent.append === 'function'
          ? bodyComponent.append.bind(bodyComponent)
          : null;
      const moveFn =
        typeof component.move === 'function' ? component.move.bind(component) : null;

      if (!appendFn && !moveFn) {
        return;
      }

      const bodyCollection = bodyComponent.components?.() as
        | { length?: number }
        | undefined;
      const insertionIndex =
        typeof bodyCollection?.length === 'number' ? bodyCollection.length : undefined;
      const moveOptions =
        typeof insertionIndex === 'number' ? { at: insertionIndex } : undefined;

      isRoutingComponentIntoBody = true;

      try {
        if (moveFn) {
          moveFn(bodyComponent, moveOptions);
        } else if (appendFn) {
          if (typeof component.remove === 'function') {
            component.remove({ temporary: true });
          }

          if (typeof insertionIndex === 'number') {
            appendFn(component, {
              at: insertionIndex,
            });
          } else {
            appendFn(component);
          }
        }
      } finally {
        isRoutingComponentIntoBody = false;
      }

      removeIfEmptyDiv(parentComponent);

    };

    ensureMjBodyPresence();

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

    editor.on('component:remove', ensureMjBodyPresence);
    editor.on('run:core:canvas-clear', () => {
      setTimeout(ensureMjBodyPresence, 0);
    });
    editor.on('component:add', (component) => {
      ensureComponentInMjBody(component as UnknownComponent);
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

    const initialTemplate = [
      '<mjml>',
      '  <mj-body>',
      '    <mj-section>',
      '      <mj-column>',
      '        <mj-text>',
      '          <h1>Welcome to MJML Editor</h1>',
      '          <p>Drag and drop blocks from the left panel to build your email.</p>',
      '        </mj-text>',
      '        <mj-button href="#">',
      '          Click Me',
      '        </mj-button>',
      '      </mj-column>',
      '    </mj-section>',
      '    <mj-section>',
      '      <mj-group>',
      '        <mj-column width="50%">',
      '          <mj-text>',
      '            <p><strong>mj-group Example:</strong> These columns stay side-by-side on mobile!</p>',
      '          </mj-text>',
      '        </mj-column>',
      '        <mj-column width="50%">',
      '          <mj-text>',
      '            <p>Normally columns stack on mobile, but mj-group prevents this.</p>',
      '          </mj-text>',
      '        </mj-column>',
      '      </mj-group>',
      '    </mj-section>',
      '  </mj-body>',
      '</mjml>',
    ].join('\n');

    // Add initial MJML content
    editor.setComponents(sanitizeMjmlMarkup(initialTemplate));

    ensureMjBodyPresence();

    console.log('Available blocks:', editor.BlockManager.getAll().length);
    console.log('Block IDs:', editor.BlockManager.getAll().map((b: { getId: () => string }) => b.getId()));

    // Add mj-group block to the Block Manager
    // mj-group wraps columns to keep them side-by-side on mobile
    const mjGroupBlockMarkup = [
      '<mj-section>',
      '  <mj-group>',
      '    <mj-column width="50%">',
      '      <mj-text>Column 1</mj-text>',
      '    </mj-column>',
      '    <mj-column width="50%">',
      '      <mj-text>Column 2</mj-text>',
      '    </mj-column>',
      '  </mj-group>',
      '</mj-section>',
    ].join('\n');

    editor.BlockManager.add('mj-group', {
      label: 'Group',
      category: 'Basic',
      content: sanitizeMjmlMarkup(mjGroupBlockMarkup),
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
