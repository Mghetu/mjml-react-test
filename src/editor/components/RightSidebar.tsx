// src/editor/components/RightSidebar.tsx
import { useState } from 'react';
import { TraitsProvider, StylesProvider } from '@grapesjs/react';

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState<'traits' | 'styles'>('traits');

  return (
    <div className="right-sidebar">
      <div className="sidebar-header">
        <h3>Properties</h3>
      </div>

      <div className="sidebar-tabs">
        <button
          className={`tab-button ${activeTab === 'traits' ? 'active' : ''}`}
          onClick={() => setActiveTab('traits')}
        >
          Settings
        </button>
        <button
          className={`tab-button ${activeTab === 'styles' ? 'active' : ''}`}
          onClick={() => setActiveTab('styles')}
        >
          Style
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'traits' ? (
          <TraitsProvider>
            {({ Container }) => (
              <div className="traits-container">
                <Container><></></Container>
              </div>
            )}
          </TraitsProvider>
        ) : (
          <StylesProvider>
            {({ Container }) => (
              <div className="styles-container">
                <Container><></></Container>
              </div>
            )}
          </StylesProvider>
        )}
      </div>
    </div>
  );
}
