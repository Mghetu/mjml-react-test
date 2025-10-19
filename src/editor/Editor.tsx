// src/editor/Editor.tsx
import grapesjs from 'grapesjs';
import GjsEditor, { Canvas } from '@grapesjs/react';
import mjmlPlugin from 'grapesjs-mjml';

import Topbar from './ui/Topbar';
import LeftSidebar from './ui/LeftSidebar';
import RightSidebar from './ui/RightSidebar';

import 'grapesjs/dist/css/grapes.min.css';
import './editor.css';

export default function Editor() {
  return (
    <GjsEditor
      grapesjs={grapesjs}
      options={{
        height: "100vh",
        storageManager: false,

        deviceManager: {
          devices: [
            { id: "Desktop", name: "Desktop", width: "" },
            { id: "Tablet", name: "Tablet", width: "768px" },
            { id: "Mobile portrait", name: "Mobile portrait", width: "375px" },
          ],
        },

        // Disable default UI panels; we'll render our own shell
        panels: { defaults: [] },

        // Mount official UIs into our custom containers
        blockManager: { appendTo: "#mjml-blocks" },
        layerManager: { appendTo: "#mjml-layers" },
        traitManager: { appendTo: "#mjml-traits" },
        styleManager: { appendTo: "#mjml-styles" },

        plugins: [mjmlPlugin],
      }}
      onEditor={(editor) => {
        (window as any).gjs = editor;

        // Remove any sneaky device panel/buttons
        try {
          const pn = editor.Panels;
          pn.removePanel("devices-c");
          [
            "set-device-desktop",
            "set-device-tablet",
            "set-device-mobile",
          ].forEach((id) => {
            try {
              pn.removeButton("devices-c", id);
            } catch {}
          });
        } catch {}

        // 1) SEED: force a valid MJML skeleton every load
        editor.setComponents(
          `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>Start editing…</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `.trim()
        );

        // 2) Defer manager renders so our containers (#mjml-*) are in the DOM
        //    and the canvas has computed layout
        const renderManagers = () => {
          editor.BlockManager.render();
          editor.LayerManager.render();
          editor.TraitManager.render();
          editor.StyleManager.render();
        };

        // Use a double raf to let React mount the sidebars, then render managers
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            renderManagers();

            // 3) FORCE CANVAS DIMENSIONS: make sure the frame has height
            const iframe = editor.Canvas.getFrameEl();
            if (iframe) {
              // minimum visible area so you immediately see content
              iframe.style.minHeight = "800px";
            }

            // 4) Select something so Traits/Styles populate
            const wrapper = editor.getWrapper();
            if (!wrapper) return;

            const first = wrapper.find("mj-text")[0] ?? wrapper.find("*")[0];
            if (first) editor.select(first);

            // 5) Device + refresh to recalc sizes
            editor.setDevice("Desktop");
            editor.refresh();
          });
        });
      }}
    >
      <div className="editor-shell">
        <Topbar />
        <div className="editor-body">
          <LeftSidebar />
          <div className="canvas-wrap">
            <Canvas />
          </div>
          <RightSidebar />
        </div>
      </div>
    </GjsEditor>
  );
}
