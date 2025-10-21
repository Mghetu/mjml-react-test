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
    <div className="flex items-center justify-between gap-3 px-4 h-12 bg-gray-800 border-b border-gray-900 text-gray-100">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="font-semibold tracking-wider text-sm uppercase">MJML Studio</span>
        <span className="text-xs opacity-65 tracking-wider uppercase">powered by GrapesJS</span>
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="inline-flex items-center gap-1 p-0.5 rounded bg-gray-700 border border-gray-900" role="group" aria-label="Device preview">
          {devices.map(({ id, label }) => {
            const Icon = DeviceIcon[id];
            const isActive = activeDevice === id;
            return (
              <button
                key={id}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gray-600 text-white'
                    : 'bg-transparent text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }`}
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

      <div className="flex items-center justify-end gap-0.5 flex-1" role="group" aria-label="Editor utilities">
        {utilities.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            type="button"
            className="inline-flex items-center justify-center p-1.5 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title={label}
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
