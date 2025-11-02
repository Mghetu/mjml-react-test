// src/editor/components/BlocksPanel.tsx
import { useCallback, useEffect, useState } from 'react';
import { BlocksProvider, useEditorMaybe } from '@grapesjs/react';

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

const toCategoryArray = (collection: unknown): BlockCategoryModel[] => {
  if (!collection) {
    return [];
  }

  if (Array.isArray(collection)) {
    return collection as BlockCategoryModel[];
  }

  if (typeof collection === 'object') {
    const record = collection as Record<string, unknown>;
    const maybeModels = record.models;

    if (Array.isArray(maybeModels)) {
      return maybeModels as BlockCategoryModel[];
    }

    const maybeToArray = record.toArray as (() => unknown) | undefined;
    if (typeof maybeToArray === 'function') {
      const arrayResult = maybeToArray.call(collection) as unknown;
      if (Array.isArray(arrayResult)) {
        return arrayResult as BlockCategoryModel[];
      }
    }
  }

  return [];
};

type BlocksProviderRenderProps = {
  mapCategoryBlocks: Map<unknown, any[]>;
  dragStart: (block: any, event?: Event) => void;
  dragStop: (cancel?: boolean) => void;
};

const isCategoryModel = (category: unknown): category is BlockCategoryModel =>
  Boolean(category && typeof category === 'object');

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
  const editor = useEditorMaybe();
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null);
  const [categoryModels, setCategoryModels] = useState<Map<string, BlockCategoryModel>>(
    () => new Map(),
  );

  useEffect(() => {
    if (!editor) {
      setCategoryModels(new Map());
      return;
    }

    const categories = toCategoryArray(editor.Blocks.getCategories?.());
    const nextMap = new Map<string, BlockCategoryModel>();
    const disposers: Array<() => void> = [];
    let nextOpenKey: string | null = null;

    categories.forEach((category) => {
      const key = resolveCategoryKey(category);
      nextMap.set(key, category);

      if (!nextOpenKey && resolveCategoryOpenState(category)) {
        nextOpenKey = key;
      }

      if (typeof category.on === 'function') {
        const handler = (_: unknown, isOpen: unknown) => {
          const isCurrentlyOpen =
            typeof isOpen === 'boolean' ? isOpen : resolveCategoryOpenState(category);

          if (isCurrentlyOpen) {
            setOpenCategoryKey(key);
            return;
          }

          setOpenCategoryKey((prev) => (prev === key ? null : prev));
        };

        category.on('change:open', handler);
        disposers.push(() => category.off?.('change:open', handler));
      }
    });

    setCategoryModels(nextMap);
    setOpenCategoryKey((prev) => {
      if (prev) {
        const existing = nextMap.get(prev);
        if (!existing) {
          return prev;
        }

        if (resolveCategoryOpenState(existing)) {
          return prev;
        }
      }

      return nextOpenKey ?? null;
    });

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [editor, mapCategoryBlocks]);

  const handleCategoryToggle = useCallback(
    (category: unknown) => {
      const key = resolveCategoryKey(category);
      const model = categoryModels.get(key);

      if (model) {
        const isOpen = resolveCategoryOpenState(model);
        const nextOpen = !isOpen;

        if (typeof model.set === 'function') {
          model.set('open', nextOpen);
        } else {
          model.open = nextOpen;
        }

        if (nextOpen) {
          categoryModels.forEach((otherModel, otherKey) => {
            if (otherKey === key) {
              return;
            }

            if (typeof otherModel.set === 'function') {
              otherModel.set('open', false);
            } else {
              otherModel.open = false;
            }
          });
        } else {
          setOpenCategoryKey((prev) => (prev === key ? null : prev));
        }

        if (typeof model.on !== 'function') {
          setOpenCategoryKey(nextOpen ? key : null);
        }

        return;
      }

      const isCurrentlyOpen = openCategoryKey === key;
      const nextKey = isCurrentlyOpen ? null : key;
      setOpenCategoryKey(nextKey);

      if (nextKey) {
        categoryModels.forEach((otherModel, otherKey) => {
          if (otherKey === nextKey) {
            return;
          }

          if (typeof otherModel.set === 'function') {
            otherModel.set('open', false);
          } else {
            otherModel.open = false;
          }
        });
      }
    },
    [categoryModels, openCategoryKey],
  );

  return (
    <div className="blocks-container">
      {Array.from(mapCategoryBlocks.entries()).map(([category, blocks]) => {
        const categoryKey = resolveCategoryKey(category);
        const categoryId = resolveCategoryDomId(category);
        const categoryLabel = resolveCategoryLabel(category);
        const categoryOpen = openCategoryKey === categoryKey;
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
