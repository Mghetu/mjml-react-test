// src/editor/components/Topbar.tsx
import { useEditor } from '@grapesjs/react';

export default function Topbar() {
  const editor = useEditor();

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

  const runCommand = (command: string) => {
    editor.runCommand(command);
  };

  const setDevice = (deviceId: string) => {
    editor.setDevice(deviceId);
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
