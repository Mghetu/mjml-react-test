import type { Editor } from 'grapesjs';
import { CATEGORY } from '../constants/categories';

const mediaIcon = (emoji: string) =>
  `<div style="font-size:18px;line-height:1">${emoji}</div>`;

type BlockManagerLike = Editor['BlockManager'] & {
  add: Editor['BlockManager']['add'];
};

export default function registerPrebuiltBlocks(editor: Editor) {
  const bm =
    ((editor as Editor & { Blocks?: BlockManagerLike }).Blocks as BlockManagerLike | undefined) ??
    editor.BlockManager;

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
      media: media ?? mediaIcon('📦'),
      content, // MJML string; grapesjs-mjml parses it
      select: true,
      activate: true,
    });
  };

  // —— MEM (layout-heavy compositions) ——
  add(
    'mem-two-col-image-text',
    'MEM · 2 Col — Image/Text',
    CATEGORY.MEM,
    `
<mj-section padding="0">
  <mj-column>
    <mj-image padding="0" src="https://via.placeholder.com/600x400" />
  </mj-column>
  <mj-column>
    <mj-text font-size="18px" font-weight="700">Section title</mj-text>
    <mj-text color="#555">Supporting copy goes here.</mj-text>
    <mj-button href="#" padding-top="8px">Read more</mj-button>
  </mj-column>
</mj-section>`,
    mediaIcon('🧩'),
  );

  add(
    'mem-three-cards',
    'MEM · 3 Cards',
    CATEGORY.MEM,
    `
<mj-section background-color="#F9FAFB" padding="16px">
  <mj-column>
    <mj-image src="https://via.placeholder.com/160" />
    <mj-text align="center" font-weight="700">Title</mj-text>
    <mj-text align="center" color="#6B7280">Short description text.</mj-text>
  </mj-column>
  <mj-column>
    <mj-image src="https://via.placeholder.com/160" />
    <mj-text align="center" font-weight="700">Title</mj-text>
    <mj-text align="center" color="#6B7280">Short description text.</mj-text>
  </mj-column>
  <mj-column>
    <mj-image src="https://via.placeholder.com/160" />
    <mj-text align="center" font-weight="700">Title</mj-text>
    <mj-text align="center" color="#6B7280">Short description text.</mj-text>
  </mj-column>
</mj-section>`,
  );

  // —— ERDC (hero/cta/navigation) ——
  add(
    'erdc-hero-centered',
    'ERDC · Hero — Center',
    CATEGORY.ERDC,
    `
<mj-hero mode="fixed-height" height="320px" background-url="https://via.placeholder.com/1200x320" background-size="cover" background-position="center">
  <mj-text align="center" color="#ffffff" font-size="28px" font-weight="700">Catchy headline</mj-text>
  <mj-button href="#" background-color="#111827" color="#ffffff" inner-padding="12px 24px">Get started</mj-button>
</mj-hero>`,
    mediaIcon('🎯'),
  );

  add(
    'erdc-full-width-cta',
    'ERDC · Full-width CTA',
    CATEGORY.ERDC,
    `
<mj-section background-color="#111827" padding="24px">
  <mj-column>
    <mj-text color="#ffffff" font-size="18px" font-weight="700">Don’t miss out</mj-text>
    <mj-text color="#D1D5DB">A single sentence to nudge the user.</mj-text>
    <mj-button href="#" background-color="#2563EB" color="#ffffff">Call to action</mj-button>
  </mj-column>
</mj-section>`,
    mediaIcon('🔘'),
  );
}
