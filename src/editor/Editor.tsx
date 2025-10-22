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

type ComponentCollection = ReturnType<GrapesComponent['components']>;

type ExtendedEditor = GrapesEditor & {
  __initialContentApplied?: boolean;
  __aptosFontRegistered?: boolean;
  __mjSectionExtended?: boolean;
  __mjSectionExtensionScheduled?: boolean;
};

const INITIAL_MJML_TEMPLATE = `
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
`;

const collectionToArray = (
  collection: ComponentCollection | undefined,
): GrapesComponent[] => {
  if (!collection) {
    return [];
  }

  const models = (collection as unknown as { models?: GrapesComponent[] }).models;
  return Array.isArray(models) ? [...models] : [];
};

const ensureInitialContent = (editor: ExtendedEditor) => {
  if (editor.__initialContentApplied) {
    return;
  }

  const wrapper = editor.getWrapper();
  const bodies = wrapper?.findType?.('mj-body') ?? [];
  const firstBody = Array.isArray(bodies) ? (bodies[0] as GrapesComponent | undefined) : undefined;
  const hasBodyContent = firstBody
    ? collectionToArray(firstBody.components()).some((child) => child.is('mj-section'))
    : false;

  if (!hasBodyContent) {
    editor.setComponents(INITIAL_MJML_TEMPLATE);
  }

  editor.__initialContentApplied = true;
};

type FontProperty = {
  getOptions?: () => unknown;
  get?: (key: string) => unknown;
  set?: (key: string, value: unknown) => void;
  setOptions?: (options: unknown) => void;
  addOption?: (option: unknown) => void;
};

const ensureAptosFontOption = (editor: ExtendedEditor, attempt = 0) => {
  if (editor.__aptosFontRegistered) {
    return;
  }

  const styleManager = editor.StyleManager as unknown as {
    getProperty?: (sector: string, id: string) => FontProperty | undefined;
    render?: () => void;
  };

  const fontProperty = styleManager?.getProperty?.('typography', 'font-family');

  if (!fontProperty) {
    if (attempt < 5) {
      window.setTimeout(() => ensureAptosFontOption(editor, attempt + 1), 100 * (attempt + 1));
    }
    return;
  }

  const aptosStack = 'Aptos, Calibri, "Trebuchet MS", sans-serif';
  const aptosOption = { id: aptosStack, label: 'Aptos (system)' };

  const rawOptions =
    typeof fontProperty.getOptions === 'function'
      ? fontProperty.getOptions()
      : fontProperty.get?.('options') ?? fontProperty.get?.('list');

  const options: unknown[] = Array.isArray(rawOptions) ? rawOptions : [];

  const isAptosOption = (option: unknown) => {
    if (typeof option === 'string') {
      return option.toLowerCase().includes('aptos');
    }

    if (option && typeof option === 'object') {
      const candidate =
        (option as { id?: unknown }).id ?? (option as { value?: unknown }).value ?? null;
      return typeof candidate === 'string' && candidate.toLowerCase().includes('aptos');
    }

    return false;
  };

  if (options.some(isAptosOption)) {
    editor.__aptosFontRegistered = true;
    return;
  }

  const updatedOptions = [aptosOption, ...options];

  if (typeof fontProperty.setOptions === 'function') {
    fontProperty.setOptions(updatedOptions);
  } else if (typeof fontProperty.addOption === 'function') {
    fontProperty.addOption(aptosOption);
  }

  if (typeof fontProperty.set === 'function') {
    fontProperty.set('options', updatedOptions);

    const existingList = fontProperty.get?.('list');
    if (Array.isArray(existingList)) {
      const filteredList = existingList.filter((option) => !isAptosOption(option));
      fontProperty.set('list', [aptosOption, ...filteredList]);
    }
  }

  editor.__aptosFontRegistered = true;
  styleManager?.render?.();
};

type GroupChangeOptions = {
  fromGuard?: boolean;
  fromStateUpdate?: boolean;
  fromInit?: boolean;
};

type SectionModel = GrapesComponent & {
  __groupCollections?: Map<string, ComponentCollection>;
  setUseGroupTrait: (value: boolean, options?: GroupChangeOptions) => void;
  logGroupingWarning: () => void;
  getSectionChildren: () => GrapesComponent[];
  getDirectColumns: () => GrapesComponent[];
  getDirectGroups: () => GrapesComponent[];
  getOrderedColumns: () => GrapesComponent[];
  canGroupColumns: () => boolean;
  bindGroupCollections: () => void;
  updateGroupTraitState: () => void;
  handleGroupToggle: (
    model: GrapesComponent,
    value: boolean,
    options?: GroupChangeOptions,
  ) => void;
  wrapColumnsIntoGroup: () => GrapesComponent | null;
  unwrapColumnsFromGroups: () => void;
};

