// src/editor/ui/LeftSidebar.tsx
import { useState } from 'react';
import BlocksPanel from './BlocksPanel';
import LayersPanel from './LayersPanel';

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'blocks' | 'layers'>('blocks');

  return (
    <aside className="w-64 bg-gray-50 rounded-lg border border-gray-300 flex flex-col overflow-hidden">
      <header className="px-4 py-3 bg-gray-100 border-b border-gray-300">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-gray-600">Navigator</h2>
      </header>

      <nav className="flex gap-1.5 p-2 bg-gray-100 border-b border-gray-300" aria-label="Left sidebar tabs" role="tablist">
        <button
          type="button"
          className={`flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            activeTab === 'blocks'
              ? 'bg-white text-gray-900 border border-gray-400'
              : 'bg-transparent text-gray-600 hover:bg-white/70 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('blocks')}
          role="tab"
          aria-selected={activeTab === 'blocks'}
        >
          Blocks
        </button>
        <button
          type="button"
          className={`flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            activeTab === 'layers'
              ? 'bg-white text-gray-900 border border-gray-400'
              : 'bg-transparent text-gray-600 hover:bg-white/70 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('layers')}
          role="tab"
          aria-selected={activeTab === 'layers'}
        >
          Layers
        </button>
      </nav>

      <div className="flex-1 bg-white overflow-auto" role="tabpanel" aria-live="polite">
        {activeTab === 'blocks' && <BlocksPanel />}
        {activeTab === 'layers' && <LayersPanel />}
      </div>
    </aside>
  );
}
