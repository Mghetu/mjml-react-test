// src/editor/ui/BlocksPanel.tsx
import React, { useEffect, useRef } from 'react';
import { WithEditor, useEditor } from '@grapesjs/react';

function BlocksInner() {
  const editor = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const blockManager = editor.BlockManager;
    const blockView = blockManager.render(); // creates native draggable DOM

    // clear any previous content
    container.innerHTML = '';
    container.appendChild(blockView);

    // optional styling hook
    blockView.classList.add('gjs-blocks');

    // cleanup if needed
    return () => {
      container.innerHTML = '';
    };
  }, [editor]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto p-2 bg-white dark:bg-zinc-950"
    />
  );
}

export default function BlocksPanel() {
  return (
    <WithEditor>
      <BlocksInner />
    </WithEditor>
  );
}
