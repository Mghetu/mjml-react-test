// src/editor/ui/LeftSidebar.tsx
import React, { useState } from 'react';
import BlocksPanel from './BlocksPanel';
import LayersPanel from './LayersPanel';

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'blocks' | 'layers'>('blocks');

  return (
    <aside className="h-full w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
      {/* Tabs Header */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'blocks'
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500'
          }`}
          onClick={() => setActiveTab('blocks')}
        >
          Blocks
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'layers'
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500'
          }`}
          onClick={() => setActiveTab('layers')}
        >
          Layers
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'blocks' && <BlocksPanel />}
        {activeTab === 'layers' && <LayersPanel />}
      </div>
    </aside>
  );
}
