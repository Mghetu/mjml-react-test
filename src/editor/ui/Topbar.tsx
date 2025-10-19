// src/editor/ui/Topbar.tsx
import { useEffect, useState } from 'react';

import {
  Blocks,
  Code,
  Eye,
  Layers,
  Maximize2,
  Monitor,
  Palette,
  Redo2,
  Smartphone,
  SlidersHorizontal,
  Tablet,
  Trash2,
  Undo2,
} from './icons';

import { useEditorMaybe } from '../hooks/useEditorSafe';

export default function Topbar() {
  const editor = useEditorMaybe();
  const disabled = !editor;
  const [activeDevice, setActiveDevice] = useState<string>('Desktop');

  useEffect(() => {
    if (!editor) return;
    const update = () => setActiveDevice(editor.getDevice());
    update();
    editor.on('change:device', update);
    return () => {
      editor.off('change:device', update);
    };
  }, [editor]);

  // Helpers to run GrapesJS commands safely
  const run = (cmd: string) => editor?.runCommand(cmd);

  const DeviceIcon = {
    Desktop: Monitor,
    Tablet: Tablet,
    'Mobile portrait': Smartphone,
  } as const;

  const devices: Array<{ id: 'Desktop' | 'Tablet' | 'Mobile portrait'; label: string }> = [
    { id: 'Desktop', label: 'Desktop' },
    { id: 'Tablet', label: 'Tablet' },
    { id: 'Mobile portrait', label: 'Mobile' },
  ];

  const utilities = [
    { icon: Blocks, label: 'Blocks', onClick: () => run('open-blocks') },
    { icon: Layers, label: 'Layers', onClick: () => run('open-layers') },
    { icon: Palette, label: 'Styles', onClick: () => run('open-styles') },
    { icon: SlidersHorizontal, label: 'Traits', onClick: () => run('open-traits') },
    { icon: Eye, label: 'Preview', onClick: () => run('core:preview') },
    { icon: Maximize2, label: 'Fullscreen', onClick: () => run('core:fullscreen') },
    { icon: Code, label: 'Code', onClick: () => run('core:open-code') },
    { icon: Trash2, label: 'Clear', onClick: () => run('core:canvas-clear') },
    { icon: Undo2, label: 'Undo', onClick: () => run('core:undo') },
    { icon: Redo2, label: 'Redo', onClick: () => run('core:redo') },
  ];

  return (
    <div className="mjml-topbar">
      <div className="mjml-topbar__section mjml-topbar__section--left">
        <span className="mjml-topbar__brand">MJML Studio</span>
        <span className="mjml-topbar__subtitle">powered by GrapesJS</span>
      </div>

      <div className="mjml-topbar__section mjml-topbar__section--center">
        <div className="mjml-topbar__group mjml-topbar__group--devices" role="group" aria-label="Device preview">
          {devices.map(({ id, label }) => {
            const Icon = DeviceIcon[id];
            const isActive = activeDevice === id;
            return (
              <button
                key={id}
                type="button"
                className="mjml-topbar__button"
                data-active={isActive ? 'true' : undefined}
                aria-pressed={isActive}
                disabled={disabled}
                onClick={() => editor?.setDevice(id)}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mjml-topbar__section mjml-topbar__section--right">
        <div className="mjml-topbar__group mjml-topbar__group--dense" role="group" aria-label="Editor utilities">
          {utilities.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              className="mjml-topbar__button"
              title={label}
              aria-label={label}
              disabled={disabled}
              onClick={onClick}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
