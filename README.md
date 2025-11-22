# MJML React Editor

A React + TypeScript application that embeds the [GrapesJS](https://grapesjs.com/) visual editor with the [grapesjs-mjml](https://github.com/GrapesJS/grapesjs-mjml) plugin to build responsive MJML email templates through a drag-and-drop interface. The UI is composed with the `@grapesjs/react` bindings to provide a React-friendly layout around the GrapesJS canvas.

## Features
- **Custom editor chrome** with a top bar, block/layer sidebar, and properties panel styled via `src/editor/editor.css`.
- **MJML block library** supplied by `grapesjs-mjml`, exposed through a draggable Blocks panel.
- **Responsive previews** toggled from the device buttons in the top bar.
- **Traits and styles inspectors** rendered through the GrapesJS React providers.
- **Starter template** injected on load to demonstrate MJML structure and interactions.

## Project Structure
```
src/
├── App.tsx             # Mounts the editor experience
├── editor/
│   ├── Editor.tsx      # Configures GrapesJS and composes the layout
│   ├── components/     # Topbar, sidebars, blocks, layers, and property panels
│   └── editor.css      # Visual styling for the editor shell
├── index.css           # Base styles for the application
└── main.tsx            # React entry point
```

Additional architectural details and extension ideas are documented in [`docs/CONTEXT.md`](docs/CONTEXT.md).

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the provided localhost URL in your browser to interact with the editor.

## Editing text with the TipTap modal

The inline GrapesJS RTE is disabled for `mj-text` and `text` components. Use the TipTap modal instead:

1. **Open the modal**
   - Double-click an `mj-text` (or plain text) block in the canvas, **or**
   - Use the command palette/toolbar action if wired to `open-tiptap-modal`.
2. **Edit content**
   - Format with bold, italic, bullet list, and links.
   - Keyboard shortcuts like **Ctrl/Cmd+B** and **Ctrl/Cmd+I** work.
3. **Save or cancel**
   - Click **Save** to write the edited HTML back to the selected component.
   - Click **Cancel** (or close the modal) to discard changes.

## Development Notes
- The GrapesJS storage manager is disabled; designs persist only for the active session. Configure `storageManager` in `src/editor/Editor.tsx` to enable persistence.
- Blocks, traits, and styles are rendered via providers from `@grapesjs/react`. Customize these components to extend the editor experience.
- ESLint and TypeScript settings follow the default Vite template. Update `eslint.config.js` and the `tsconfig` files as needed for your tooling preferences.
