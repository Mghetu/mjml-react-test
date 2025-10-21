// src/editor/ui/RightSidebar.tsx
import { useState } from 'react';
import { TraitsProvider, StylesProvider } from '@grapesjs/react';

export default function RightSidebar() {
  const [tab, setTab] = useState<'traits' | 'styles'>('traits');

  return (
    <aside className="w-80 bg-gray-50 rounded-lg border border-gray-300 flex flex-col overflow-hidden">
      <header className="px-4 py-3 bg-gray-100 border-b border-gray-300">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-gray-600">Inspector</h2>
      </header>

      <nav className="flex gap-1.5 p-2 bg-gray-100 border-b border-gray-300" aria-label="Inspector tabs" role="tablist">
        <button
          type="button"
          className={`flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            tab === 'traits'
              ? 'bg-white text-gray-900 border border-gray-400'
              : 'bg-transparent text-gray-600 hover:bg-white/70 hover:text-gray-900'
          }`}
          onClick={() => setTab('traits')}
          role="tab"
          aria-selected={tab === 'traits'}
        >
          Traits
        </button>
        <button
          type="button"
          className={`flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            tab === 'styles'
              ? 'bg-white text-gray-900 border border-gray-400'
              : 'bg-transparent text-gray-600 hover:bg-white/70 hover:text-gray-900'
          }`}
          onClick={() => setTab('styles')}
          role="tab"
          aria-selected={tab === 'styles'}
        >
          Styles
        </button>
      </nav>

      <div className="flex-1 bg-white overflow-auto">
        <div
          className={`p-3 ${tab === 'traits' ? 'block' : 'hidden'}`}
          role="tabpanel"
          aria-hidden={tab !== 'traits'}
        >
          <TraitsProvider>
            {({ Container }) => <Container><></></Container>}
          </TraitsProvider>
        </div>
        <div
          className={`p-3 ${tab === 'styles' ? 'block' : 'hidden'}`}
          role="tabpanel"
          aria-hidden={tab !== 'styles'}
        >
          <StylesProvider>
            {({ Container }) => <Container><></></Container>}
          </StylesProvider>
        </div>
      </div>
    </aside>
  );
}
