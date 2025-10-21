// src/editor/components/LeftSidebar.tsx
import { useState } from 'react';
import BlocksPanel from './BlocksPanel';
import LayersPanel from './LayersPanel';

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'blocks' | 'layers'>('blocks');

  return (
    <div className="left-sidebar">
      <div className="sidebar-header">
        <h3>Components</h3>
      </div>

      <div className="sidebar-tabs">
        <button
          className={`tab-button ${activeTab === 'blocks' ? 'active' : ''}`}
          onClick={() => setActiveTab('blocks')}
        >
          Blocks
        </button>
        <button
          className={`tab-button ${activeTab === 'layers' ? 'active' : ''}`}
          onClick={() => setActiveTab('layers')}
        >
          Layers
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'blocks' ? <BlocksPanel /> : <LayersPanel />}
      </div>
    </div>
  );
}
