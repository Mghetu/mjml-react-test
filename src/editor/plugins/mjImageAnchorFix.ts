import type { Component, Editor } from 'grapesjs';

export function registerMjImageAnchorFix(editor: Editor) {
  const domc = editor.DomComponents;
  const imgType = domc.getType('mj-image');
  const BaseModel = imgType?.model;

  if (!BaseModel) return;

  domc.addType('mj-image', {
    extend: 'mj-image',
    model: {
      // Override only attribute generation (no Model.extend!)
      getAttrToHTML(this: Component, ...args: any[]) {
        const baseAttrs = BaseModel.prototype.getAttrToHTML
          ? BaseModel.prototype.getAttrToHTML.apply(this, args) || {}
          : { ...(this.get('attributes') || {}) };

        const attrs = baseAttrs as Record<string, unknown>;
        const href = attrs.href as string | undefined;

        // For internal anchors (#L1), remove target="_blank"
        if (href && href.startsWith('#')) {
          delete attrs.target;
        }

        return attrs;
      },
    },
  });
}
