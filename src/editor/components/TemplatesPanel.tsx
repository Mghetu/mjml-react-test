// src/editor/components/TemplatesPanel.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useEditorMaybe } from '@grapesjs/react';
import type { Editor, Page } from 'grapesjs';
import { sanitizeMjmlMarkup } from '../utils/mjml';
import { convertCurrentMjmlToHtml } from '../utils/mjmlConversion';

const MAX_TEMPLATE_SIZE = 5 * 1024 * 1024; // 5MB
const LOCAL_SESSION_KEY = 'mjml-editor-local-session-v1';
const AUTOSAVE_INTERVAL_MS = 60 * 1000;

type RecentKind = 'mjml' | 'json';

const RECENT_KIND_LABEL: Record<RecentKind, string> = {
  mjml: 'MJML Template',
  json: 'Session JSON',
};

interface RecentItem {
  id: string;
  name: string;
  kind: RecentKind;
  timestamp: number;
}

export interface TemplatesPanelProps {
  isVisible: boolean;
}

export default function TemplatesPanel({ isVisible }: TemplatesPanelProps) {
  const editor = useEditorMaybe();
  const mjmlInputRef = useRef<HTMLInputElement | null>(null);
  const sessionInputRef = useRef<HTMLInputElement | null>(null);
  const didTryRestoreRef = useRef(false);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [currentFingerprint, setCurrentFingerprint] = useState<string | null>(null);
  const [savedFingerprint, setSavedFingerprint] = useState<string | null>(null);

  const updateRecents = useCallback((name: string, kind: RecentKind) => {
    const timestamp = Date.now();
    setRecentItems((prev) => {
      const filtered = prev.filter((item) => item.name !== name || item.kind !== kind);
      const entry: RecentItem = {
        id: `${kind}-${timestamp}-${name}`,
        name,
        kind,
        timestamp,
      };
      return [entry, ...filtered].slice(0, 3);
    });
  }, []);

  const loadStoredSession = useCallback(() => {
    const raw = window.localStorage.getItem(LOCAL_SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as { mjml?: unknown; savedAt?: unknown };
      if (typeof parsed?.mjml !== 'string' || parsed.mjml.trim().length === 0) {
        return null;
      }

      return {
        mjml: parsed.mjml,
        savedAt:
          typeof parsed.savedAt === 'number' && Number.isFinite(parsed.savedAt)
            ? parsed.savedAt
            : Date.now(),
      };
    } catch (error) {
      console.error('Failed to parse stored session from localStorage.', error);
      return null;
    }
  }, []);

  const saveSessionToLocal = useCallback(
    (source: 'manual' | 'auto' = 'manual') => {
      if (!editor) {
        return false;
      }

      try {
        const mjml = sanitizeMjmlMarkup(editor.getHtml());
        if (!mjml.toLowerCase().startsWith('<mjml')) {
          return false;
        }

        window.localStorage.setItem(
          LOCAL_SESSION_KEY,
          JSON.stringify({
            mjml,
            savedAt: Date.now(),
          }),
        );
        setSavedFingerprint(mjml);

        return true;
      } catch (error) {
        console.error('Failed to save local session.', error);
        if (source === 'manual') {
          window.alert('Unable to save the current session locally.');
        }
        return false;
      }
    },
    [editor],
  );

  const applyMjmlToEditor = useCallback(
    (markup: string) => {
      if (!editor) {
        return false;
      }

      try {
        const sanitizedMarkup = sanitizeMjmlMarkup(markup);
        if (!sanitizedMarkup.toLowerCase().startsWith('<mjml')) {
          return false;
        }

        const editorState = editor as unknown as {
          __isMjmlImporting?: boolean;
          DomComponents: {
            getWrapper: () =>
              | {
                  components?: () => { reset?: (data?: unknown[]) => void } | undefined;
                  set?: (key: string, value: unknown) => void;
                }
              | undefined;
          };
          Css: { clear: () => void };
          UndoManager?: { stop?: () => void; start?: () => void; clear?: () => void };
          trigger?: (event: string) => void;
          setComponents: (data: string) => void;
        };

        editorState.__isMjmlImporting = true;
        editorState.UndoManager?.stop?.();
        editorState.UndoManager?.clear?.();

        try {
          const wrapper = editorState.DomComponents.getWrapper();
          const wrapperComponents = wrapper?.components?.();
          wrapperComponents?.reset?.([]);
          wrapper?.set?.('content', '');
          editorState.Css.clear();
          editorState.setComponents(sanitizedMarkup);
        } finally {
          editorState.UndoManager?.start?.();
          editorState.__isMjmlImporting = false;
          editorState.trigger?.('mjml:imported');
        }

        return true;
      } catch (error) {
        console.error('Failed to apply MJML markup to editor.', error);
        return false;
      }
    },
    [editor],
  );

  const restoreSessionFromLocal = useCallback(() => {
    if (!editor) {
      return;
    }

    const stored = loadStoredSession();
    if (!stored) {
      return;
    }

    try {
      const applied = applyMjmlToEditor(stored.mjml);
      if (!applied) {
        return;
      }
      const normalized = sanitizeMjmlMarkup(stored.mjml);
      setSavedFingerprint(normalized);
      setCurrentFingerprint(normalized);
      updateRecents('Local Session (auto-restored)', 'mjml');
    } catch (error) {
      console.error('Failed to restore local session.', error);
    }
  }, [applyMjmlToEditor, editor, loadStoredSession, updateRecents]);

  useEffect(() => {
    if (!editor || didTryRestoreRef.current) {
      return;
    }

    didTryRestoreRef.current = true;
    restoreSessionFromLocal();

    // If there is no stored session, mark current UI as unsaved baseline.
    const initialFingerprint = sanitizeMjmlMarkup(editor.getHtml());
    setCurrentFingerprint(initialFingerprint);
    if (!window.localStorage.getItem(LOCAL_SESSION_KEY)) {
      setSavedFingerprint(null);
    }
  }, [editor, restoreSessionFromLocal]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const syncCurrentFingerprint = () => {
      try {
        const normalized = sanitizeMjmlMarkup(editor.getHtml());
        setCurrentFingerprint(normalized);
      } catch (error) {
        console.error('Failed to compute current session fingerprint.', error);
      }
    };

    syncCurrentFingerprint();

    editor.on('component:add', syncCurrentFingerprint);
    editor.on('component:remove', syncCurrentFingerprint);
    editor.on('component:update', syncCurrentFingerprint);
    editor.on('component:update:attributes', syncCurrentFingerprint);
    editor.on('component:styleUpdate', syncCurrentFingerprint);
    editor.on('change:changesCount', syncCurrentFingerprint);

    return () => {
      editor.off('component:add', syncCurrentFingerprint);
      editor.off('component:remove', syncCurrentFingerprint);
      editor.off('component:update', syncCurrentFingerprint);
      editor.off('component:update:attributes', syncCurrentFingerprint);
      editor.off('component:styleUpdate', syncCurrentFingerprint);
      editor.off('change:changesCount', syncCurrentFingerprint);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const intervalId = window.setInterval(() => {
      saveSessionToLocal('auto');
    }, AUTOSAVE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [editor, saveSessionToLocal]);

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  }, []);

  const handleTriggerMjmlImport = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    mjmlInputRef.current?.click();
  }, [editor]);

  const handleImportMjmlChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const file = input.files?.[0];

      if (!file) {
        input.value = '';
        return;
      }

      if (!editor) {
        window.alert('Editor is not ready yet.');
        input.value = '';
        return;
      }

      if (file.size > MAX_TEMPLATE_SIZE) {
        window.alert('Template is too large (maximum size is 5 MB).');
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        window.alert('Failed to read the selected MJML file.');
        input.value = '';
      };
      reader.onload = () => {
        input.value = '';
        const result = reader.result;
        if (typeof result !== 'string') {
          window.alert('Unable to read MJML file contents.');
          return;
        }

        try {
          const applied = applyMjmlToEditor(result);
          if (!applied) {
            window.alert('The selected file does not contain a valid <mjml> root element.');
            return;
          }
          updateRecents(file.name, 'mjml');
          // Persist imported content right away so refresh restores this exact session.
          window.setTimeout(() => {
            saveSessionToLocal('auto');
          }, 0);
        } catch (error) {
          console.error(error);
          window.alert('Failed to import the MJML template.');
        }
      };

      reader.readAsText(file);
    },
    [applyMjmlToEditor, editor, saveSessionToLocal, updateRecents],
  );

  const handleImportSessionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const file = input.files?.[0];

      if (!file) {
        input.value = '';
        return;
      }

      if (!editor) {
        window.alert('Editor is not ready yet.');
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        window.alert('Failed to read the selected session file.');
        input.value = '';
      };
      reader.onload = () => {
        input.value = '';
        const result = reader.result;
        if (typeof result !== 'string') {
          window.alert('Invalid session JSON file.');
          return;
        }

        try {
          const projectData = JSON.parse(result) as Parameters<Editor['loadProjectData']>[0];
          editor.loadProjectData(projectData);
          const pages = editor.Pages.getAll();
          const firstPage = pages[0] as Page | undefined;
          if (firstPage) {
            editor.Pages.select(firstPage);
          }
          updateRecents(file.name, 'json');
          window.alert('Session imported successfully.');
        } catch (error) {
          console.error(error);
          window.alert('Invalid session JSON file.');
        }
      };

      reader.readAsText(file);
    },
    [editor, updateRecents],
  );

  const handleExportMjml = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    const mjmlMarkup = editor.getHtml();
    downloadFile(mjmlMarkup, 'template.mjml', 'application/vnd.mjml+xml');
  }, [downloadFile, editor]);

  const handleConvertMjmlToHtml = useCallback(async () => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    setIsConverting(true);

    try {
      await convertCurrentMjmlToHtml(editor);
    } finally {
      setIsConverting(false);
    }
  }, [editor]);

  const handleManualSave = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    saveSessionToLocal('manual');
  }, [editor, saveSessionToLocal]);

  const handleEndSession = useCallback(() => {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
    setSavedFingerprint(null);
    window.location.reload();
  }, []);

  const isUnsaved = currentFingerprint !== null && currentFingerprint !== savedFingerprint;
  const sessionStatusLabel = isUnsaved ? 'Unsaved changes' : 'Session autosaved';
  const sessionStatusClass = isUnsaved
    ? 'session-status-badge session-status-badge--unsaved'
    : 'session-status-badge session-status-badge--saved';

  return (
    <div
      className="templates-panel gjs-one-bg gjs-two-color"
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <div className="templates-actions">
        <div className="templates-action-group">
          <h4 className="templates-group-title">Template Actions</h4>
          <div className="templates-action-row">
            <button
              type="button"
              className="templates-action-button gjs-btn"
              onClick={handleTriggerMjmlImport}
              disabled={!editor}
              title="Import an MJML template from your computer"
            >
              📂 Import MJML File
            </button>
            <button
              type="button"
              className="templates-action-button gjs-btn"
              onClick={handleExportMjml}
              disabled={!editor}
              title="Download the current MJML markup"
            >
              ⬇️ Download MJML
            </button>
          </div>
          <button
            type="button"
            className="templates-action-button templates-action-button--full templates-action-button--primary gjs-btn"
            onClick={handleConvertMjmlToHtml}
            disabled={!editor || isConverting}
            title="Convert current MJML to HTML in the browser"
          >
          {isConverting ? '⏳ Exporting…' : '🚀 Export HTML'}
          </button>
        </div>

        <div className="templates-action-group templates-action-group--session">
          <h4 className="templates-group-title">Session Management</h4>
          <div className="templates-action-row">
            <button
              type="button"
              className="templates-action-button gjs-btn"
              onClick={handleManualSave}
              disabled={!editor}
              title="Save current session to local storage"
            >
              ✅ Save Session
            </button>
            <button
              type="button"
              className="templates-action-button gjs-btn"
              onClick={handleEndSession}
              title="Clear local session and restart"
            >
              🧹 End Session
            </button>
          </div>
        </div>
      </div>

      <div className="templates-recents">
        <h4>Recent</h4>
        {recentItems.length > 0 ? (
          <ul className="templates-recents-list">
            {recentItems.map((item) => (
              <li key={item.id} className="templates-recent-item">
                <span className="templates-recent-name">{item.name}</span>
                <span className="templates-recent-type">{RECENT_KIND_LABEL[item.kind]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="templates-recents-empty">No recent files yet.</p>
        )}
      </div>

      <input
        ref={mjmlInputRef}
        type="file"
        accept=".mjml,text/xml,text/plain"
        onChange={handleImportMjmlChange}
        style={{ display: 'none' }}
      />
      <input
        ref={sessionInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImportSessionChange}
        style={{ display: 'none' }}
      />
      <div className={sessionStatusClass}>{sessionStatusLabel}</div>
    </div>
  );
}
