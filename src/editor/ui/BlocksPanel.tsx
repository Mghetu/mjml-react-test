// src/editor/ui/BlocksPanel.tsx
import { BlocksProvider } from '@grapesjs/react';

export default function BlocksPanel() {
  return (
    <div className="mjml-panel-content">
      <BlocksProvider>
        {({ Container }) => <Container><></></Container>}
      </BlocksProvider>
    </div>
  );
}
