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

  const baseDefaults =
    (typeof RawModel.prototype.defaults === 'function'
      ? RawModel.prototype.defaults()
      : RawModel.prototype.defaults) || {};

  domc.addType('mj-anchor', {
    extend: 'mj-raw',
    model: RawModel.extend({
      defaults: {
        ...baseDefaults,
        type: 'mj-anchor',
        'custom-name': 'Anchor Target',
        draggable: '[data-gjs-type="mj-column"], [data-gjs-type="mj-text"]',
        droppable: false,
        selectable: true,
        highlightable: true,
        attributes: {},
        anchorId: 'L1',
        traits: [
          {
            type: 'text',
            name: 'anchorId',
            label: 'Anchor ID',
            placeholder: 'e.g. L1, L2, L3',
            changeProp: 1,
          },
        ],
        content: '',
      },

      init(this: Component & { updateContent: () => void }) {
        this.on('change:anchorId', this.updateContent);
        this.updateContent();
      },

      updateContent(this: Component) {
        const rawId = (this.get('anchorId') || '').toString().trim();

        const safeId = rawId
          .toUpperCase()
          .replace(/\s+/g, '')
          .replace(/[^A-Z0-9\-_]/g, '');

        if (!safeId) {
          this.set('content', '');
          return;
        }

        this.set('content', `<a name="${safeId}" id="${safeId}"></a>`);
      },

      getAttrToHTML(this: Component, ...args: unknown[]) {
        const attrs =
          RawModel.prototype.getAttrToHTML?.apply(this, args) ||
          { ...((this.get('attributes') as Record<string, unknown> | undefined) || {}) };

        delete (attrs as Record<string, unknown>).anchorId;

        return attrs;
      },
    }),
    view:
      RawView?.extend?.({
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
      anchorId: 'L1',
    },
  });
}
