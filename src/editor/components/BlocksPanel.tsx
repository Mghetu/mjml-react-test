// src/editor/components/BlocksPanel.tsx
import { useCallback, useEffect, useState } from 'react';
import { BlocksProvider } from '@grapesjs/react';

type BlockCategoryModel = {
  getId?: () => unknown;
  getLabel?: () => unknown;
  get?: (key: string) => unknown;
  set?: (key: string, value: unknown) => void;
  on?: (event: string, callback: (...args: unknown[]) => void) => void;
  off?: (event: string, callback: (...args: unknown[]) => void) => void;
  label?: unknown;
  id?: unknown;
  open?: unknown;
  [key: string]: unknown;
};

type BlocksProviderRenderProps = {
  mapCategoryBlocks: Map<unknown, any[]>;
  dragStart: (block: any, event?: Event) => void;
  dragStop: (cancel?: boolean) => void;
};

const isCategoryModel = (category: unknown): category is BlockCategoryModel =>
  Boolean(category && typeof category === 'object');

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

const resolveCategoryOpenState = (category: unknown) => {
  if (!isCategoryModel(category)) {
    return true;
  }

  const openFromGetter = category.get?.('open');
  if (typeof openFromGetter === 'boolean') {
    return openFromGetter;
  }

  if (typeof category.open === 'boolean') {
    return category.open;
  }

  return true;
};

const BlocksPanelContent = ({ mapCategoryBlocks, dragStart, dragStop }: BlocksProviderRenderProps) => {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const disposers: Array<() => void> = [];

    mapCategoryBlocks.forEach((_, category) => {
      if (!isCategoryModel(category)) {
        return;
      }

      if (typeof category.on !== 'function') {
        return;
      }

      const handler = () => {
        forceRender((count) => count + 1);
      };

      category.on('change:open', handler);

      disposers.push(() => {
        category.off?.('change:open', handler);
      });
    });

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [mapCategoryBlocks, forceRender]);

  const handleCategoryToggle = useCallback(
    (category: unknown) => {
      const isOpen = resolveCategoryOpenState(category);

      if (isCategoryModel(category) && typeof category.set === 'function') {
        category.set('open', !isOpen);
        return;
      }

      // Fallback for unexpected category shapes.
      forceRender((count) => count + 1);
    },
    [forceRender],
  );

  return (
    <div className="blocks-container">
      {Array.from(mapCategoryBlocks.entries()).map(([category, blocks]) => {
        const categoryId = resolveCategoryId(category);
        const categoryLabel = resolveCategoryLabel(category);
        const categoryOpen = resolveCategoryOpenState(category);
        const categoryClassName = `block-category ${
          categoryOpen ? 'block-category--open' : 'block-category--collapsed'
        }`;
        const panelId = `block-category-panel-${categoryId}`;

        return (
          <div key={categoryId} className={categoryClassName}>
            <button
              type="button"
              className="block-category-header"
              onClick={() => handleCategoryToggle(category)}
              aria-expanded={categoryOpen}
              aria-controls={panelId}
            >
              <span>{categoryLabel}</span>
              <span className="block-category-header-indicator" aria-hidden="true">
                {categoryOpen ? '▾' : '▸'}
              </span>
            </button>
            <div id={panelId} className="blocks-grid" hidden={!categoryOpen}>
              {blocks.map((block, index) => {
                const typedBlock = block as {
                  getId?: () => string;
                  getMedia?: () => string | null | undefined;
                  getLabel: () => string;
                  cid?: string;
                };
                const rawBlockId =
                  typeof typedBlock.getId === 'function'
                    ? typedBlock.getId()
                    : (typedBlock as { id?: string }).id;
                const safeBlockId =
                  typeof rawBlockId === 'string' && rawBlockId.trim()
                    ? rawBlockId
                    : typedBlock.cid ?? `block-${index}`;
                const isMjGroup = safeBlockId === 'mj-group';

                return (
                  <div
                    key={safeBlockId}
                    className={`block-item ${isMjGroup ? 'block-item--mj-group' : ''}`}
                    draggable
                    onDragStart={(ev) => dragStart(block, ev.nativeEvent)}
                    onDragEnd={() => dragStop(false)}
                  >
                    <div
                      className="block-content"
                      dangerouslySetInnerHTML={{ __html: typedBlock.getMedia?.() || '' }}
                    />
                    <div className="block-label">
                      {typedBlock.getLabel()}
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
  );
};

export default function BlocksPanel() {
  return (
    <div className="blocks-panel blocks-two-col gjs-one-bg gjs-two-color">
      <BlocksProvider>
        {({ mapCategoryBlocks, dragStart, dragStop }) => (
          <BlocksPanelContent
            mapCategoryBlocks={mapCategoryBlocks}
            dragStart={dragStart}
            dragStop={dragStop}
          />
        )}
      </BlocksProvider>
    </div>
  );
}
