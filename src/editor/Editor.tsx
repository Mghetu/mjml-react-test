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
      const GROUP_TRAIT_NAME = 'useGroup';
      const GROUP_LABEL = 'Group columns';
      const GROUP_DISABLED_LABEL = 'Group columns (need ≥ 2 columns)';
      const GROUP_WARNING_MESSAGE =
        'Need at least two columns to group columns inside this section.';

      type SectionComponent = GrapesComponent & {
        __groupCollections?: Map<string, ReturnType<GrapesComponent['components']>>;
        __groupTraitSetup?: boolean;
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

      const getDirectChildren = (section: GrapesComponent) =>
        collectionToArray(section.components());

      const getDirectGroups = (section: SectionComponent) =>
        getDirectChildren(section).filter((child) => child.is('mj-group'));

      const getAllColumns = (section: SectionComponent) => {
        const ordered: GrapesComponent[] = [];
        const children = getDirectChildren(section);

        children.forEach((child) => {
          if (child.is('mj-column')) {
            ordered.push(child);
          } else if (child.is('mj-group')) {
            ordered.push(
              ...collectionToArray(child.components()).filter((grandChild) =>
                grandChild.is('mj-column'),
              ),
            );
          }
        });

        return ordered;
      };

      const ensureGroupTrait = (section: SectionComponent) => {
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
      };

      const setUseGroup = (
        section: SectionComponent,
        value: boolean,
        options?: { fromLoad?: boolean; fromAuto?: boolean; fromSync?: boolean },
      ) => {
        section.set(GROUP_TRAIT_NAME, value, options as unknown as Record<string, unknown>);
      };

      const notifyGroupingRequirement = (section: SectionComponent) => {
        section.em?.logWarning(GROUP_WARNING_MESSAGE);
      };

      const canGroupColumns = (section: SectionComponent) => getAllColumns(section).length >= 2;

      const wrapColumnsIntoGroup = (section: SectionComponent): GrapesComponent | null => {
        const children = getDirectChildren(section);
        const orderedColumns = getAllColumns(section);

        if (!orderedColumns.length) {
          return getDirectGroups(section)[0] ?? null;
        }

        let group = getDirectGroups(section)[0];

        if (!group) {
          const firstIndex = children.findIndex(
            (child) => child.is('mj-column') || child.is('mj-group'),
          );
          const insertIndex = firstIndex >= 0 ? firstIndex : children.length;
          group = section.append<GrapesComponent>({ type: 'mj-group' }, { at: insertIndex })?.[0] ?? null;
        }

        if (!group) {
          return null;
        }

        orderedColumns.forEach((column, index) => {
          group.append(column, { at: index });
        });

        getDirectGroups(section)
          .filter((candidate) => candidate !== group)
          .forEach((extraGroup) => {
            collectionToArray(extraGroup.components()).forEach((column) => {
              if (column.is('mj-column')) {
                group.append(column);
              }
            });

            extraGroup.remove();
          });

        return group;
      };

      const unwrapColumnsFromGroup = (section: SectionComponent) => {
        const groups = getDirectGroups(section);

        groups.forEach((group) => {
          const groupColumns = collectionToArray(group.components()).filter((child) =>
            child.is('mj-column'),
          );
          const sectionChildren = getDirectChildren(section);
          let insertIndex = sectionChildren.indexOf(group);

          if (insertIndex < 0) {
            insertIndex = sectionChildren.length;
          }

          groupColumns.forEach((column) => {
            section.append(column, { at: insertIndex });
            insertIndex += 1;
          });

          group.remove();
        });
      };

      const bindGroupCollections = (section: SectionComponent) => {
        const groups = getDirectGroups(section);
        const activeMap =
          section.__groupCollections ?? new Map<string, ReturnType<GrapesComponent['components']>>();

        [...activeMap.entries()].forEach(([groupId, collection]) => {
          if (!groups.some((group) => group.cid === groupId)) {
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
      };

      const selectGroupComponent = (
        section: SectionComponent,
        group: GrapesComponent | null,
        options?: { fromLoad?: boolean; fromAuto?: boolean; fromSync?: boolean },
      ) => {
        if (!group || options?.fromLoad || options?.fromAuto || options?.fromSync) {
          return;
        }

        const editorInstance = section.em;
        if (editorInstance && typeof editorInstance.setSelected === 'function') {
          editorInstance.setSelected(group);
        }
      };

      const updateGroupTraitAvailability = (section: SectionComponent) => {
        const trait = section.getTrait(GROUP_TRAIT_NAME) as GrapesTrait | undefined;

        if (!trait) {
          return;
        }

        const canGroup = canGroupColumns(section);
        trait.set('label', canGroup ? GROUP_LABEL : GROUP_DISABLED_LABEL);

        bindGroupCollections(section);

        if (!canGroup && section.get(GROUP_TRAIT_NAME)) {
          setUseGroup(section, false, { fromAuto: true });
        }
      };

      const normalizeInitialGrouping = (section: SectionComponent) => {
        const totalColumns = getAllColumns(section).length;
        const hasGroup = getDirectGroups(section).length > 0;
        const isGrouped = Boolean(section.get(GROUP_TRAIT_NAME));

        if (hasGroup && totalColumns >= 2 && !isGrouped) {
          setUseGroup(section, true, { fromLoad: true });
        }

        if ((!hasGroup || totalColumns < 2) && isGrouped) {
          setUseGroup(section, false, { fromAuto: true });
        }

        if (hasGroup && totalColumns < 2) {
          unwrapColumnsFromGroup(section);
        }

        updateGroupTraitAvailability(section);
      };

      const handleUseGroupChange = (
        section: SectionComponent,
        _model: GrapesComponent,
        value: boolean,
        options?: { fromLoad?: boolean; fromAuto?: boolean; fromSync?: boolean },
      ) => {
        const changeOptions = options ?? {};

        if (value) {
          if (!canGroupColumns(section)) {
            if (!changeOptions.fromLoad && !changeOptions.fromAuto && !changeOptions.fromSync) {
              notifyGroupingRequirement(section);
            }

            if (section.get(GROUP_TRAIT_NAME)) {
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
      };

      const setupGroupTrait = (section: SectionComponent) => {
        if (section.__groupTraitSetup) {
          return;
        }

        section.__groupTraitSetup = true;

        ensureGroupTrait(section);

        if (typeof section.get(GROUP_TRAIT_NAME) !== 'boolean') {
          section.set(GROUP_TRAIT_NAME, false, { silent: true });
        }

        const updateAvailability = () => updateGroupTraitAvailability(section);

        section.on(
          `change:${GROUP_TRAIT_NAME}`,
          (model: GrapesComponent, value: boolean, changeOpts?: { fromLoad?: boolean; fromAuto?: boolean; fromSync?: boolean }) =>
            handleUseGroupChange(section, model, Boolean(value), changeOpts),
        );

        section.on('component:add component:remove component:reset', updateAvailability);

        const sectionChildren = section.components();
        if (sectionChildren) {
          section.listenTo(sectionChildren, 'add remove reset', updateAvailability);
        }

        updateAvailability();
        normalizeInitialGrouping(section);
      };

      const visitSections = (root: GrapesComponent) => {
        if (root.is('mj-section')) {
          setupGroupTrait(root as SectionComponent);
        }

        collectionToArray(root.components()).forEach((child) => visitSections(child));
      };

      editor.on('component:add', (component: GrapesComponent) => {
        if (component.is('mj-section')) {
          setupGroupTrait(component as SectionComponent);
        }
      });

      const wrapper = editor.getWrapper();
      if (wrapper) {
        visitSections(wrapper);
      }
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
