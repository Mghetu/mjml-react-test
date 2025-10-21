// src/editor/ui/BlocksPanel.tsx
import { BlocksProvider } from '@grapesjs/react';

export default function BlocksPanel() {
  return (
    <div className="p-3">
      <BlocksProvider>
        {({ Container }) => <Container><></></Container>}
      </BlocksProvider>
    </div>
  );
}
