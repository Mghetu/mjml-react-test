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
2. Start the MJML conversion API (separate terminal):
   ```bash
   npm run server
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the provided localhost URL in your browser to interact with the editor. Requests to `/api/convert-mjml` are proxied to the local MJML server running on port 3001 during development.

## MJML Conversion API
- **Endpoint:** `POST /api/convert-mjml`
- **Request body:** `{ "mjml": "<mjml markup>" }`
- **Success response:** `{ "html": "<compiled html>" }`
- **Validation errors:** Responds with HTTP 400 and `{ "errors": [...] }`.

The server processes MJML in-memory only and does not persist email content.

### What the Convert button sends
- The **Convert MJML to HTML** button in the Templates panel sends the MJML currently on the canvas (via `editor.getHtml()`); no local files are read unless you explicitly import an MJML file first.
- Use **Import MJML Template** if you want to load a local `.mjml` file into the canvas, then press **Convert** to export its compiled HTML.

## Development Notes
- The GrapesJS storage manager is disabled; designs persist only for the active session. Configure `storageManager` in `src/editor/Editor.tsx` to enable persistence.
- Blocks, traits, and styles are rendered via providers from `@grapesjs/react`. Customize these components to extend the editor experience.
- ESLint and TypeScript settings follow the default Vite template. Update `eslint.config.js` and the `tsconfig` files as needed for your tooling preferences.
