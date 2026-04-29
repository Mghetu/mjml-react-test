// src/editor/components/TemplatesPanel.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useEditorMaybe } from '@grapesjs/react';
import type { Editor, Page } from 'grapesjs';
import { sanitizeMjmlMarkup } from '../utils/mjml';
import { convertCurrentMjmlToHtml, type HtmlExportProfile } from '../utils/mjmlConversion';
import {
  parseLocalSession,
  serializeLocalSession,
  type StoredSession,
} from '../utils/localSession';

const MAX_TEMPLATE_SIZE = 5 * 1024 * 1024; // 5MB
const LOCAL_SESSION_KEY = 'mjml-editor-local-session-v1';
const AUTOSAVE_INTERVAL_MS = 60 * 1000;
const FINGERPRINT_DEBOUNCE_MS = 350;

type RecentKind = 'mjml' | 'json';

const RECENT_KIND_LABEL: Record<RecentKind, string> = {
  mjml: 'MJML Template',
  json: 'Session JSON',
};

const HTML_EXPORT_PROFILE_LABEL: Record<HtmlExportProfile, string> = {
  'email-safe': 'Email-safe (recommended)',
  aggressive: 'Aggressive minify',
};

interface RecentItem {
  id: string;
  name: string;
  kind: RecentKind;
  timestamp: number;
}

type SessionModalKind = 'restore' | 'end-session' | null;

export interface TemplatesPanelProps {
  isVisible: boolean;
}

