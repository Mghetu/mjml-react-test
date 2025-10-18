import { useState, useEffect } from 'react';
import { useEditorMaybe } from '../hooks/useEditorSafe';

export default function RightSidebar() {
  const editor = useEditorMaybe();
  const [tab, setTab] = useState<'traits' | 'styles'>('traits');

useEffect(() => {
  if (!editor) return;

  if (tab === 'traits') {
    // If nothing is selected, select the first mj-text or any component
    const sel = editor.getSelected?.();
    if (!sel) {
      const first =
        editor.getWrapper().find('mj-text')?.[0] ??
        editor.getWrapper().find('*')?.[0];
      if (first) editor.select(first);
    }
    editor.runCommand('open-traits');
  }

  if (tab === 'styles') {
    const sel = editor.getSelected?.();
    if (!sel) {
      const first =
        editor.getWrapper().find('mj-text')?.[0] ??
        editor.getWrapper().find('*')?.[0];
      if (first) editor.select(first);
    }
    editor.runCommand('open-styles');
  }
}, [tab, editor]);


  return (
    <aside className="mjml-right">
      <div className="mjml-panel-title">
        <button className={tab === 'traits' ? 'active' : ''} onClick={() => setTab('traits')}>Traits</button>
        <button className={tab === 'styles' ? 'active' : ''} onClick={() => setTab('styles')}>Styles</button>
      </div>
      <div className="mjml-panel-body" style={{ height: '100%', overflow: 'auto' }}>
        <div id="mjml-traits" style={{ display: tab === 'traits' ? 'block' : 'none' }} />
        <div id="mjml-styles" style={{ display: tab === 'styles' ? 'block' : 'none' }} />
      </div>
    </aside>
  );
}
