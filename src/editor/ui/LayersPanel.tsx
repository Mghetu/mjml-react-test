// src/components/right/LayersPanel.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { WithEditor, useEditor } from '@grapesjs/react';
import type { Editor, Component } from 'grapesjs';
import { Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';

type Node = {
  id: string;
  name: string;
  cmp: Component;
  children: Node[];
};

function buildTree(root: Component): Node {
  const mk = (cmp: Component): Node => ({
    id: cmp.getId(),
    name: cmp.getName ? cmp.getName() || cmp.get('type') || cmp.getTagName() : cmp.get('type') || cmp.getTagName(),
    cmp,
    children: (cmp.components() as Component[]).map(mk),
  });
  return mk(root);
}

function useLayerTree(editor: Editor) {
  const [tree, setTree] = useState<Node | null>(null);

  const refresh = useCallback(() => {
    const wrapper = editor.getWrapper();
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
    <div className={`flex flex-col`}>
      <div
        className={`group flex items-center justify-between rounded-lg px-2 py-1 cursor-pointer
          ${isSelected ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
        onClick={onSelect}
        title={node.name}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 select-none" style={{ paddingLeft: level * 12 }}>
            {level > 0 ? '↳' : ''}
          </span>
          <span className="text-sm truncate">{node.name}</span>
        </div>
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
            onClick={e => {
              e.stopPropagation();
              onToggleVisible();
            }}
            aria-label={isVisible ? 'Hide' : 'Show'}
            title={isVisible ? 'Hide' : 'Show'}
          >
            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
            onClick={e => {
              e.stopPropagation();
              onToggleLocked();
            }}
            aria-label={isLocked ? 'Unlock' : 'Lock'}
            title={isLocked ? 'Unlock' : 'Lock'}
          >
            {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
          </button>
          <button
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {node.children.length > 0 && (
        <div className="flex flex-col">
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
  const selectedId = useMemo(() => editor.getSelected()?.getId(), [editor, editor.getSelected()]);

  if (!tree) {
    return <div className="text-sm text-zinc-500 p-2">No content</div>;
  }

  return (
    <div className="h-full overflow-auto p-2 space-y-1">
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
