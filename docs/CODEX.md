# Codex Guidance
- Build a Vite + React + TypeScript app that runs entirely in the browser.
- Use @grapesjs/react + grapesjs-mjml for the editor.
- LocalStorage for persistence (compressed with lz-string).
- Assets must be data URIs (offline).
- Compile MJML→HTML using mjml-browser in a Web Worker.
- Target Outlook 365 OWA, Outlook Desktop (Win), Outlook for Mac, Outlook iOS.
- Prefer MJML attributes over CSS; avoid shorthand; constrain <img> width.
- No servers, no external APIs. Deploy via GitHub Pages.
