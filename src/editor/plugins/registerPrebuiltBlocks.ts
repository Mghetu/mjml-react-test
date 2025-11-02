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
    'header with logo',
    'MEM · header with logo',
    'MEM',
    `
 <mj-section padding-top="10px" padding-bottom="10px" text-align="left" background-color="#000000">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-image src="https://placehold.co/170x60" padding-top="0px" padding-bottom="0px" align="left" width="170px">
          </mj-image>
        </mj-column>
  </mj-section>`
  );

  add(
    'mem-hero',
    'MEM · Hero',
    'MEM',
    `
  <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-text font-family="Aptos, Calibri, sans-serif" font-size="10px" color="#8f8f8f">Market Eminence Monitor | For internal use only
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-left="0px" padding-right="0px">
          <mj-image src="https://placehold.co/600x300" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          </mj-image>
        </mj-column>
      </mj-section>
      <mj-section padding-top="10px" padding-bottom="10px" background-color="#ffffff">
        <mj-column>
          <mj-text font-size="32px" font-family="Aptos, Calibri, sans-serif" font-weight="700">Market Eminence Monitor
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif">Our sushi bar has some amazing sushi with great variety, as well as dishes from other Asian regions including Korea, Japan, Thailand and Cambodia. We get our ingredients from local producers whenever possible.
          </mj-text>
        </mj-column>
      </mj-section>`
  );


 add(
    'Mem numbers',
    'MEM · numbers',
    'MEM',
    `
   <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column>
          <mj-text font-family="Aptos, Calibri, sans-serif" font-weight="700">FY26 Numbers to Date  
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="5px" padding-bottom="5px">
        <mj-group>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="5px" padding-left="5px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="10px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>
      <mj-section padding-top="5px" padding-bottom="0px">
        <mj-group>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="5px" padding-left="5px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="10px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>`
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
