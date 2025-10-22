// src/editor/components/LayersPanel.tsx
import { useCallback } from 'react';
import type { Editor as GrapesEditor } from 'grapesjs';

import GrapesView from './GrapesView';

type LayersModule = {
  render?: () => HTMLElement | null;
} | null;

const getRenderedLayers = (manager: LayersModule | undefined | null) => {
  if (!manager) {
    return null;
  }

  return typeof manager.render === 'function' ? manager.render() : null;
};

export default function LayersPanel() {
  const getLayersElement = useCallback((editor: GrapesEditor | null) => {
    const layersManager = (editor?.LayerManager ?? editor?.Layers) as LayersModule;
    return getRenderedLayers(layersManager);
  }, []);

  return (
    <GrapesView className="layers-panel gjs-one-bg gjs-two-color" getElement={getLayersElement} />
  );
}
