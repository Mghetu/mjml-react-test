import type { FC } from 'react';
import { useEditor } from '@grapesjs/react';

const isTextLike = (comp: any) => {
  const type = comp?.get?.('type');
  const tagName = (comp?.get?.('tagName') || '').toString().toLowerCase();
  return type === 'text' || type === 'mj-text' || tagName === 'mj-text';
};

export const TopbarEditTextButton: FC = () => {
  const editor = useEditor();

  const handleClick = () => {
    if (!editor) return;
    const comp = editor.getSelected?.();
    if (!comp || !isTextLike(comp)) return;
    editor.runCommand('open-tiptap-modal', { component: comp });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="action-button"
      title="Edit text in TipTap"
    >
      ✎
    </button>
  );
};

export default TopbarEditTextButton;
