import type { Component, Editor } from 'grapesjs';

export function registerMjImageAnchorFix(editor: Editor) {
  const domc = editor.DomComponents;
  const imgType = domc.getType('mj-image');
  const Model = imgType?.model;

  if (!Model) return;

  const baseGetAttrToHTML =
    Model.prototype.getAttrToHTML ||
    function (this: Component, ..._args: unknown[]) {
      return { ...(this.get('attributes') || {}) } as Record<string, unknown>;
    };

  Model.prototype.getAttrToHTML = function (this: Component, ...args: unknown[]) {
    const attrs = baseGetAttrToHTML.apply(this, args) as Record<string, unknown>;
    const href = attrs.href as string | undefined;

    if (href && href.startsWith('#')) {
      delete attrs.target;
    }

    return attrs;
  };
}
