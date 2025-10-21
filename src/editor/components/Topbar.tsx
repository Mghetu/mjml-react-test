// src/editor/components/Topbar.tsx
import { useEffect, useState } from 'react';
import { useEditor } from '@grapesjs/react';

export default function Topbar() {
  const editor = useEditor();
  const [outlineActive, setOutlineActive] = useState(false);

  const devices = [
    { id: 'Desktop', name: 'Desktop', icon: '🖥️' },
    { id: 'Tablet', name: 'Tablet', icon: '📱' },
    { id: 'Mobile portrait', name: 'Mobile', icon: '📱' },
  ];

  const actions = [
    { command: 'core:preview', icon: '👁️', label: 'Preview' },
    { command: 'core:fullscreen', icon: '⛶', label: 'Fullscreen' },
    { command: 'core:open-code', icon: '</>', label: 'Code' },
    { command: 'core:undo', icon: '↶', label: 'Undo' },
    { command: 'core:redo', icon: '↷', label: 'Redo' },
  ];

  useEffect(() => {
    if (!editor) {
      return;
    }

    const outlineCommand = 'core:component-outline';
    const commands = editor.Commands;

    setOutlineActive(commands.isActive(outlineCommand));

    const handleRun = () => setOutlineActive(true);
    const handleStop = () => setOutlineActive(false);

    editor.on(`run:${outlineCommand}`, handleRun);
    editor.on(`stop:${outlineCommand}`, handleStop);

    return () => {
      editor.off(`run:${outlineCommand}`, handleRun);
      editor.off(`stop:${outlineCommand}`, handleStop);
    };
  }, [editor]);

  const runCommand = (command: string) => {
    editor.runCommand(command);
  };

  const setDevice = (deviceId: string) => {
    editor.setDevice(deviceId);
  };

  const toggleOutline = () => {
    const outlineCommand = 'core:component-outline';
    const commands = editor.Commands;

    if (commands.isActive(outlineCommand)) {
      editor.stopCommand(outlineCommand);
    } else {
      editor.runCommand(outlineCommand);
    }
  };

  return (
    <div className="topbar gjs-one-bg gjs-two-color">
      <div className="topbar-section">
        <h1 className="editor-title">MJML Email Editor</h1>
      </div>

      <div className="topbar-section topbar-center">
        <div className="device-buttons">
          {devices.map((device) => (
            <button
              key={device.id}
              className="device-button"
              onClick={() => setDevice(device.id)}
              title={device.name}
            >
              <span className="device-icon">{device.icon}</span>
              <span className="device-label">{device.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="topbar-section">
        <div className="action-buttons">
          <button
            className={`action-button ${outlineActive ? 'active' : ''}`}
            onClick={toggleOutline}
            title={outlineActive ? 'Hide component outline' : 'View component outline'}
          >
            🔳
          </button>
          {actions.map((action) => (
            <button
              key={action.command}
              className="action-button"
              onClick={() => runCommand(action.command)}
              title={action.label}
            >
              {action.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
