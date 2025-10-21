# Project Context: MJML React Editor

## Overview
This project is a React + TypeScript single-page application that wraps the [GrapesJS](https://grapesjs.com/) visual editor with the [grapesjs-mjml](https://github.com/GrapesJS/grapesjs-mjml) plugin to provide a drag-and-drop MJML email builder. The UI is composed with the `@grapesjs/react` bindings, which expose React-friendly providers for the GrapesJS editor, block manager, layer tree, trait controls, and style manager.

The entry point (`src/main.tsx`) renders the `App` component, which simply mounts the custom `Editor` experience. The `Editor` component initializes GrapesJS, seeds a starter MJML template, and arranges the custom React layout around the GrapesJS canvas. Styling is handled through a bespoke CSS file (`src/editor/editor.css`).

## Key Modules
- **`src/editor/Editor.tsx`**: Configures the GrapesJS instance with the MJML plugin, disables persistent storage, and registers the initial MJML scaffold that appears when the editor loads. It also exposes the editor instance on `window.editor` for debugging and composes the overall layout (top bar, sidebars, canvas).
- **`src/editor/components/Topbar.tsx`**: Provides device preview toggles and editor action buttons (preview, fullscreen, code view, undo, redo) by calling `editor.setDevice` and `editor.runCommand` from the GrapesJS API via the `useEditor` hook.
- **`src/editor/components/LeftSidebar.tsx`**: Offers a tabbed interface that switches between the Blocks and Layers panels.
  - **`BlocksPanel.tsx`**: Uses `BlocksProvider` to iterate over MJML blocks registered by the plugin, rendering them as draggable items that invoke `dragStart`/`dragStop` handlers supplied by GrapesJS.
  - **`LayersPanel.tsx`**: Uses `LayersProvider` to expose the GrapesJS layer tree (DOM-like component hierarchy). The current implementation simply confirms when layers are available, leaving room for richer tree rendering.
- **`src/editor/components/RightSidebar.tsx`**: Implements tabs for Traits (component properties) and Styles. It leverages `TraitsProvider` and `StylesProvider` containers to render the default GrapesJS controls inside a custom-styled panel.
- **`src/editor/editor.css`**: Defines the visual theme for the editor chrome—top bar, sidebars, blocks, and canvas—while relying on GrapesJS default styles for the inner editing experience.

## Runtime Behavior
1. When `Editor` mounts, GrapesJS initializes with full viewport height. Storage is disabled, so changes exist only for the session.
2. The MJML plugin registers a library of email blocks (sections, columns, buttons, etc.). These appear in the Blocks tab and can be dragged onto the canvas. The plugin also ensures MJML output is generated from the canvas DOM.
3. The starter MJML template (welcome message with button) is injected via `editor.setComponents`, giving users immediate content to modify.
4. The `Canvas` component from `@grapesjs/react` renders the live editable MJML design. Device buttons toggle GrapesJS' built-in responsive previews.
5. Traits and Styles tabs display GrapesJS-provided inspectors for the currently selected component, allowing property and CSS tweaks.

## Extensibility Notes
- **Custom blocks**: Extend the MJML block palette by registering new blocks in the `onEditor` callback before calling `setComponents`.
- **Persistence**: Enable a storage manager (e.g., local storage, remote APIs) via the `storageManager` option in `Editor.tsx` to retain user designs.
- **Layer tree**: Enhance `LayersPanel` to render nested `Layer` components from the provider for more granular structure control.
- **Traits/Styles UI**: Replace the placeholder `<div>` elements inside the provider containers with custom renderers if you need bespoke property editors.

## Development Workflow
- Install dependencies with `npm install` (already captured via `package-lock.json`).
- Launch the dev server using `npm run dev` to interact with the MJML editor in the browser.
- Linting and formatting follow the standard Vite React TypeScript template conventions; adjust `eslint.config.js` as necessary for stricter rules.

This context should help contributors quickly orient themselves around the GrapesJS-based MJML editor architecture and identify extension points for future enhancements.
