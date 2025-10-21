// src/editor/ui/LayersPanel.tsx
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
    refresh();

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
  const lm = editor.Layers;
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
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
          isSelected
            ? 'bg-blue-100 border border-blue-400'
            : 'bg-gray-50 border border-transparent hover:bg-gray-100 hover:border-gray-300'
        }`}
        onClick={onSelect}
        title={node.name}
        role="button"
      >
        <div className="flex items-center gap-2 text-gray-900 text-xs font-medium" style={{ marginLeft: level * 12 }}>
          <span className="max-w-[180px] truncate">{node.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            onClick={e => {
              e.stopPropagation();
              onToggleVisible();
            }}
            aria-label={isVisible ? 'Hide element' : 'Show element'}
            title={isVisible ? 'Hide element' : 'Show element'}
          >
            {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            className="p-1 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            onClick={e => {
              e.stopPropagation();
              onToggleLocked();
            }}
            aria-label={isLocked ? 'Unlock element' : 'Lock element'}
            title={isLocked ? 'Unlock element' : 'Lock element'}
          >
            {isLocked ? <Unlock size={14} /> : <Lock size={14} />}
          </button>
          <button
            className="p-1 rounded text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete element"
            title="Delete element"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {node.children.length > 0 && (
        <div className="flex flex-col gap-1 mt-1 pl-3.5 border-l border-gray-300">
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
    return <div className="p-5 text-xs text-gray-500 text-center tracking-wide uppercase">No content yet</div>;
  }

  return (
    <div className="p-3 flex flex-col gap-1">
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
