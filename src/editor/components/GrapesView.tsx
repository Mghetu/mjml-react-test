// src/editor/components/GrapesView.tsx
import { useEffect, useRef } from 'react';
import { useEditorMaybe } from '@grapesjs/react';
import type { Editor } from 'grapesjs';

export interface GrapesViewProps {
  isVisible?: boolean;
  className?: string;
  getElement: (editor: Editor) => HTMLElement | null | undefined;
}

export default function GrapesView({ isVisible = true, className, getElement }: GrapesViewProps) {
  const editor = useEditorMaybe();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!editor || !container) {
      return;
    }

    const element = getElement(editor);
    if (!element) {
      return;
    }

    viewRef.current = element;

    if (element.parentElement !== container) {
      container.innerHTML = '';
      container.appendChild(element);
    }

    return () => {
      const view = viewRef.current;
      if (!view) {
        container.innerHTML = '';
        return;
      }

      if (view.parentElement === container) {
        container.removeChild(view);
      }
      viewRef.current = null;
    };
  }, [editor, getElement]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const container = containerRef.current;
    const view = viewRef.current;
    if (!container || !view) {
      return;
    }

    if (!container.contains(view)) {
      container.appendChild(view);
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={isVisible ? undefined : { display: 'none' }}
    />
  );
}
