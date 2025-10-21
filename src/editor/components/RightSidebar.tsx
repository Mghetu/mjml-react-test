// src/editor/components/RightSidebar.tsx
import { Fragment, useState } from 'react';
import { StylesProvider, TraitsProvider } from '@grapesjs/react';
import type { Property, Sector, Trait } from 'grapesjs';
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

function normalizePropertyValue(property: Property) {
  const value = property.getValue ? property.getValue({}) : (property as any).get?.('value');

  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
}

function updatePropertyValue(property: Property, value: string) {
  if (typeof (property as any).setValue === 'function') {
    (property as any).setValue(value, true);
    return;
  }

  property.set('value', value);
}

function renderPropertyInput(property: Property) {
  const type = property.getType?.() || (property as any).get?.('type');
  const id = property.getId?.() || property.getName?.() || property.cid;
  const label = property.getLabel?.({ locale: false }) || property.getName?.() || id;
  const description = (property as any).get?.('description');
  const inputId = `style-${id}`;

  const value = normalizePropertyValue(property);

  const options = ((property as any).getOptions?.() || (property as any).get?.('options') || []) as Array<any>;

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

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    updatePropertyValue(property, event.target.value);
  };

  switch (type) {
    case 'select':
    case 'radio': {
      const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        updatePropertyValue(property, event.target.value);
      };

      return (
        <div key={id} className="property-item">
          <label htmlFor={inputId} className="property-label">
            {label}
          </label>
          <select
            id={inputId}
            className="property-select"
            value={value}
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
    default: {
      return (
        <div key={id} className="property-item">
          <label htmlFor={inputId} className="property-label">
            {label}
          </label>
          <input
            id={inputId}
            type="text"
            className="property-input"
            value={value}
            onChange={handleTextChange}
            placeholder={(property as any).get?.('placeholder')}
          />
          {description && <p className="property-description">{description}</p>}
        </div>
      );
    }
  }
}

function groupStyleSectors(sectors: Sector[]) {
  return sectors.map((sector) => {
    const id = sector.getId?.() || (sector as any).get?.('id') || sector.cid;
    const label = (sector as any).getLabel?.({ locale: false }) || sector.getName?.() || id;
    const properties = sector.getProperties?.() || [];
    return {
      id,
      label,
      properties,
    };
  });
}

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState<'traits' | 'styles'>('traits');

  return (
    <div className="right-sidebar">
      <div className="sidebar-header">
        <h3>Properties</h3>
      </div>

      <div className="sidebar-tabs">
        <button
          className={`tab-button ${activeTab === 'traits' ? 'active' : ''}`}
          onClick={() => setActiveTab('traits')}
        >
          Settings
        </button>
        <button
          className={`tab-button ${activeTab === 'styles' ? 'active' : ''}`}
          onClick={() => setActiveTab('styles')}
        >
          Style
        </button>
      </div>

      <div className="sidebar-content">
        <div style={{ display: activeTab === 'traits' ? 'block' : 'none' }}>
          <TraitsProvider>
            {({ traits }) => {
              if (!traits.length) {
                return (
                  <div className="panel-wrapper panel-wrapper--padded">
                    <div className="empty-state">
                      Select a component on the canvas to edit its settings.
                    </div>
                  </div>
                );
              }

              const groups = groupTraitsByCategory(traits);

              return (
                <div className="panel-wrapper panel-wrapper--padded">
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
        <div style={{ display: activeTab === 'styles' ? 'block' : 'none' }}>
          <StylesProvider>
            {({ sectors }) => {
              const groups = groupStyleSectors(sectors);
              const hasProperties = groups.some((group) => group.properties.length > 0);

              if (!hasProperties) {
                return (
                  <div className="panel-wrapper panel-wrapper--padded">
                    <div className="empty-state">
                      Choose an element to view and adjust its style properties.
                    </div>
                  </div>
                );
              }

              return (
                <div className="panel-wrapper panel-wrapper--padded">
                  {groups.map((group) => (
                    <Fragment key={group.id}>
                      <h4 className="property-group-title">{group.label}</h4>
                      {group.properties.map((property) => renderPropertyInput(property))}
                    </Fragment>
                  ))}
                </div>
              );
            }}
          </StylesProvider>
        </div>
      </div>
    </div>
  );
}
