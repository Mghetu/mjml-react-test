// src/editor/Editor.tsx
import { useCallback, useEffect, useRef } from 'react';
import grapesjs, {
  type Component as GrapesComponent,
  type Editor as GrapesEditor,
  type Trait as GrapesTrait,
  type TraitProperties,
} from 'grapesjs';
import GjsEditor, { Canvas, WithEditor } from '@grapesjs/react';
import mjmlPlugin from 'grapesjs-mjml';

import Topbar from './components/Topbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';

import 'grapesjs/dist/css/grapes.min.css';
import './editor.css';

export default function Editor() {
  const editorRef = useRef<GrapesEditor | null>(null);

  useEffect(() => {
    return () => {
      const editor = editorRef.current;
      if (editor) {
        editor.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleEditorReady = useCallback((editor: GrapesEditor) => {
    editorRef.current = editor;

    (window as unknown as { editor?: GrapesEditor }).editor = editor;
    console.log('Editor loaded with React UI');

    const extendMjSection = () => {
      const domComponents = editor.DomComponents;
      const sectionType = domComponents.getType('mj-section');

      if (!sectionType) {
        return;
      }

      const GROUP_TRAIT_NAME = 'useGroup';
      const GROUP_LABEL = 'Group columns';
      const GROUP_DISABLED_LABEL = 'Group columns (need ≥ 2 columns)';
      const GROUP_WARNING_MESSAGE =
        'Need at least two columns to group columns inside this section.';

      const SectionModel = sectionType.model;
      const SectionView = sectionType.view;

      type SectionComponent = GrapesComponent & {
        __groupCollections?: Map<string, ReturnType<GrapesComponent['components']>>;
      };

      const collectionToArray = (
        collection: ReturnType<GrapesComponent['components']> | undefined,
      ): GrapesComponent[] => {
        if (!collection) {
          return [];
        }

        const models = (collection as unknown as { models?: GrapesComponent[] }).models;
        return Array.isArray(models) ? [...models] : [];
      };

      const gatherColumns = (
        root: GrapesComponent,
        columns: GrapesComponent[],
      ) => {
        const children = collectionToArray(root.components());
        children.forEach((child) => {
          if (child.is('mj-column')) {
            columns.push(child);
            return;
          }

          gatherColumns(child, columns);
        });
      };

      function getChildGroups(section: SectionComponent) {
        const children = collectionToArray(section.components());
        return children.filter((child) => child.is('mj-group'));
      }

      function getSectionColumns(section: SectionComponent) {
        const columns: GrapesComponent[] = [];
        gatherColumns(section, columns);
        return columns;
      }

      function canGroupColumns(section: SectionComponent) {
        return getSectionColumns(section).length >= 2;
      }

      function ensureGroupTrait(section: SectionComponent) {
        const existingTrait = section.getTrait(GROUP_TRAIT_NAME) as GrapesTrait | undefined;

        if (!existingTrait) {
          section.addTrait([
            {
              type: 'checkbox',
              name: GROUP_TRAIT_NAME,
              label: GROUP_LABEL,
              changeProp: true,
            } as TraitProperties,
          ]);
          return;
        }

        if (existingTrait.get('type') !== 'checkbox') {
          existingTrait.set('type', 'checkbox');
        }

        if (existingTrait.get('changeProp') !== true) {
          existingTrait.set('changeProp', true);
        }

        if (existingTrait.get('label') !== GROUP_LABEL) {
          existingTrait.set('label', GROUP_LABEL);
        }
      }

      function notifyGroupingRequirement(section: SectionComponent) {
        section.em?.logWarning(GROUP_WARNING_MESSAGE);
      }

      function setUseGroup(
        section: SectionComponent,
        value: boolean,
        options?: { fromLoad?: boolean; fromAuto?: boolean; fromSync?: boolean },
      ) {
        section.set('useGroup', value, options as unknown as Record<string, unknown>);
      }

      function wrapColumnsIntoGroup(section: SectionComponent): GrapesComponent | null {
        const sectionChildren = collectionToArray(section.components());
        const orderedColumns: GrapesComponent[] = [];
        sectionChildren.forEach((child) => gatherColumns(child, orderedColumns));

        if (!orderedColumns.length) {
          return getChildGroups(section)[0] ?? null;
        }

        let group = getChildGroups(section)[0];

        if (!group) {
          const firstColumnIndex = sectionChildren.findIndex(
            (child) => child.is('mj-column') || child.is('mj-group'),
          );
          const insertIndex = firstColumnIndex >= 0 ? firstColumnIndex : sectionChildren.length;
          const createdGroup = section.append<GrapesComponent>({ type: 'mj-group' }, { at: insertIndex })?.[0];
          group = createdGroup ?? null;
        }

        if (!group) {
          return null;
        }

        orderedColumns.forEach((column, index) => {
          group.append(column, { at: index });
        });

        getChildGroups(section)
          .filter((candidate) => candidate !== group)
          .forEach((extraGroup) => {
            const extraColumns = collectionToArray(extraGroup.components()).filter((column) =>
              column.is('mj-column'),
            );

            extraColumns.forEach((column) => {
              group.append(column);
            });

            extraGroup.remove();
          });

        return group;
      }

      function unwrapColumnsFromGroup(section: SectionComponent) {
        let groups = getChildGroups(section);

        while (groups.length) {
          const currentGroup = groups[0];
          const sectionChildren = collectionToArray(section.components());
          let insertIndex = sectionChildren.indexOf(currentGroup);

          if (insertIndex < 0) {
            insertIndex = sectionChildren.length;
          }

          const groupColumns = collectionToArray(currentGroup.components()).filter((child) =>
            child.is('mj-column'),
          );

          groupColumns.forEach((column, offset) => {
            section.append(column, { at: insertIndex + offset });
          });

          currentGroup.remove();
          groups = getChildGroups(section);
        }
      }

      function bindGroupCollections(section: SectionComponent) {
        const groups = getChildGroups(section);
        const activeMap =
          section.__groupCollections ?? new Map<string, ReturnType<GrapesComponent['components']>>();

        [...activeMap.entries()].forEach(([groupId, collection]) => {
          const stillPresent = groups.some((group) => group.cid === groupId);
          if (!stillPresent) {
            section.stopListening(collection);
            activeMap.delete(groupId);
          }
        });

        groups.forEach((group) => {
          const collection = group.components();
          if (!activeMap.has(group.cid)) {
            section.listenTo(collection, 'add remove reset', () => updateGroupTraitAvailability(section));
            activeMap.set(group.cid, collection);
          }
        });

        section.__groupCollections = activeMap;
      }

      function selectGroupComponent(
        section: SectionComponent,
        group: GrapesComponent | null | undefined,
        options?: { fromLoad?: boolean; fromAuto?: boolean; fromSync?: boolean },
      ) {
        if (!group || options?.fromLoad || options?.fromAuto || options?.fromSync) {
          return;
        }

        const editor = section.em;
        if (editor && typeof editor.setSelected === 'function') {
          editor.setSelected(group);
        }
      }

      function updateGroupTraitAvailability(section: SectionComponent) {
        const trait = section.getTrait(GROUP_TRAIT_NAME) as GrapesTrait | undefined;

        if (!trait) {
          return;
        }

        const canGroup = canGroupColumns(section);
        const nextLabel = canGroup ? GROUP_LABEL : GROUP_DISABLED_LABEL;

        if (trait.get('label') !== nextLabel) {
          trait.set('label', nextLabel);
        }

        bindGroupCollections(section);

        if (!canGroup && section.get('useGroup')) {
          setUseGroup(section, false, { fromAuto: true });
        }
      }

      function normalizeInitialGrouping(section: SectionComponent) {
        const columnCount = getSectionColumns(section).length;
        const hasGroup = getChildGroups(section).length > 0;
        const currentUseGroup = Boolean(section.get('useGroup'));

        if (hasGroup && columnCount >= 2 && !currentUseGroup) {
          setUseGroup(section, true, { fromLoad: true });
        } else if ((!hasGroup || columnCount < 2) && currentUseGroup) {
          setUseGroup(section, false, { fromAuto: true });
        }

        if (hasGroup && columnCount < 2) {
          unwrapColumnsFromGroup(section);
        }

        updateGroupTraitAvailability(section);
      }

      function handleUseGroupChange(
        section: SectionComponent,
        _model: GrapesComponent,
        value: boolean,
        options?: { fromLoad?: boolean; fromAuto?: boolean; fromSync?: boolean },
      ) {
        const changeOptions = options ?? {};

        if (value) {
          if (!canGroupColumns(section)) {
            if (!changeOptions.fromLoad && !changeOptions.fromAuto && !changeOptions.fromSync) {
              notifyGroupingRequirement(section);
            }

            if (section.get('useGroup')) {
              setUseGroup(section, false, { fromAuto: true });
            }

            return;
          }

          const group = wrapColumnsIntoGroup(section);
          updateGroupTraitAvailability(section);
          selectGroupComponent(section, group, changeOptions);
          return;
        }

        unwrapColumnsFromGroup(section);
        updateGroupTraitAvailability(section);
      }

      const ExtendedSectionModel = SectionModel.extend(
        {
          defaults(this: SectionComponent, ...args: unknown[]) {
            const baseDefaults = SectionModel.prototype.defaults;
            const resolvedDefaults =
              typeof baseDefaults === 'function'
                ? (baseDefaults as (...params: unknown[]) => Record<string, unknown>).call(
                    this,
                    ...args,
                  )
                : (baseDefaults as Record<string, unknown> | undefined) ?? {};
            const traits = Array.isArray((resolvedDefaults as { traits?: unknown }).traits)
              ? [
                  ...((resolvedDefaults as { traits: unknown[] }).traits as unknown[]),
                ]
              : (resolvedDefaults as { traits?: unknown }).traits;

            return {
              ...resolvedDefaults,
              useGroup: false,
              traits,
            };
          },

          init(this: SectionComponent, ...args: unknown[]) {
            SectionModel.prototype.init.apply(this, args as []);
            const section = this as SectionComponent;

            ensureGroupTrait(section);

            if (typeof section.get('useGroup') !== 'boolean') {
              section.set('useGroup', false, { silent: true });
            }

            const updateAvailability = () => updateGroupTraitAvailability(section);

            section.on(
              'change:useGroup',
              (model: GrapesComponent, value: boolean, changeOpts?: { fromLoad?: boolean; fromAuto?: boolean; fromSync?: boolean }) =>
                handleUseGroupChange(section, model, Boolean(value), changeOpts),
            );
            section.on('component:add', updateAvailability);
            section.on('component:remove', updateAvailability);

            const components = section.components();
            if (components) {
              section.listenTo(components, 'add remove reset', updateAvailability);
            }

            updateAvailability();
            normalizeInitialGrouping(section);
          },
        },
        {
          isComponent: SectionModel.isComponent,
        },
      );

      domComponents.addType('mj-section', {
        model: ExtendedSectionModel,
        view: SectionView,
      });
    };

    extendMjSection();

    // Add the Microsoft Aptos system font to the typography control
    const registerAptosFont = () => {
      const styleManager = editor.StyleManager as unknown as {
        getProperty: (sector: string, id: string) => unknown;
      };
      const fontProperty =
        (styleManager?.getProperty?.('typography', 'font-family') as {
          getOptions?: () => unknown;
          get?: (key: string) => unknown;
          setOptions?: (options: unknown) => void;
          addOption?: (option: unknown) => void;
          set?: (key: string, value: unknown) => void;
        } | undefined) ?? undefined;

      if (!fontProperty) {
        return;
      }

      const aptosStack = 'Aptos, Calibri, "Trebuchet MS", sans-serif';
      const aptosOption = { id: aptosStack, label: 'Aptos (system)' };
      const rawOptions =
        typeof fontProperty.getOptions === 'function'
          ? fontProperty.getOptions()
          : fontProperty.get?.('options') ?? fontProperty.get?.('list');
      const options: unknown[] = Array.isArray(rawOptions) ? rawOptions : [];

      const hasAptos = options.some((option) => {
        if (typeof option === 'string') {
          return option.toLowerCase().includes('aptos');
        }

        if (option && typeof option === 'object') {
          const candidate =
            (option as { id?: unknown }).id ?? (option as { value?: unknown }).value;
          return typeof candidate === 'string' && candidate.toLowerCase().includes('aptos');
        }

        return false;
      });

      if (hasAptos) {
        return;
      }

      const updatedOptions = [aptosOption, ...options];

      if (typeof fontProperty.setOptions === 'function') {
        fontProperty.setOptions(updatedOptions);
      } else if (typeof fontProperty.addOption === 'function') {
        fontProperty.addOption(aptosOption);
      } else if (typeof fontProperty.set === 'function') {
        fontProperty.set('options', updatedOptions);
      }
    };

    registerAptosFont();
    editor.on('load', registerAptosFont);

    // Add initial MJML content
    editor.setComponents(`
          <mjml>
            <mj-body>
              <mj-section>
                <mj-column>
                  <mj-text>
                    <h1>Welcome to MJML Editor</h1>
                    <p>Drag and drop blocks from the left panel to build your email.</p>
                  </mj-text>
                  <mj-button href="#">
                    Click Me
                  </mj-button>
                </mj-column>
              </mj-section>
            </mj-body>
          </mjml>
        `);

    console.log('Available blocks:', editor.BlockManager.getAll().length);
  }, []);

  return (
    <GjsEditor
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      options={{
        height: '100vh',
        storageManager: false,
        plugins: [mjmlPlugin],
      }}
      onEditor={handleEditorReady}
    >
      <div className="editor-container gjs-one-bg gjs-two-color">
        <WithEditor>
          <Topbar />
        </WithEditor>
        <div className="editor-body">
          <LeftSidebar />
          <div className="canvas-container">
            <Canvas className="canvas-area" />
          </div>
          <RightSidebar />
        </div>
      </div>
    </GjsEditor>
  );
}
