// src/editor/components/LayersPanel.tsx
import { useEffect, useState } from 'react';
import { LayersProvider, useEditorMaybe } from '@grapesjs/react';
import type { Component } from 'grapesjs';

function getComponentChildren(component: Component): Component[] {
  const children = component.components?.();
  if (!children) return [];

  const models = (children as any).models;
  if (Array.isArray(models)) {
    return models as Component[];
  }

  if (Array.isArray(children)) {
    return children as Component[];
  }

  return [];
}

function getComponentLabel(component: Component) {
  const explicitLabel = component.getName?.() || (component as any).get?.('name');
  const tagName = component.get('tagName');
  const type = component.get('type');
  const label = explicitLabel || tagName || type || 'Layer';
  const attrs = component.getAttributes?.() || {};
  const idAttr = (attrs as Record<string, unknown>).id;

  if (typeof idAttr === 'string' && idAttr.trim()) {
    return `${label} #${idAttr}`;
  }

  return label;
}

interface LayerNodeProps {
  component: Component;
  selectedId: string | null;
  onSelect: (component: Component) => void;
}

function LayerNode({ component, selectedId, onSelect }: LayerNodeProps) {
  const id = component.getId?.() || component.cid;
  const children = getComponentChildren(component);
  const isSelected = selectedId === id;

  return (
    <li className={`layer-node ${isSelected ? 'layer-node--selected' : ''}`}>
      <button
        type="button"
        className="layer-node-button"
        onClick={() => onSelect(component)}
        title={getComponentLabel(component)}
      >
        <span className="layer-node-label">{getComponentLabel(component)}</span>
      </button>
      {children.length > 0 && (
        <ul className="layer-children">
          {children.map((child) => (
            <LayerNode
              key={child.getId?.() || child.cid}
              component={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function LayersPanel() {
  const editor = useEditorMaybe();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [, setTreeVersion] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const updateSelected = () => {
      const selected = editor.getSelected();
      setSelectedId(selected ? selected.getId() : null);
    };

    const refreshTree = () => {
      setTreeVersion((value) => value + 1);
    };

    updateSelected();

    editor.on('component:selected', updateSelected);
    editor.on('component:deselected', updateSelected);
    editor.on('component:add', refreshTree);
    editor.on('component:remove', refreshTree);
    editor.on('component:update', refreshTree);

    return () => {
      editor.off('component:selected', updateSelected);
      editor.off('component:deselected', updateSelected);
      editor.off('component:add', refreshTree);
      editor.off('component:remove', refreshTree);
      editor.off('component:update', refreshTree);
    };
  }, [editor]);

  const handleSelect = (component: Component) => {
    if (!editor) return;
    editor.select(component);
    setSelectedId(component.getId?.() || null);
  };

  return (
    <div className="layers-panel">
      <LayersProvider>
        {({ root }) => {
          if (!root) {
            return (
              <div className="panel-wrapper panel-wrapper--flush">
                <div className="empty-state">
                  Drag blocks onto the canvas to build your layout and see it listed here.
                </div>
              </div>
            );
          }

          const nodes = [root];
          const hasChildren = getComponentChildren(root).length > 0;

          return (
            <div className="panel-wrapper panel-wrapper--flush">
              {hasChildren ? (
                <ul className="layers-tree">
                  {nodes.map((component) => (
                    <LayerNode
                      key={component.getId?.() || component.cid}
                      component={component}
                      selectedId={selectedId}
                      onSelect={handleSelect}
                    />
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  Drag blocks onto the canvas to build your layout and see it listed here.
                </div>
              )}
            </div>
          );
        }}
      </LayersProvider>
    </div>
  );
}
