import type { Editor } from 'grapesjs';

export default function registerPrebuiltBlocks(editor: Editor) {
  const bm = editor.Blocks;

  const add = (
    id: string,
    label: string,
    category: string,
    content: string,
    media?: string,
  ) => {
    bm.add(id, {
      label,
      category,
      media: media ?? '📦',
      content,
      select: true,
      activate: true,
    });
  };

  // ===== MEM (examples) =====
  add(
    'mem-two-col',
    'MEM · Two Columns',
    'MEM',
    `
<mj-section>
  <mj-column><mj-text>Left column</mj-text></mj-column>
  <mj-column><mj-text>Right column</mj-text></mj-column>
</mj-section>`
  );

  add(
    'mem-hero',
    'MEM · Hero',
    'MEM',
    `
<mj-hero height="300px" mode="fixed-height" background-url="https://via.placeholder.com/1200x300" background-size="cover" background-position="center">
  <mj-text align="center" color="#ffffff" font-size="24px" font-weight="700">MEM Hero</mj-text>
  <mj-button href="#" background-color="#111827" color="#ffffff" inner-padding="12px 24px">Call to Action</mj-button>
</mj-hero>`
  );

  // ===== ERDC (examples) =====
  add(
    'erdc-cta',
    'ERDC · Full-width CTA',
    'ERDC',
    `
<mj-section background-color="#111827" padding="24px">
  <mj-column>
    <mj-text color="#ffffff" font-size="18px" font-weight="700">Don’t miss out</mj-text>
    <mj-text color="#D1D5DB">Short supporting sentence.</mj-text>
    <mj-button href="#" background-color="#2563EB" color="#ffffff">Call to action</mj-button>
  </mj-column>
</mj-section>`
  );
}
