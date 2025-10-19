import { useState, useEffect } from 'react';
import { useEditorMaybe } from '../hooks/useEditorSafe';

export default function RightSidebar() {
  const editor = useEditorMaybe();
  const [tab, setTab] = useState<'traits' | 'styles'>('traits');

  useEffect(() => {
    if (!editor) return;

    const ensureSelection = () => {
      const sel = editor.getSelected?.();
      if (sel) return;

      const wrapper = editor.getWrapper();
      if (!wrapper) return;

      const candidates = wrapper.find('mj-text');
      const fallback = wrapper.find('*');
      const first = candidates[0] ?? fallback[0];

      if (first) editor.select(first);
    };

    if (tab === 'traits') {
      ensureSelection();
      editor.runCommand('open-traits');
    }

    if (tab === 'styles') {
      ensureSelection();
      editor.runCommand('open-styles');
    }
  }, [tab, editor]);

  return (
    <aside className="mjml-right">
      <header className="mjml-panel-header">
        <h2 className="mjml-panel-heading">Inspector</h2>
      </header>
      <nav className="mjml-panel-tabs" aria-label="Inspector tabs" role="tablist">
        <button
          type="button"
          className={`mjml-panel-tab ${tab === 'traits' ? 'is-active' : ''}`}
          onClick={() => setTab('traits')}
          role="tab"
          aria-selected={tab === 'traits'}
        >
          Traits
        </button>
        <button
          type="button"
          className={`mjml-panel-tab ${tab === 'styles' ? 'is-active' : ''}`}
          onClick={() => setTab('styles')}
          role="tab"
          aria-selected={tab === 'styles'}
        >
          Styles
        </button>
      </nav>

      <div className="mjml-panel-scroll">
        <div
          className={`mjml-panel-stack ${tab === 'traits' ? 'is-active' : ''}`}
          id="mjml-traits"
          role="tabpanel"
          aria-hidden={tab !== 'traits'}
        />
        <div
          className={`mjml-panel-stack ${tab === 'styles' ? 'is-active' : ''}`}
          id="mjml-styles"
          role="tabpanel"
          aria-hidden={tab !== 'styles'}
        />
      </div>
    </aside>
  );
}
