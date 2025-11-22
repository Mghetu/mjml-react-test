import { type CSSProperties, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export type TiptapModalEditorProps = {
  initialHtml: string;
  onSave: (html: string) => void;
  onCancel: () => void;
};

const editorContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  minHeight: '50vh',
  minWidth: '60vw',
};

const toolbarStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const buttonStyle: CSSProperties = {
  padding: '6px 10px',
  borderRadius: '4px',
  border: '1px solid #d0d7de',
  background: '#f6f8fa',
  cursor: 'pointer',
};

const editorAreaStyle: CSSProperties = {
  border: '1px solid #d0d7de',
  borderRadius: '6px',
  padding: '12px',
  background: '#ffffff',
  minHeight: '320px',
};

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
};

function createLink(editor: ReturnType<typeof useEditor>) {
  const previous = editor?.getAttributes('link')?.href as string | undefined;
  const url = window.prompt('Enter URL', previous ?? 'https://');

  if (!url) {
    editor?.chain().focus().unsetLink().run();
    return;
  }

  editor
    ?.chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' })
    .run();
}

export function TiptapModalEditor({ initialHtml, onCancel, onSave }: TiptapModalEditorProps) {
  const sanitizedInitial = useMemo(() => initialHtml?.trim() || '<p></p>', [initialHtml]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        strike: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        validate: (href) => /^https?:\/\//i.test(href ?? ''),
      }),
    ],
    content: sanitizedInitial,
    editorProps: {
      attributes: {
        style: 'outline: none;',
      },
    },
  });

  return (
    <div style={editorContainerStyle}>
      <div style={toolbarStyle}>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          aria-pressed={editor?.isActive('bold')}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          aria-pressed={editor?.isActive('italic')}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          aria-pressed={editor?.isActive('bulletList')}
        >
          • List
        </button>
        <button type="button" style={buttonStyle} onClick={() => createLink(editor)}>
          Link
        </button>
      </div>

      <div style={editorAreaStyle}>
        <EditorContent editor={editor} />
      </div>

      <div style={footerStyle}>
        <button type="button" style={buttonStyle} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          style={{ ...buttonStyle, background: '#2da44e', color: '#ffffff', borderColor: '#2da44e' }}
          onClick={() => {
            const html = editor?.getHTML() ?? '<p></p>';
            onSave(html);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default TiptapModalEditor;
