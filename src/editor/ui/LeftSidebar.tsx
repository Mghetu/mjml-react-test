// src/editor/ui/LeftSidebar.tsx
import { useState } from 'react';

import BlocksPanel from './BlocksPanel';
import LayersPanel from './LayersPanel';

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'blocks' | 'layers'>('blocks');

  return (
    <aside className="mjml-left">
      <header className="mjml-panel-header">
        <h2 className="mjml-panel-heading">Navigator</h2>
      </header>

      <nav className="mjml-panel-tabs" aria-label="Left sidebar tabs" role="tablist">
        <button
          type="button"
          className={`mjml-panel-tab ${activeTab === 'blocks' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('blocks')}
          role="tab"
          aria-selected={activeTab === 'blocks'}
        >
          Blocks
        </button>
        <button
          type="button"
          className={`mjml-panel-tab ${activeTab === 'layers' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('layers')}
          role="tab"
          aria-selected={activeTab === 'layers'}
        >
          Layers
        </button>
      </nav>

      <div className="mjml-panel-scroll" role="tabpanel" aria-live="polite">
        {activeTab === 'blocks' && <BlocksPanel />}
        {activeTab === 'layers' && <LayersPanel />}
      </div>
    </aside>
  );
}
