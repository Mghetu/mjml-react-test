// src/editor/components/LayersPanel.tsx
import { LayersProvider } from '@grapesjs/react';

export default function LayersPanel() {
  return (
    <div className="layers-panel">
      <LayersProvider>
        {({ root, Container }) => (
          <div className="layers-container">
            <Container>
              {root && <div>Layers loaded</div>}
            </Container>
          </div>
        )}
      </LayersProvider>
    </div>
  );
}
