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

        // Disable default UI panels; we use React Providers for custom UI
        panels: { defaults: [] },

        plugins: [mjmlPlugin],
      }}
      onEditor={(editor) => {
        (window as any).gjs = editor;

        // Remove default device panel/buttons (we have custom ones in Topbar)
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

        // Seed with a valid MJML skeleton
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

        // Set minimum canvas height for better UX
        const iframe = editor.Canvas.getFrameEl();
        if (iframe) {
          iframe.style.minHeight = "800px";
        }

        // Auto-select first text element to populate Traits/Styles
        const wrapper = editor.getWrapper();
        if (wrapper) {
          const first = wrapper.find("mj-text")[0] ?? wrapper.find("*")[0];
          if (first) editor.select(first);
        }

        // Set initial device and refresh
        editor.setDevice("Desktop");
        editor.refresh();
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
