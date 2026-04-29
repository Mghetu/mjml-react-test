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

### Netlify (with Tinify image compression)

The HTML export endpoint is implemented as a Netlify Function at `/api/convert-mjml`.

1. Set the Tinify API key in Netlify:
   - Variable name: `TINIFY_API_KEY`
2. Set access-control variables in Netlify:
   - `APP_ACCESS_PASSWORD`: shared password required by the login screen
   - `SESSION_SECRET`: long random secret used to sign auth cookies
3. Run the app locally with Netlify Functions:
   ```bash
   npm run dev:netlify
   ```
4. For deployment, connect the repo in Netlify. Build settings are defined in `netlify.toml`.

### Shared MJML templates (Netlify Blobs)

The editor now includes a `Select templates` action that loads shared templates for all users.

- `GET /api/templates` returns the templates manifest.
- `GET /api/templates/:id` returns template MJML content.
- `POST /api/templates/upsert` creates or updates a template (admin token required).
- `POST /api/templates/delete` deletes a template (admin token required).

Example update request:

```bash
curl -X POST "https://<your-site>.netlify.app/api/templates/upsert" \
  -H "Content-Type: application/json" \
  -H "x-admin-token: <APP_ACCESS_PASSWORD>" \
  -d '{
    "id": "marketing-eminence-newsletter-ro",
    "name": "Marketing Eminence Newsletter RO",
    "description": "Romanian monthly marketing newsletter",
    "mjml": "<mjml><mj-body><mj-section><mj-column><mj-text>Hello</mj-text></mj-column></mj-section></mj-body></mjml>"
  }'
```

## Development Notes
- The GrapesJS storage manager is disabled; designs persist only for the active session. Configure `storageManager` in `src/editor/Editor.tsx` to enable persistence.
- Blocks, traits, and styles are rendered via providers from `@grapesjs/react`. Customize these components to extend the editor experience.
- ESLint and TypeScript settings follow the default Vite template. Update `eslint.config.js` and the `tsconfig` files as needed for your tooling preferences.
- MJML → HTML conversion now runs server-side in Netlify Functions so uploaded inline images can be compressed via Tinify before download.
