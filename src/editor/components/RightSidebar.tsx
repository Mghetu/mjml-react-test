// src/editor/components/RightSidebar.tsx
import { Fragment, useEffect, useRef, useState } from 'react';
import { TraitsProvider, useEditorMaybe } from '@grapesjs/react';
import type { Trait } from 'grapesjs';
import type { ChangeEvent } from 'react';

function groupTraitsByCategory(traits: Trait[]) {
  const groups = new Map<string, Trait[]>();

  traits.forEach((trait) => {
    const categoryLabel = trait.getCategoryLabel?.({ locale: false }) || 'General';
    const key = categoryLabel.trim() || 'General';
    const traitGroup = groups.get(key);

    if (traitGroup) {
      traitGroup.push(trait);
    } else {
      groups.set(key, [trait]);
    }
  });

  return Array.from(groups.entries());
}

function normalizeTraitValue(trait: Trait) {
  return trait.getValue ? trait.getValue({ useType: true }) : trait.get('value');
}

function updateTraitValue(trait: Trait, value: any) {
  if (typeof (trait as any).setValue === 'function') {
    (trait as any).setValue(value);
    return;
  }

  if (typeof (trait as any).setTargetValue === 'function') {
    (trait as any).setTargetValue(value);
    return;
  }

  trait.set('value', value);
}

function renderTraitInput(trait: Trait) {
  const type = trait.getType?.() || (trait as any).get('type');
  const id = trait.getId?.() || trait.getName?.() || trait.cid;
  const label = trait.getLabel?.({ locale: false }) || trait.getName?.() || id;
  const description = (trait as any).get?.('description');
  const placeholder = (trait as any).get?.('placeholder');
  const inputId = `trait-${id}`;

  const options = ((trait as any).getOptions?.() || (trait as any).get?.('options') || []) as Array<any>;

  const optionItems = options.map((option) => {
    if (typeof option === 'string') {
      return {
        id: option,
        value: option,
        label: option,
      };
    }

    const optionId = option.id ?? option.value ?? option.name;
    return {
      id: optionId,
      value: option.value ?? optionId,
      label: option.label ?? option.name ?? optionId,
    };
  });

  const value = normalizeTraitValue(trait);

  switch (type) {
    case 'checkbox': {
      const checked = Boolean(value);
      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateTraitValue(trait, event.target.checked);
      };

      return (
        <label key={id} className="property-item property-item--checkbox">
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
          />
          <span>{label}</span>
        </label>
      );
    }
    case 'select': {
      const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        updateTraitValue(trait, event.target.value);
      };

      return (
        <div key={id} className="property-item">
          <label htmlFor={inputId} className="property-label">
            {label}
          </label>
          <select
            id={inputId}
            className="property-select"
            value={value ?? ''}
            onChange={handleChange}
          >
            {optionItems.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {description && <p className="property-description">{description}</p>}
        </div>
      );
    }
    case 'color': {
      const stringValue = typeof value === 'string' && value ? value : '#000000';
      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateTraitValue(trait, event.target.value);
      };

      return (
        <div key={id} className="property-item">
          <label htmlFor={inputId} className="property-label">
            {label}
          </label>
          <input
            id={inputId}
            type="color"
            className="property-input"
            value={stringValue}
            onChange={handleChange}
          />
          {description && <p className="property-description">{description}</p>}
        </div>
      );
    }
    case 'button': {
      const buttonText = (trait as any).get?.('text') || label;
      const handleClick = () => {
        if (typeof (trait as any).runCommand === 'function') {
          (trait as any).runCommand();
        }
      };

      return (
        <div key={id} className="property-item">
          <button type="button" className="property-button" onClick={handleClick}>
            {buttonText}
          </button>
          {description && <p className="property-description">{description}</p>}
        </div>
      );
    }
    default: {
      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateTraitValue(trait, event.target.value);
      };

      return (
        <div key={id} className="property-item">
          <label htmlFor={inputId} className="property-label">
            {label}
          </label>
          <input
            id={inputId}
            type="text"
            className="property-input"
            placeholder={placeholder}
            value={value ?? ''}
            onChange={handleChange}
          />
          {description && <p className="property-description">{description}</p>}
        </div>
      );
    }
  }
}

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState<'traits' | 'styles'>('traits');

  function StyleManagerPanel({ isVisible }: { isVisible: boolean }) {
    const editor = useEditorMaybe();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!editor || !container) {
        return;
      }

      const styleManager = editor.StyleManager;
      const element = styleManager.render();
      viewRef.current = element;
      container.innerHTML = '';
      container.appendChild(element);

      return () => {
        const el = viewRef.current;
        if (el) {
          if (el.parentElement === container) {
            container.removeChild(el);
          }
          el.remove();
          viewRef.current = null;
        } else {
          container.innerHTML = '';
        }
      };
    }, [editor]);

    useEffect(() => {
      if (!isVisible) {
        return;
      }

      const container = containerRef.current;
      const view = viewRef.current;
      if (!container || !view) {
        return;
      }

      if (!container.contains(view)) {
        container.appendChild(view);
      }
    }, [isVisible]);

    return (
      <div
        ref={containerRef}
        className="style-manager-container gjs-one-bg gjs-two-color"
        style={{ display: isVisible ? 'block' : 'none' }}
      />
    );
  }

  return (
    <div className="right-sidebar gjs-one-bg gjs-two-color">
      <div className="sidebar-header gjs-one-bg gjs-two-color">
        <h3>Properties</h3>
      </div>

      <div className="sidebar-tabs gjs-one-bg gjs-two-color">
        <button
          className={`tab-button gjs-btn ${activeTab === 'traits' ? 'active' : ''}`}
          onClick={() => setActiveTab('traits')}
        >
          Settings
        </button>
        <button
          className={`tab-button gjs-btn ${activeTab === 'styles' ? 'active' : ''}`}
          onClick={() => setActiveTab('styles')}
        >
          Style
        </button>
      </div>

      <div
        className={`sidebar-content gjs-one-bg gjs-two-color ${
          activeTab === 'styles' ? 'sidebar-content--flush' : ''
        }`}
      >
        <div style={{ display: activeTab === 'traits' ? 'block' : 'none' }}>
          <TraitsProvider>
            {({ traits }) => {
              if (!traits.length) {
                return (
                  <div className="panel-wrapper panel-wrapper--padded gjs-one-bg gjs-two-color">
                    <div className="empty-state">
                      Select a component on the canvas to edit its settings.
                    </div>
                  </div>
                );
              }

              const groups = groupTraitsByCategory(traits);

              return (
                <div className="panel-wrapper panel-wrapper--padded gjs-one-bg gjs-two-color">
                  {groups.map(([category, groupTraits]) => (
                    <Fragment key={category}>
                      <h4 className="property-group-title">{category}</h4>
                      {groupTraits.map((trait) => renderTraitInput(trait))}
                    </Fragment>
                  ))}
                </div>
              );
            }}
          </TraitsProvider>
        </div>
        <StyleManagerPanel isVisible={activeTab === 'styles'} />
      </div>
    </div>
  );
}
