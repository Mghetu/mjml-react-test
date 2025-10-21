// src/editor/Editor.tsx
import { useCallback, useEffect, useRef } from 'react';
import grapesjs, {
  type Component as GrapesComponent,
  type Editor as GrapesEditor,
  type Trait as GrapesTrait,
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
        'You need at least two columns in this section to enable grouping.';

      const domComponents = editor.DomComponents;
      const baseSectionType = domComponents.getType('mj-section');

      if (!baseSectionType) {
        return;
      }

      type ComponentCollection = ReturnType<GrapesComponent['components']>;

      type SectionModel = GrapesComponent & {
        __groupCollections?: Map<string, ComponentCollection>;
        ensureGroupTrait: () => void;
        logGroupingWarning: () => void;
        getSectionChildren: () => GrapesComponent[];
        getDirectColumns: () => GrapesComponent[];
        getDirectGroups: () => GrapesComponent[];
        getOrderedColumns: () => GrapesComponent[];
        canGroupColumns: () => boolean;
        bindGroupCollections: () => void;
        normalizeInitialGrouping: () => void;
        updateGroupTraitState: () => void;
        handleGroupToggle: (
          model: GrapesComponent,
          value: boolean,
          options?: GroupChangeOptions,
        ) => void;
        wrapColumnsIntoGroup: () => GrapesComponent | null;
        unwrapColumnsFromGroups: () => void;
        setUseGroupTrait: (value: boolean, options?: GroupChangeOptions) => void;
      };

      type GroupChangeOptions = {
        fromGuard?: boolean;
        fromStateUpdate?: boolean;
        fromInit?: boolean;
      };

      const collectionToArray = (
        collection: ComponentCollection | undefined,
      ): GrapesComponent[] => {
        if (!collection) {
          return [];
        }

        const models = (collection as unknown as { models?: GrapesComponent[] }).models;
        return Array.isArray(models) ? [...models] : [];
      };

      const sectionModel = baseSectionType.model.extend(
        {
          defaults: {
            ...baseSectionType.model.prototype.defaults,
            [GROUP_TRAIT_NAME]: false,
            canGroup: false,
          },

          init(this: SectionModel, ...args: unknown[]) {
            baseSectionType.model.prototype.init.apply(this, args as never);

            this.__groupCollections = new Map();

            this.ensureGroupTrait();
            this.on(`change:${GROUP_TRAIT_NAME}`, this.handleGroupToggle);
            this.on('component:add component:remove component:reset', this.updateGroupTraitState);

            const children = this.components();
            if (children) {
              this.listenTo(children, 'add remove reset', this.updateGroupTraitState);
            }

            this.normalizeInitialGrouping();
            this.updateGroupTraitState();
          },

          ensureGroupTrait(this: SectionModel) {
            const existingTrait = this.getTrait(GROUP_TRAIT_NAME) as GrapesTrait | undefined;

            if (!existingTrait) {
              this.addTrait([
                {
                  type: 'checkbox',
                  name: GROUP_TRAIT_NAME,
                  label: GROUP_LABEL,
                  changeProp: true,
                },
              ]);
              return;
            }

            if (existingTrait.get('type') !== 'checkbox') {
              existingTrait.set('type', 'checkbox');
            }

            if (existingTrait.get('changeProp') !== true) {
              existingTrait.set('changeProp', true);
            }

            existingTrait.set('label', GROUP_LABEL);
          },

          setUseGroupTrait(this: SectionModel, value: boolean, options?: GroupChangeOptions): void {
            const castOptions = options
              ? (options as unknown as Record<string, unknown>)
              : undefined;

            this.set(GROUP_TRAIT_NAME, value, castOptions);
          },

          logGroupingWarning(this: SectionModel) {
            this.em?.logWarning(GROUP_WARNING_MESSAGE);
          },

          getSectionChildren(this: SectionModel): GrapesComponent[] {
            return collectionToArray(this.components());
          },

          getDirectColumns(this: SectionModel): GrapesComponent[] {
            return this.getSectionChildren().filter((child) => child.is('mj-column'));
          },

          getDirectGroups(this: SectionModel): GrapesComponent[] {
            return this.getSectionChildren().filter((child) => child.is('mj-group'));
          },

          getOrderedColumns(this: SectionModel): GrapesComponent[] {
            const ordered: GrapesComponent[] = [];

            this.getSectionChildren().forEach((child) => {
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
          },

          canGroupColumns(this: SectionModel): boolean {
            const groups = this.getDirectGroups();
            const directColumns = this.getDirectColumns();
            const orderedColumns = this.getOrderedColumns();

            if (groups.length > 0) {
              return orderedColumns.length >= 2;
            }

            return directColumns.length >= 2;
          },

          bindGroupCollections(this: SectionModel): void {
            const groups = this.getDirectGroups();
            const activeMap = this.__groupCollections ?? new Map<string, ComponentCollection>();

            [...activeMap.entries()].forEach(([groupId, collection]) => {
              if (!groups.some((group) => group.cid === groupId)) {
                this.stopListening(collection);
                activeMap.delete(groupId);
              }
            });

            groups.forEach((group) => {
              const collection = group.components();
              if (!collection || activeMap.has(group.cid)) {
                return;
              }

              this.listenTo(collection, 'add remove reset', this.updateGroupTraitState);
              activeMap.set(group.cid, collection);
            });

            this.__groupCollections = activeMap;
          },

          normalizeInitialGrouping(this: SectionModel): void {
            const hasGroup = this.getDirectGroups().length > 0;
            const totalColumns = this.getOrderedColumns().length;
            const wantsGroup = Boolean(this.get(GROUP_TRAIT_NAME));

            if (wantsGroup) {
              if (totalColumns >= 2) {
                this.wrapColumnsIntoGroup();
              } else {
                this.setUseGroupTrait(false, { fromInit: true });
                this.unwrapColumnsFromGroups();
              }
              return;
            }

            if (hasGroup) {
              if (totalColumns >= 2) {
                this.setUseGroupTrait(true, { fromInit: true });
              } else {
                this.unwrapColumnsFromGroups();
              }
            }
          },

          updateGroupTraitState(this: SectionModel): void {
            const trait = this.getTrait(GROUP_TRAIT_NAME) as GrapesTrait | undefined;

            if (!trait) {
              return;
            }

            const canGroup = this.canGroupColumns();
            const label = canGroup ? GROUP_LABEL : GROUP_DISABLED_LABEL;

            if (trait.get('label') !== label) {
              trait.set('label', label);
            }

            if (this.get('canGroup') !== canGroup) {
              this.set('canGroup', canGroup);
            }

            this.bindGroupCollections();

            if (!canGroup && this.get(GROUP_TRAIT_NAME)) {
              this.setUseGroupTrait(false, { fromStateUpdate: true });
            }
          },

          handleGroupToggle(
            this: SectionModel,
            _model: GrapesComponent,
            value: boolean,
            options?: GroupChangeOptions,
          ): void {
            const changeOptions = options ?? {};
            const wantsGroup = Boolean(value);
            const canGroup = this.canGroupColumns();
            const triggeredByUser =
              !changeOptions.fromGuard && !changeOptions.fromStateUpdate && !changeOptions.fromInit;

            if (wantsGroup) {
              if (!canGroup) {
                if (triggeredByUser) {
                  this.logGroupingWarning();
                }

                if (this.get(GROUP_TRAIT_NAME)) {
                  this.setUseGroupTrait(false, { fromGuard: true });
                }

                return;
              }

              const group = this.wrapColumnsIntoGroup();
              this.updateGroupTraitState();

              if (group && triggeredByUser) {
                const editorInstance = this.em;
                if (editorInstance && typeof editorInstance.setSelected === 'function') {
                  editorInstance.setSelected(group);
                }
              }

              return;
            }

            this.unwrapColumnsFromGroups();
            this.updateGroupTraitState();
          },

          wrapColumnsIntoGroup(this: SectionModel): GrapesComponent | null {
            const orderedColumns = this.getOrderedColumns();
            const groups = this.getDirectGroups();

            if (!orderedColumns.length) {
              groups.slice(1).forEach((group) => group.remove());
              return groups[0] ?? null;
            }

            let targetGroup: GrapesComponent | null = groups[0] ?? null;

            if (!targetGroup) {
              const children = this.getSectionChildren();
              const insertIndex = children.findIndex(
                (child) => child.is('mj-column') || child.is('mj-group'),
              );
              const atIndex = insertIndex >= 0 ? insertIndex : children.length;
              const created = this.append({ type: 'mj-group' }, { at: atIndex }) as unknown;

              if (Array.isArray(created)) {
                targetGroup = (created[0] as GrapesComponent | undefined) ?? null;
              } else {
                targetGroup = (created as GrapesComponent | undefined) ?? null;
              }
            }

            if (!targetGroup) {
              return null;
            }

            orderedColumns.forEach((column, index) => {
              targetGroup.append(column, { at: index });
            });

            this.getDirectGroups()
              .filter((group) => group !== targetGroup)
              .forEach((extraGroup) => extraGroup.remove());

            return targetGroup;
          },

          unwrapColumnsFromGroups(this: SectionModel): void {
            const groups = this.getDirectGroups();

            groups.forEach((group) => {
              const groupColumns = collectionToArray(group.components()).filter((child) =>
                child.is('mj-column'),
              );
              const sectionChildren = this.getSectionChildren();
              let insertIndex = sectionChildren.indexOf(group);

              if (insertIndex < 0) {
                insertIndex = sectionChildren.length;
              }

              groupColumns.forEach((column) => {
                this.append(column, { at: insertIndex });
                insertIndex += 1;
              });

              group.remove();
            });
          },
        },
        {
          isComponent: baseSectionType.model.isComponent,
        },
      );

      domComponents.addType('mj-section', {
        model: sectionModel,
        view: baseSectionType.view,
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
