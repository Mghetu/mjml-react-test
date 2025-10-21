// src/editor/components/RightSidebar.tsx
import { useCallback, useState } from 'react';

import GrapesView from './GrapesView';

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState<'traits' | 'styles'>('traits');

  const getTraitsElement = useCallback((editor: any) => {
    const traitManager = (editor as any).TraitManager;
    return traitManager?.render() ?? null;
  }, []);

  const getStylesElement = useCallback((editor: any) => {
    const styleManager = (editor as any).StyleManager;
    return styleManager?.render() ?? null;
  }, []);

  return (
    <div className="right-sidebar gjs-one-bg gjs-two-color">
      <div className="sidebar-header gjs-one-bg gjs-two-color">
        <h3>Properties</h3>
      </div>

      <div className="sidebar-tabs gjs-one-bg gjs-two-color">
        <button
          className={`tab-button gjs-btn ${activeTab === 'traits' ? 'active' : ''}`}
          onClick={() => setActiveTab('traits')}
        >
          Settings
        </button>
        <button
          className={`tab-button gjs-btn ${activeTab === 'styles' ? 'active' : ''}`}
          onClick={() => setActiveTab('styles')}
        >
          Style
        </button>
      </div>

      <div className="sidebar-content gjs-one-bg gjs-two-color">
        <GrapesView
          isVisible={activeTab === 'traits'}
          className="traits-panel gjs-one-bg gjs-two-color"
          getElement={getTraitsElement}
        />
        <GrapesView
          isVisible={activeTab === 'styles'}
          className="style-manager-panel gjs-one-bg gjs-two-color"
          getElement={getStylesElement}
        />
      </div>
    </div>
  );
}
