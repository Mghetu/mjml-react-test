// src/editor/components/LayersPanel.tsx
import { useCallback } from 'react';

import GrapesView from './GrapesView';

export default function LayersPanel() {
  const getLayersElement = useCallback((editor: any) => {
    const layersManager = (editor as any).Layers;
    return layersManager?.render() ?? null;
  }, []);

  return (
    <GrapesView className="layers-panel gjs-one-bg gjs-two-color" getElement={getLayersElement} />
  );
}
