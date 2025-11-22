import type { Component, Editor } from 'grapesjs';

export function registerMjImageAnchorFix(editor: Editor) {
  const domc = editor.DomComponents;
  const imageType = domc.getType('mj-image');
  if (!imageType) {
    return;
  }

  const ImageModel = imageType.model;

  domc.addType('mj-image', {
    extend: 'mj-image',
    model: ImageModel.extend({
      getAttrToHTML(this: Component, ...args: unknown[]) {
        const attrs = ImageModel.prototype.getAttrToHTML
          ? ImageModel.prototype.getAttrToHTML.apply(this, args)
          : this.get('attributes');

        const href =
          (attrs as Record<string, unknown> | undefined)?.href ??
          this.get('attributes')?.href;

        if (typeof href === 'string' && href.startsWith('#') && attrs && typeof attrs === 'object') {
          delete (attrs as Record<string, unknown>).target;
        }

        return attrs;
      },
    }),
  });
}
