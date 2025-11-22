import type { Component, ComponentView, Editor } from 'grapesjs';

export function registerAnchorPlugin(editor: Editor) {
  const domc = editor.DomComponents;
  const bm = editor.BlockManager;

  const rawType = domc.getType('mj-raw');
  if (!rawType) {
    return;
  }

  const RawModel = rawType.model;
  const RawView = rawType.view;

  domc.addType('mj-anchor', {
    extend: 'mj-raw',
    model: {
      defaults(this: Component) {
        const baseDefaults =
          (typeof RawModel.prototype.defaults === 'function'
            ? RawModel.prototype.defaults.call(this)
            : RawModel.prototype.defaults) || {};

        return {
          ...baseDefaults,
          tagName: 'mj-raw',
          type: 'mj-anchor',
          'custom-name': 'Anchor Target',
          draggable: '[data-gjs-type="mj-column"], [data-gjs-type="mj-text"]',
          droppable: false,
          selectable: true,
          highlightable: true,
          anchorId: 'section-1',
          traits: [
            {
              type: 'text',
              name: 'anchorId',
              label: 'Anchor ID',
              placeholder: 'e.g. agenda, pricing, section-1',
            },
          ],
          content: '',
          attributes: {},
        };
      },

      init(this: Component & { updateContent: () => void }) {
        this.on('change:anchorId', this.updateContent);
        this.updateContent();
      },

      updateContent(this: Component) {
        const rawId = (this.get('anchorId') || '').toString().trim();

        const safeId = rawId
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\-_]/g, '');

        if (!safeId) {
          this.set('content', '');
          return;
        }

        const html = `<a name="${safeId}" id="${safeId}"></a>`;
        this.set('content', html);
      },

      getAttrToHTML(this: Component, ...args: unknown[]) {
        const attrs = RawModel.prototype.getAttrToHTML
          ? { ...(RawModel.prototype.getAttrToHTML.apply(this, args) as Record<string, unknown>) }
          : { ...((this.get('attributes') as Record<string, unknown> | undefined) || {}) };

        delete (attrs as Record<string, unknown>).anchorId;

        return attrs;
      },
    },

    view: RawView.extend?.({
      onRender(this: ComponentView) {
        const model = this.model as Component;
        const anchorId = model.get('anchorId') || '';
        this.el.setAttribute('data-anchor-id', anchorId);
      },
    }) || {
      onRender(this: ComponentView) {
        const model = this.model as Component;
        const anchorId = model.get('anchorId') || '';
        this.el.setAttribute('data-anchor-id', anchorId);
      },
    },
  });

  bm.add('mj-anchor', {
    label: 'Anchor Target',
    category: 'Navigation',
    attributes: { title: 'Internal anchor target' },
    content: {
      type: 'mj-anchor',
      anchorId: 'section-1',
    },
  });
}
