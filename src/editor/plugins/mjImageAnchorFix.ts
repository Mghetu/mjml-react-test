import type { Component, Editor } from 'grapesjs';

export function registerMjImageAnchorFix(editor: Editor) {
  const normalizeImageTarget = (cmp: Component) => {
    if (cmp.get('type') !== 'mj-image') return;

    const attrs = { ...(cmp.getAttributes() || {}) } as Record<string, unknown>;
    const href = attrs.href as string | undefined;

    if (!href) return;

    if (href.startsWith('#')) {
      if (attrs.target !== '_self') {
        attrs.target = '_self';
        cmp.setAttributes(attrs);
      }
    }
  };

  editor.on('component:add', (cmp: Component) => {
    normalizeImageTarget(cmp);
  });

  editor.on('component:update:attributes', (cmp: Component) => {
    normalizeImageTarget(cmp);
  });
}
