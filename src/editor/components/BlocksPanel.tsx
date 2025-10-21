// src/editor/components/BlocksPanel.tsx
import { BlocksProvider } from '@grapesjs/react';

export default function BlocksPanel() {
  return (
    <div className="blocks-panel">
      <BlocksProvider>
        {({ mapCategoryBlocks, dragStart, dragStop }) => (
          <div className="blocks-container">
            {Array.from(mapCategoryBlocks.keys()).map((category) => (
              <div key={category} className="block-category">
                <div className="blocks-grid">
                  {mapCategoryBlocks.get(category)!.map((block) => (
                    <div
                      key={block.getId()}
                      className="block-item"
                      draggable
                      onDragStart={(ev) => dragStart(block, ev.nativeEvent)}
                      onDragEnd={() => dragStop(false)}
                    >
                      <div
                        className="block-content"
                        dangerouslySetInnerHTML={{ __html: block.getMedia() || '' }}
                      />
                      <div className="block-label">{block.getLabel()}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </BlocksProvider>
    </div>
  );
}