const extendMjSectionTrait = (editor: ExtendedEditor) => {
  if (editor.__mjSectionExtended) {
    return;
  }

  const GROUP_TRAIT_NAME = 'useGroup';
  const GROUP_LABEL = 'Group columns';
  const GROUP_DISABLED_LABEL = 'Group columns (need ≥ 2 columns)';
  const GROUP_WARNING_MESSAGE =
    'You need at least two columns in this section to enable grouping.';

  const domComponents = editor.DomComponents;
  const baseSectionType = domComponents.getType('mj-section');

  if (!baseSectionType) {
    if (!editor.__mjSectionExtensionScheduled) {
      editor.__mjSectionExtensionScheduled = true;
      window.setTimeout(() => {
        editor.__mjSectionExtensionScheduled = false;
        extendMjSectionTrait(editor);
      }, 0);
    }
    return;
  }

  const baseDefaults = baseSectionType.model.prototype.defaults ?? {};
  const baseTraits = Array.isArray(baseDefaults.traits)
    ? baseDefaults.traits.map((trait: unknown) =>
        typeof trait === 'string' ? trait : { ...(trait as Record<string, unknown>) },
      )
    : [];

  const traitIndex = baseTraits.findIndex((trait: unknown) => {
    if (typeof trait === 'string') {
      return trait === GROUP_TRAIT_NAME;
    }

    return (trait as { name?: string }).name === GROUP_TRAIT_NAME;
  });

  if (traitIndex === -1) {
    baseTraits.push({
      type: 'checkbox',
      name: GROUP_TRAIT_NAME,
      label: GROUP_LABEL,
      changeProp: true,
    });
  } else {
    const existingTrait = baseTraits[traitIndex];
    if (typeof existingTrait === 'string') {
      baseTraits[traitIndex] = {
        type: 'checkbox',
        name: GROUP_TRAIT_NAME,
        label: GROUP_LABEL,
        changeProp: true,
      };
    } else {
      baseTraits[traitIndex] = {
        ...existingTrait,
        type: 'checkbox',
        name: GROUP_TRAIT_NAME,
        label: GROUP_LABEL,
        changeProp: true,
      };
    }
  }

  const SectionModel = baseSectionType.model.extend(
    {
      defaults: {
        ...baseDefaults,
        traits: baseTraits,
        [GROUP_TRAIT_NAME]: false,
        canGroup: false,
      },

      init(this: SectionModel, ...args: unknown[]) {
        baseSectionType.model.prototype.init.apply(this, args as never);

        this.__groupCollections = new Map();

        const children = this.components();
        if (children) {
          this.listenTo(children, 'add remove reset', this.updateGroupTraitState);
        }

        this.on('component:add component:remove component:reset', this.updateGroupTraitState);
        this.on(`change:${GROUP_TRAIT_NAME}`, this.handleGroupToggle);

        this.updateGroupTraitState();
      },

      setUseGroupTrait(this: SectionModel, value: boolean, options?: GroupChangeOptions) {
        const castOptions = options ? (options as unknown as Record<string, unknown>) : undefined;

        this.set(GROUP_TRAIT_NAME, value, castOptions);
      },

      logGroupingWarning(this: SectionModel) {
        this.em?.logWarning(GROUP_WARNING_MESSAGE);
      },

      getSectionChildren(this: SectionModel) {
        return collectionToArray(this.components());
      },

      getDirectColumns(this: SectionModel) {
        return this.getSectionChildren().filter((child) => child.is('mj-column'));
      },

      getDirectGroups(this: SectionModel) {
        return this.getSectionChildren().filter((child) => child.is('mj-group'));
      },

      getOrderedColumns(this: SectionModel) {
        const ordered: GrapesComponent[] = [];

        this.getSectionChildren().forEach((child) => {
          if (child.is('mj-column')) {
            ordered.push(child);
          } else if (child.is('mj-group')) {
            ordered.push(
              ...collectionToArray(child.components()).filter((nested) => nested.is('mj-column')),
            );
          }
        });

        return ordered;
      },

      canGroupColumns(this: SectionModel) {
        return this.getOrderedColumns().length >= 2;
      },

      bindGroupCollections(this: SectionModel) {
        const groups = this.getDirectGroups();
        const map = this.__groupCollections ?? new Map<string, ComponentCollection>();

        [...map.entries()].forEach(([groupId, collection]) => {
          if (!groups.some((group) => group.cid === groupId)) {
            this.stopListening(collection);
            map.delete(groupId);
          }
        });

        groups.forEach((group) => {
          const collection = group.components();
          if (!collection || map.has(group.cid)) {
            return;
          }

          this.listenTo(collection, 'add remove reset', this.updateGroupTraitState);
          map.set(group.cid, collection);
        });

        this.__groupCollections = map;
      },

      updateGroupTraitState(this: SectionModel) {
        this.bindGroupCollections();

        const canGroup = this.canGroupColumns();
        const hasGroup = this.getDirectGroups().length > 0;
        const currentUseGroup = Boolean(this.get(GROUP_TRAIT_NAME));
        const trait = this.getTrait(GROUP_TRAIT_NAME) as GrapesTrait | undefined;
        const label = canGroup ? GROUP_LABEL : GROUP_DISABLED_LABEL;

        if (trait) {
          if (trait.get('label') !== label) {
            trait.set('label', label);
          }

          const attributes =
            (trait.get('attributes') as Record<string, unknown> | undefined) ?? undefined;
          const hasDisabledAttr = Boolean(attributes?.disabled);
          const shouldDisable = !canGroup;

          if (hasDisabledAttr !== shouldDisable) {
            const updatedAttributes = { ...(attributes ?? {}) };
            if (shouldDisable) {
              updatedAttributes.disabled = true;
            } else {
              delete updatedAttributes.disabled;
            }
            trait.set('attributes', updatedAttributes);
          }

          const traitState = trait as unknown as {
            get?: (key: string) => unknown;
            set?: (key: string, value: unknown) => void;
          };

          const currentDisabled = Boolean(traitState.get?.('disabled'));
          if (currentDisabled !== shouldDisable) {
            traitState.set?.('disabled', shouldDisable);
          }
        }

        if (this.get('canGroup') !== canGroup) {
          this.set('canGroup', canGroup);
        }

        if (!canGroup) {
          if (currentUseGroup) {
            this.setUseGroupTrait(false, { fromStateUpdate: true });
          } else if (hasGroup) {
            this.unwrapColumnsFromGroups();
          }
          return;
        }

        if (hasGroup !== currentUseGroup) {
          this.setUseGroupTrait(hasGroup, { fromStateUpdate: true });
        }
      },

      handleGroupToggle(
        this: SectionModel,
        _model: GrapesComponent,
        value: boolean,
        options?: GroupChangeOptions,
      ) {
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
            editorInstance?.setSelected?.(group);
          }

          return;
        }

        this.unwrapColumnsFromGroups();
        this.updateGroupTraitState();
      },

      wrapColumnsIntoGroup(this: SectionModel) {
        const orderedColumns = this.getOrderedColumns();

        if (!orderedColumns.length) {
          const [firstGroup, ...extraGroups] = this.getDirectGroups();
          extraGroups.forEach((group) => group.remove());
          return firstGroup ?? null;
        }

        const directGroups = this.getDirectGroups();
        let targetGroup: GrapesComponent | null =
          directGroups.length > 0 ? directGroups[0] : null;

        if (!targetGroup) {
          const children = this.getSectionChildren();
          const insertionIndex = children.findIndex(
            (child) => child.is('mj-column') || child.is('mj-group'),
          );
          const atIndex = insertionIndex >= 0 ? insertionIndex : children.length;
          const created = this.append({ type: 'mj-group' }, { at: atIndex });

          targetGroup = Array.isArray(created)
            ? ((created[0] as GrapesComponent | undefined) ?? null)
            : ((created as GrapesComponent | undefined) ?? null);
        }

        if (!targetGroup) {
          return null;
        }

        const group = targetGroup;

        orderedColumns.forEach((column, index) => {
          group.append(column, { at: index });
        });

        this.getDirectGroups()
          .filter((existingGroup) => existingGroup !== group)
          .forEach((extraGroup) => extraGroup.remove());

        return group;
      },

      unwrapColumnsFromGroups(this: SectionModel) {
        const groups = this.getDirectGroups();

        groups.forEach((group) => {
          const sectionChildren = this.getSectionChildren();
          let insertIndex = sectionChildren.indexOf(group);

          if (insertIndex < 0) {
            insertIndex = sectionChildren.length;
          }

          collectionToArray(group.components())
            .filter((child) => child.is('mj-column'))
            .forEach((column) => {
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
    model: SectionModel,
    view: baseSectionType.view,
  });

  editor.__mjSectionExtended = true;
};

export default function Editor() {
  const editorRef = useRef<ExtendedEditor | null>(null);

  useEffect(() => {
    return () => {
      const editor = editorRef.current;
      if (editor) {
        editor.destroy();
        editorRef.current = null;
        delete (window as unknown as { editor?: ExtendedEditor }).editor;
      }
    };
  }, []);

  const handleEditorInit = useCallback((editor: GrapesEditor) => {
    const extended = editor as ExtendedEditor;
    editorRef.current = extended;
    (window as unknown as { editor?: ExtendedEditor }).editor = extended;
  }, []);

  const handleEditorReady = useCallback((editor: GrapesEditor) => {
    const extended = editor as ExtendedEditor;
    editorRef.current = extended;
    (window as unknown as { editor?: ExtendedEditor }).editor = extended;

    extendMjSectionTrait(extended);
    ensureAptosFontOption(extended);
    ensureInitialContent(extended);

    console.log('Editor ready with React UI');
    console.log('Available blocks:', extended.BlockManager.getAll().length);
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
      onEditor={handleEditorInit}
      onReady={handleEditorReady}
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