export default function TemplatesPanel({ isVisible }: TemplatesPanelProps) {
  const editor = useEditorMaybe();
  const mjmlInputRef = useRef<HTMLInputElement | null>(null);
  const sessionInputRef = useRef<HTMLInputElement | null>(null);
  const didTryRestoreRef = useRef(false);
  const fingerprintDebounceRef = useRef<number | null>(null);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [htmlExportProfile, setHtmlExportProfile] = useState<HtmlExportProfile>('email-safe');
  const [currentFingerprint, setCurrentFingerprint] = useState<string | null>(null);
  const [savedFingerprint, setSavedFingerprint] = useState<string | null>(null);
  const [lastAutosaveAt, setLastAutosaveAt] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sessionModal, setSessionModal] = useState<SessionModalKind>(null);
  const [pendingStoredSession, setPendingStoredSession] = useState<StoredSession | null>(null);

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

  const loadStoredSession = useCallback((): StoredSession | null => {
    const raw = window.localStorage.getItem(LOCAL_SESSION_KEY);
    const parsed = parseLocalSession(raw);
    if (raw && !parsed) {
      // Clear corrupted or incompatible payloads so they don't repeatedly prompt restore.
      window.localStorage.removeItem(LOCAL_SESSION_KEY);
    }
    return parsed;
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
        const savedAt = Date.now();

        window.localStorage.setItem(LOCAL_SESSION_KEY, serializeLocalSession(mjml, savedAt));
        setSavedFingerprint(mjml);
        setLastAutosaveAt(savedAt);

        if (source === 'manual') {
          setToastMessage('Session saved locally.');
        }

        return true;
      } catch (error) {
        console.error('Failed to save local session.', error);
        if (source === 'manual') {
          setToastMessage('Unable to save session locally.');
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

  const restoreStoredSession = useCallback(
    (stored: StoredSession) => {
      if (!editor) {
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
        setLastAutosaveAt(stored.savedAt);
        updateRecents('Local Session (auto-restored)', 'mjml');
      } catch (error) {
        console.error('Failed to restore local session.', error);
      }
    },
    [applyMjmlToEditor, editor, updateRecents],
  );

  const initializeFreshSessionState = useCallback(() => {
    if (!editor) {
      return;
    }

    const initialFingerprint = sanitizeMjmlMarkup(editor.getHtml());
    setCurrentFingerprint(initialFingerprint);
    setSavedFingerprint(null);
    setLastAutosaveAt(null);
  }, [editor]);

  const restorePendingDraft = useCallback(() => {
    if (!pendingStoredSession) {
      setSessionModal(null);
      return;
    }

    restoreStoredSession(pendingStoredSession);
    setPendingStoredSession(null);
    setSessionModal(null);
  }, [pendingStoredSession, restoreStoredSession]);

  const startFreshDraft = useCallback(() => {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
    setPendingStoredSession(null);
    initializeFreshSessionState();
    setSessionModal(null);
  }, [initializeFreshSessionState]);

  useEffect(() => {
    if (!editor || didTryRestoreRef.current) {
      return;
    }

    didTryRestoreRef.current = true;
    const stored = loadStoredSession();
    if (stored) {
      setPendingStoredSession(stored);
      setSessionModal('restore');
      return;
    }

    initializeFreshSessionState();
  }, [editor, initializeFreshSessionState, loadStoredSession]);

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

    const syncCurrentFingerprintDebounced = () => {
      if (fingerprintDebounceRef.current) {
        window.clearTimeout(fingerprintDebounceRef.current);
      }
      fingerprintDebounceRef.current = window.setTimeout(
        syncCurrentFingerprint,
        FINGERPRINT_DEBOUNCE_MS,
      );
    };

    syncCurrentFingerprint();

    editor.on('component:add', syncCurrentFingerprintDebounced);
    editor.on('component:remove', syncCurrentFingerprintDebounced);
    editor.on('component:update', syncCurrentFingerprintDebounced);
    editor.on('component:update:attributes', syncCurrentFingerprintDebounced);
    editor.on('component:styleUpdate', syncCurrentFingerprintDebounced);
    editor.on('change:changesCount', syncCurrentFingerprintDebounced);

    return () => {
      if (fingerprintDebounceRef.current) {
        window.clearTimeout(fingerprintDebounceRef.current);
      }
      editor.off('component:add', syncCurrentFingerprintDebounced);
      editor.off('component:remove', syncCurrentFingerprintDebounced);
      editor.off('component:update', syncCurrentFingerprintDebounced);
      editor.off('component:update:attributes', syncCurrentFingerprintDebounced);
      editor.off('component:styleUpdate', syncCurrentFingerprintDebounced);
      editor.off('change:changesCount', syncCurrentFingerprintDebounced);
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

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

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
      await convertCurrentMjmlToHtml(editor, htmlExportProfile);
    } finally {
      setIsConverting(false);
    }
  }, [editor, htmlExportProfile]);

  const handleManualSave = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    saveSessionToLocal('manual');
  }, [editor, saveSessionToLocal]);

  const handleEndSession = useCallback(() => {
    setSessionModal('end-session');
  }, []);

  const confirmEndSession = useCallback(() => {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
    setSavedFingerprint(null);
    setLastAutosaveAt(null);
    setSessionModal(null);
    window.location.reload();
  }, []);

  const isUnsaved = currentFingerprint !== null && currentFingerprint !== savedFingerprint;
  const sessionStatusLabel = isUnsaved ? 'Unsaved changes' : 'Autosaved';
  const lastAutosaveLabel = lastAutosaveAt
    ? new Date(lastAutosaveAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;
  const sessionStatusClass = isUnsaved
    ? 'session-status-badge session-status-badge--unsaved'
    : 'session-status-badge session-status-badge--saved';
  const restoreDraftTimestampLabel = pendingStoredSession
    ? new Date(pendingStoredSession.savedAt).toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <>
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
            <label className="templates-profile-field">
              <span>Export Profile</span>
              <select
                className="templates-profile-select"
                value={htmlExportProfile}
                onChange={(event) => setHtmlExportProfile(event.target.value as HtmlExportProfile)}
                disabled={isConverting}
              >
                <option value="email-safe">{HTML_EXPORT_PROFILE_LABEL['email-safe']}</option>
                <option value="aggressive">{HTML_EXPORT_PROFILE_LABEL.aggressive}</option>
              </select>
            </label>
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
      </div>
      <div className={sessionStatusClass}>
        <div className="session-status-title">
          <span className="session-status-dot" aria-hidden="true" />
          {sessionStatusLabel}
        </div>
        <div className="session-status-meta">
          {lastAutosaveLabel ? `Last autosave at ${lastAutosaveLabel}` : 'Last autosave: not yet'}
        </div>
      </div>
      {toastMessage ? (
        <div className="session-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}
      {sessionModal ? (
        <div className="session-modal-overlay" role="dialog" aria-modal="true">
          <div className="session-modal">
            {sessionModal === 'restore' ? (
              <>
                <h4>Restore local draft?</h4>
                <p>
                  A previous draft was found on this device.
                  <br />
                  {restoreDraftTimestampLabel ? (
                    <>
                      Last draft saved at
                      {' '}
                      <strong>{restoreDraftTimestampLabel}</strong>.
                    </>
                  ) : null}
                  <br />
                  Do you want to continue it?
                </p>
                <div className="session-modal-actions">
                  <button
                    type="button"
                    className="templates-action-button gjs-btn"
                    onClick={startFreshDraft}
                  >
                    Start fresh
                  </button>
                  <button
                    type="button"
                    className="templates-action-button templates-action-button--primary gjs-btn"
                    onClick={restorePendingDraft}
                  >
                    Restore draft
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4>End current session?</h4>
                <p>This will clear the local draft and reload the editor.</p>
                <div className="session-modal-actions">
                  <button
                    type="button"
                    className="templates-action-button gjs-btn"
                    onClick={() => setSessionModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="templates-action-button templates-action-button--primary gjs-btn"
                    onClick={confirmEndSession}
                  >
                    End session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
