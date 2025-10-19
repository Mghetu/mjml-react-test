// src/editor/utils/mjml.ts
export const ensureSkeleton = (editor: any) => {
  const html = editor.getHtml?.() || '';
  const hasMjml = /<\s*mjml[\s>]/i.test(html);
  const hasBody = /<\s*mj-body[\s>]/i.test(html);
  if (hasMjml && hasBody) return;

  editor.setComponents(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>Start editing…</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `.trim());
};
