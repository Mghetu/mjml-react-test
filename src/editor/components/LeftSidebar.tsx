// src/editor/components/LeftSidebar.tsx
import { useState } from 'react';
import BlocksPanel from './BlocksPanel';
import LayersPanel from './LayersPanel';

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'blocks' | 'layers'>('blocks');

  return (
    <div className="left-sidebar gjs-one-bg gjs-two-color">
      <div className="sidebar-header gjs-one-bg gjs-two-color">
        <h3>Components</h3>
      </div>

      <div className="sidebar-tabs gjs-one-bg gjs-two-color">
        <button
          className={`tab-button gjs-btn ${activeTab === 'blocks' ? 'active' : ''}`}
          onClick={() => setActiveTab('blocks')}
        >
          Blocks
        </button>
        <button
          className={`tab-button gjs-btn ${activeTab === 'layers' ? 'active' : ''}`}
          onClick={() => setActiveTab('layers')}
        >
          Layers
        </button>
      </div>

      <div className="sidebar-content gjs-one-bg gjs-two-color">
        {activeTab === 'blocks' ? <BlocksPanel /> : <LayersPanel />}
      </div>
    </div>
  );
}
