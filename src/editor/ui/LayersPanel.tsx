// src/components/right/LayersPanel.tsx
import { useEffect, useState, useCallback } from 'react';
import { WithEditor, useEditor } from '@grapesjs/react';
import type { Editor, Component } from 'grapesjs';
import { Eye, EyeOff, Lock, Unlock, Trash2 } from './icons';

type Node = {
  id: string;
  name: string;
  cmp: Component;
  children: Node[];
};

function getComponentLabel(cmp: Component) {
  const explicitName = typeof cmp.getName === 'function' ? cmp.getName() : '';
  if (explicitName) return explicitName;

  const type = cmp.get('type') as string | undefined;
  if (type) return type;

  const tag = (cmp.get('tagName') as string | undefined) ?? (cmp as unknown as { tagName?: string }).tagName;
  if (tag) return tag;

  return cmp.getId();
}

function buildTree(root: Component): Node {
  const mk = (cmp: Component): Node => {
    const children: Node[] = [];
    cmp.components().forEach((child: Component) => {
      children.push(mk(child));
    });

    return {
      id: cmp.getId(),
      name: getComponentLabel(cmp),
      cmp,
      children,
    };
  };

  return mk(root);
}

function useLayerTree(editor: Editor) {
  const [tree, setTree] = useState<Node | null>(null);

  const refresh = useCallback(() => {
    const wrapper = editor.getWrapper();
    if (!wrapper) return;
    setTree(buildTree(wrapper));
  }, [editor]);

  useEffect(() => {
    // Initial build
    refresh();

    // Update on relevant events
    const evts = [
      'layer:root',
      'layer:component',
      'component:add',
      'component:remove',
      'component:update',
      'component:selected',
    ];
    evts.forEach(e => editor.on(e, refresh));
    return () => evts.forEach(e => editor.off(e, refresh));
  }, [editor, refresh]);

  return { tree, refresh };
}

function Row({
  node,
  level,
  editor,
  selectedId,
}: {
  node: Node;
  level: number;
  editor: Editor;
  selectedId?: string;
}) {
  const lm = editor.Layers; // Layer Manager API
  const isVisible = lm.isVisible(node.cmp);
  const isLocked = lm.isLocked(node.cmp);
  const isSelected = selectedId === node.id;

  const onSelect = () => editor.select(node.cmp);
  const onToggleVisible = () => lm.setVisible(node.cmp, !isVisible);
  const onToggleLocked = () => lm.setLocked(node.cmp, !isLocked);
  const onDelete = () => {
    if (node.cmp.get('removable') !== false) node.cmp.remove();
  };

  return (
    <div className="mjml-layer">
      <div
        className={`mjml-layer__row ${isSelected ? 'is-active' : ''}`}
        onClick={onSelect}
        title={node.name}
        role="button"
      >
        <div className="mjml-layer__meta" style={{ marginLeft: level * 12 }}>
          <span className="mjml-layer__name">{node.name}</span>
        </div>
        <div className="mjml-layer__actions">
          <button
            className="mjml-layer__action"
            onClick={e => {
              e.stopPropagation();
              onToggleVisible();
            }}
            aria-label={isVisible ? 'Hide element' : 'Show element'}
            title={isVisible ? 'Hide element' : 'Show element'}
          >
            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            className="mjml-layer__action"
            onClick={e => {
              e.stopPropagation();
              onToggleLocked();
            }}
            aria-label={isLocked ? 'Unlock element' : 'Lock element'}
            title={isLocked ? 'Unlock element' : 'Lock element'}
          >
            {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
          </button>
          <button
            className="mjml-layer__action mjml-layer__action--danger"
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete element"
            title="Delete element"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {node.children.length > 0 && (
        <div className="mjml-layer__children">
          {node.children.map(child => (
            <Row key={child.id} node={child} level={level + 1} editor={editor} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  );
}

function LayersInner() {
  const editor = useEditor();
  const { tree } = useLayerTree(editor);
  const selectedId = editor.getSelected()?.getId();

  if (!tree) {
    return <div className="mjml-panel-empty">No content yet</div>;
  }

  return (
    <div className="mjml-panel-content mjml-panel-content--padded">
      <Row node={tree} level={0} editor={editor} selectedId={selectedId} />
    </div>
  );
}

export default function LayersPanel() {
  return (
    <WithEditor>
      <LayersInner />
    </WithEditor>
  );
}
