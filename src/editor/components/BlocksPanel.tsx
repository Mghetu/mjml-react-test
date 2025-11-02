// src/editor/components/BlocksPanel.tsx
import { useEffect, useMemo, useState } from 'react';
import { BlocksProvider } from '@grapesjs/react';

type BlockCategoryModel = {
  set?: (key: string, value: unknown) => void;
  get?: (key: string) => unknown;
  open?: unknown;
};

type BlocksProviderRenderProps = {
  mapCategoryBlocks: Map<unknown, any[]>;
  dragStart: (block: any, event?: Event) => void;
  dragStop: (cancel?: boolean) => void;
};

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
      typedCategory.getLabel?.() ?? typedCategory.get?.('label') ?? typedCategory.label;

    if (typeof labelCandidate === 'string' && labelCandidate.trim()) {
      return labelCandidate;
    }
  }

  return 'General';
};

const resolveCategoryKey = (category: unknown) => {
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
      getLabel?: () => unknown;
      label?: unknown;
    };

    const idCandidate = typedCategory.getId?.() ?? typedCategory.get?.('id') ?? typedCategory.id;
    if (typeof idCandidate === 'string' && idCandidate.trim()) {
      return idCandidate;
    }

    const labelCandidate =
      typedCategory.getLabel?.() ?? typedCategory.get?.('label') ?? typedCategory.label;
    if (typeof labelCandidate === 'string' && labelCandidate.trim()) {
      return labelCandidate;
    }
  }

  return 'default-category';
};

const resolveCategoryDomId = (category: unknown) =>
  resolveCategoryKey(category)
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-');

const updateCategoryOpenState = (category: unknown, isOpen: boolean) => {
  if (!category || typeof category !== 'object') {
    return;
  }

  const model = category as BlockCategoryModel;

  if (typeof model.set === 'function') {
    model.set('open', isOpen);
    return;
  }

  model.open = isOpen;
};

const BlocksPanelContent = ({ mapCategoryBlocks, dragStart, dragStop }: BlocksProviderRenderProps) => {
  const categoryEntries = useMemo(
    () => Array.from(mapCategoryBlocks.entries()) as Array<[unknown, any[]]>,
    [mapCategoryBlocks],
  );
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(() => {
    const [firstCategory] = categoryEntries[0] ?? [];
    return firstCategory ? resolveCategoryKey(firstCategory) : null;
  });

  useEffect(() => {
    const availableKeys = categoryEntries.map(([category]) => resolveCategoryKey(category));

    if (openCategoryKey && availableKeys.includes(openCategoryKey)) {
      return;
    }

    setOpenCategoryKey(availableKeys[0] ?? null);
  }, [categoryEntries, openCategoryKey]);

  useEffect(() => {
    categoryEntries.forEach(([category]) => {
      const categoryKey = resolveCategoryKey(category);
      updateCategoryOpenState(category, openCategoryKey === categoryKey);
    });
  }, [categoryEntries, openCategoryKey]);

  const handleCategoryToggle = (category: unknown) => {
    const categoryKey = resolveCategoryKey(category);
    setOpenCategoryKey((current) => (current === categoryKey ? null : categoryKey));
  };

  return (
    <div className="blocks-container">
      {categoryEntries.map(([category, blocks]) => {
        const categoryKey = resolveCategoryKey(category);
        const categoryId = resolveCategoryDomId(category);
        const categoryLabel = resolveCategoryLabel(category);
        const categoryOpen = openCategoryKey === categoryKey;
        const panelId = `block-category-panel-${categoryId}`;
        const categoryClassName = `block-category ${
          categoryOpen ? 'block-category--open' : 'block-category--collapsed'
        }`;

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
