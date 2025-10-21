import { useState } from 'react';
import { TraitsProvider, StylesProvider } from '@grapesjs/react';

export default function RightSidebar() {
  const [tab, setTab] = useState<'traits' | 'styles'>('traits');

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
          role="tabpanel"
          aria-hidden={tab !== 'traits'}
        >
          <TraitsProvider>
            {({ Container }) => <Container><></></Container>}
          </TraitsProvider>
        </div>
        <div
          className={`mjml-panel-stack ${tab === 'styles' ? 'is-active' : ''}`}
          role="tabpanel"
          aria-hidden={tab !== 'styles'}
        >
          <StylesProvider>
            {({ Container }) => <Container><></></Container>}
          </StylesProvider>
        </div>
      </div>
    </aside>
  );
}
