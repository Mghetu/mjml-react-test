// src/editor/ui/Topbar.tsx
import { useEditorMaybe } from '../hooks/useEditorSafe';

export default function Topbar() {
  const editor = useEditorMaybe();
  const disabled = !editor;

  // Helpers to run GrapesJS commands safely
  const run = (cmd: string) => editor?.runCommand(cmd);

  return (
    <div className="mjml-topbar">
      <div className="mjml-topbar-left">
        <strong>MJML Studio</strong>
      </div>
      <div className="mjml-topbar-center">
        {/* Device buttons (already implemented) */}
        <button disabled={disabled} onClick={() => editor?.setDevice('Desktop')}>
          Desktop
        </button>
        <button disabled={disabled} onClick={() => editor?.setDevice('Tablet')}>
          Tablet
        </button>
        <button disabled={disabled} onClick={() => editor?.setDevice('Mobile portrait')}>
          Mobile
        </button>
      </div>
      <div className="mjml-topbar-right">
        {/* Utility buttons */}
        <button disabled={disabled} onClick={() => run('open-blocks')}>
          Blocks
        </button>
        <button disabled={disabled} onClick={() => run('open-layers')}>
          Layers
        </button>
        <button disabled={disabled} onClick={() => run('open-styles')}>
          Styles
        </button>
        <button disabled={disabled} onClick={() => run('open-traits')}>
          Traits
        </button>
        <button disabled={disabled} onClick={() => run('core:preview')}>
          Preview
        </button>
        <button disabled={disabled} onClick={() => run('core:fullscreen')}>
          Fullscreen
        </button>
        <button disabled={disabled} onClick={() => run('core:open-code')}>
          Code
        </button>
        <button disabled={disabled} onClick={() => run('core:canvas-clear')}>
          Clear
        </button>
        <button disabled={disabled} onClick={() => run('core:undo')}>
          Undo
        </button>
        <button disabled={disabled} onClick={() => run('core:redo')}>
          Redo
        </button>
      </div>
    </div>
  );
}
