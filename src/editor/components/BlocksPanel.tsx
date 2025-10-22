// src/editor/components/BlocksPanel.tsx
import { BlocksProvider } from '@grapesjs/react';

const resolveCategoryLabel = (category: unknown) => {
  if (!category) {
    return 'General';
  }

  if (typeof category === 'string') {
    return category;
  }

  if (typeof category === 'object') {
    const typedCategory = category as {
      getLabel?: () => unknown;
      get?: (key: string) => unknown;
      label?: unknown;
    };

    const labelCandidate =
      typedCategory.getLabel?.() ??
      typedCategory.get?.('label') ??
      typedCategory.label;

    if (typeof labelCandidate === 'string' && labelCandidate.trim()) {
      return labelCandidate;
    }
  }

  return 'General';
};

const resolveCategoryId = (category: unknown) => {
  if (!category) {
    return 'default-category';
  }

  if (typeof category === 'string') {
    return category;
  }

  if (typeof category === 'object') {
    const typedCategory = category as {
      getId?: () => unknown;
      get?: (key: string) => unknown;
      id?: unknown;
    };

    const idCandidate =
      typedCategory.getId?.() ?? typedCategory.get?.('id') ?? typedCategory.id;

    if (typeof idCandidate === 'string' && idCandidate.trim()) {
      return idCandidate;
    }
  }

  const fallbackLabel = resolveCategoryLabel(category);
  return fallbackLabel.toLowerCase().replace(/\s+/g, '-');
};

export default function BlocksPanel() {
  return (
    <div className="blocks-panel gjs-one-bg gjs-two-color">
      <BlocksProvider>
        {({ mapCategoryBlocks, dragStart, dragStop }) => (
          <div className="blocks-container">
            {Array.from(mapCategoryBlocks.entries()).map(([category, blocks]) => {
              const categoryId = resolveCategoryId(category);
              const categoryLabel = resolveCategoryLabel(category);

              return (
                <div key={categoryId} className="block-category">
                  <div className="block-category-header">{categoryLabel}</div>
                  <div className="blocks-grid">
                    {blocks.map((block, index) => {
                      const rawBlockId =
                        typeof block.getId === 'function'
                          ? block.getId()
                          : (block as { id?: string }).id;
                      const safeBlockId =
                        typeof rawBlockId === 'string' && rawBlockId.trim()
                          ? rawBlockId
                          : (block as { cid?: string }).cid ?? `block-${index}`;
                      const isMjGroup = safeBlockId === 'mj-group';

                      return (
                        <div
                          key={safeBlockId}
                          className={`block-item ${
                            isMjGroup ? 'block-item--mj-group' : ''
                          }`}
                          draggable
                          onDragStart={(ev) => dragStart(block, ev.nativeEvent)}
                          onDragEnd={() => dragStop(false)}
                        >
                          <div
                            className="block-content"
                            dangerouslySetInnerHTML={{ __html: block.getMedia() || '' }}
                          />
                          <div className="block-label">
                            {block.getLabel()}
                            {isMjGroup ? (
                              <span className="block-label-badge" aria-hidden="true">
                                GROUP
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BlocksProvider>
    </div>
  );
}
