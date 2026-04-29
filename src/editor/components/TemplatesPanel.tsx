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
const MAX_REMOTE_TEMPLATE_SIZE = 2 * 1024 * 1024; // 2MB (matches backend guardrail)
const LOCAL_SESSION_KEY = 'mjml-editor-local-session-v1';
const AUTOSAVE_INTERVAL_MS = 60 * 1000;
const FINGERPRINT_DEBOUNCE_MS = 350;
const SESSION_DB_NAME = 'mjml-editor-session-db';
const SESSION_DB_STORE = 'sessions';

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
type ProjectActionKind = 'download-mjml' | 'export-html' | null;
type LibraryTemplatesModalKind = 'select-template' | 'upload-template' | null;

interface RemoteTemplate {
  id: string;
  name: string;
  locale: string | null;
  description: string;
  updatedAt: string;
}

const isQuotaExceededError = (error: unknown) =>
  error instanceof DOMException &&
  (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED');

const openSessionDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    const request = window.indexedDB.open(SESSION_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SESSION_DB_STORE)) {
        db.createObjectStore(SESSION_DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB.'));
  });

const writeSessionToIndexedDb = async (value: string) => {
  const db = await openSessionDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(SESSION_DB_STORE, 'readwrite');
    tx.objectStore(SESSION_DB_STORE).put(value, LOCAL_SESSION_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to write session to IndexedDB.'));
    tx.onabort = () => reject(tx.error ?? new Error('Failed to write session to IndexedDB.'));
  });
  db.close();
};

const readSessionFromIndexedDb = async () => {
  const db = await openSessionDb();
  const result = await new Promise<string | null>((resolve, reject) => {
    const tx = db.transaction(SESSION_DB_STORE, 'readonly');
    const request = tx.objectStore(SESSION_DB_STORE).get(LOCAL_SESSION_KEY);
    request.onsuccess = () => resolve(typeof request.result === 'string' ? request.result : null);
    request.onerror = () => reject(request.error ?? new Error('Failed to read session from IndexedDB.'));
  });
  db.close();
  return result;
};

const clearSessionFromIndexedDb = async () => {
  const db = await openSessionDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(SESSION_DB_STORE, 'readwrite');
    tx.objectStore(SESSION_DB_STORE).delete(LOCAL_SESSION_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to clear session from IndexedDB.'));
    tx.onabort = () => reject(tx.error ?? new Error('Failed to clear session from IndexedDB.'));
  });
  db.close();
};

export interface TemplatesPanelProps {
  isVisible: boolean;
}

export default function TemplatesPanel({ isVisible }: TemplatesPanelProps) {
  const editor = useEditorMaybe();
  const mjmlInputRef = useRef<HTMLInputElement | null>(null);
  const sessionInputRef = useRef<HTMLInputElement | null>(null);
  const uploadTemplateInputRef = useRef<HTMLInputElement | null>(null);
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
  const [projectName, setProjectName] = useState<string | null>(null);
  const [projectVersion, setProjectVersion] = useState(1);
  const [versionFingerprint, setVersionFingerprint] = useState<string | null>(null);
  const [projectNameDraft, setProjectNameDraft] = useState('');
  const [projectNameModalAction, setProjectNameModalAction] = useState<ProjectActionKind>(null);
  const [libraryTemplatesModal, setLibraryTemplatesModal] = useState<LibraryTemplatesModalKind>(null);
  const [remoteTemplates, setRemoteTemplates] = useState<RemoteTemplate[]>([]);
  const [isLoadingRemoteTemplates, setIsLoadingRemoteTemplates] = useState(false);
  const [remoteTemplatesError, setRemoteTemplatesError] = useState<string | null>(null);
  const [activeRemoteTemplateId, setActiveRemoteTemplateId] = useState<string | null>(null);
  const [activeDeleteTemplateId, setActiveDeleteTemplateId] = useState<string | null>(null);
  const [managementAdminToken, setManagementAdminToken] = useState('');
  const [uploadTemplateName, setUploadTemplateName] = useState('');
  const [uploadTemplateDescription, setUploadTemplateDescription] = useState('');
  const [uploadTemplateAdminToken, setUploadTemplateAdminToken] = useState('');
  const [uploadTemplateFileName, setUploadTemplateFileName] = useState<string | null>(null);
  const [uploadTemplateMjml, setUploadTemplateMjml] = useState<string | null>(null);
  const [isUploadingTemplate, setIsUploadingTemplate] = useState(false);

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

  const loadStoredSession = useCallback(async (): Promise<StoredSession | null> => {
    const raw = window.localStorage.getItem(LOCAL_SESSION_KEY);
    const parsed = parseLocalSession(raw);
    if (parsed) {
      return parsed;
    }
    if (raw && !parsed) {
      // Clear corrupted or incompatible payloads so they don't repeatedly prompt restore.
      window.localStorage.removeItem(LOCAL_SESSION_KEY);
    }
    try {
      const indexedDbRaw = await readSessionFromIndexedDb();
      const indexedDbParsed = parseLocalSession(indexedDbRaw);
      if (!indexedDbParsed && indexedDbRaw) {
        await clearSessionFromIndexedDb();
      }
      return indexedDbParsed;
    } catch (error) {
      console.error('Failed to load session from IndexedDB fallback.', error);
      return null;
    }
  }, []);

  const saveSessionToLocal = useCallback(
    (
      source: 'manual' | 'auto' = 'manual',
      overrides?: {
        projectName?: string | null;
        projectVersion?: number;
        versionFingerprint?: string | null;
      },
    ) => {
      if (!editor) {
        return Promise.resolve(false);
      }

      const persist = async () => {
        const mjml = sanitizeMjmlMarkup(editor.getHtml());
        if (!mjml || mjml.trim().length === 0) {
          return false;
        }
        const savedAt = Date.now();
        const nameToPersist = overrides?.projectName !== undefined ? overrides.projectName : projectName;
        const versionToPersist =
          overrides?.projectVersion !== undefined ? overrides.projectVersion : projectVersion;
        const versionFingerprintToPersist =
          overrides?.versionFingerprint !== undefined
            ? overrides.versionFingerprint
            : versionFingerprint;

        const serializedPayload = serializeLocalSession(mjml, savedAt, {
          projectName: nameToPersist,
          projectVersion: versionToPersist,
          versionFingerprint: versionFingerprintToPersist,
        });
        let savedWithFallback = false;
        try {
          window.localStorage.setItem(LOCAL_SESSION_KEY, serializedPayload);
          try {
            await clearSessionFromIndexedDb();
          } catch {
            // Ignore cleanup failures; localStorage already has the latest payload.
          }
        } catch (error) {
          if (!isQuotaExceededError(error)) {
            throw error;
          }
          await writeSessionToIndexedDb(serializedPayload);
          window.localStorage.removeItem(LOCAL_SESSION_KEY);
          savedWithFallback = true;
        }
        setSavedFingerprint(mjml);
        setLastAutosaveAt(savedAt);

        if (source === 'manual') {
          setToastMessage(
            savedWithFallback
              ? 'Session saved locally (large draft mode).'
              : 'Session saved locally.',
          );
        }

        return true;
      };

      return persist().catch((error) => {
        console.error('Failed to save local session.', error);
        if (source === 'manual' || source === 'auto') {
          if (isQuotaExceededError(error)) {
            setToastMessage('Local storage limit reached. Save failed.');
          } else if (source === 'manual') {
            setToastMessage('Unable to save session locally.');
          }
        }
        return false;
      });
    },
    [editor, projectName, projectVersion, versionFingerprint],
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
        setProjectName(stored.projectName);
        setProjectVersion(stored.projectVersion);
        setVersionFingerprint(stored.versionFingerprint);
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
    setProjectName(null);
    setProjectVersion(1);
    setVersionFingerprint(null);
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
    void clearSessionFromIndexedDb();
    setPendingStoredSession(null);
    initializeFreshSessionState();
    setSessionModal(null);
  }, [initializeFreshSessionState]);

  useEffect(() => {
    if (!editor || didTryRestoreRef.current) {
      return;
    }

    didTryRestoreRef.current = true;
    void (async () => {
      const stored = await loadStoredSession();
      if (stored) {
        setPendingStoredSession(stored);
        setSessionModal('restore');
        return;
      }
      initializeFreshSessionState();
    })();
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
      void saveSessionToLocal('auto');
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

  const sanitizeProjectFileName = useCallback((value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      return 'project';
    }
    const safe = trimmed
      .replace(/[^a-z0-9-_ ]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[-_]+|[-_]+$/g, '');
    return safe || 'project';
  }, []);

  const getCurrentMjmlFingerprint = useCallback(() => {
    if (!editor) {
      return null;
    }
    return sanitizeMjmlMarkup(editor.getHtml());
  }, [editor]);

  const resolveProjectVersionForOutput = useCallback(() => {
    const mjmlFingerprint = getCurrentMjmlFingerprint();
    if (!mjmlFingerprint) {
      return null;
    }

    if (!versionFingerprint) {
      return {
        nextVersion: projectVersion,
        nextVersionFingerprint: mjmlFingerprint,
        mjmlFingerprint,
      };
    }

    if (mjmlFingerprint === versionFingerprint) {
      return {
        nextVersion: projectVersion,
        nextVersionFingerprint: versionFingerprint,
        mjmlFingerprint,
      };
    }

    return {
      nextVersion: projectVersion + 1,
      nextVersionFingerprint: mjmlFingerprint,
      mjmlFingerprint,
    };
  }, [getCurrentMjmlFingerprint, projectVersion, versionFingerprint]);

  const executeDownloadMjml = useCallback(
    (resolvedProjectName: string) => {
      if (!editor) {
        window.alert('Editor is not ready yet.');
        return;
      }

      const versionState = resolveProjectVersionForOutput();
      if (!versionState) {
        window.alert('Unable to determine the current MJML content.');
        return;
      }

      const { nextVersion, nextVersionFingerprint, mjmlFingerprint } = versionState;
      const safeName = sanitizeProjectFileName(resolvedProjectName);
      downloadFile(mjmlFingerprint, `${safeName}-v${nextVersion}.mjml`, 'application/vnd.mjml+xml');

      setProjectName(resolvedProjectName);
      setProjectVersion(nextVersion);
      setVersionFingerprint(nextVersionFingerprint);
      void saveSessionToLocal('auto', {
        projectName: resolvedProjectName,
        projectVersion: nextVersion,
        versionFingerprint: nextVersionFingerprint,
      });
    },
    [downloadFile, editor, resolveProjectVersionForOutput, sanitizeProjectFileName, saveSessionToLocal],
  );

  const executeExportHtml = useCallback(
    async (resolvedProjectName: string) => {
      if (!editor) {
        window.alert('Editor is not ready yet.');
        return;
      }

      const versionState = resolveProjectVersionForOutput();
      if (!versionState) {
        window.alert('Unable to determine the current MJML content.');
        return;
      }

      const { nextVersion, nextVersionFingerprint } = versionState;
      const safeName = sanitizeProjectFileName(resolvedProjectName);
      const outputFilename = `${safeName}-v${nextVersion}.html`;

      setIsConverting(true);
      try {
        await convertCurrentMjmlToHtml(editor, htmlExportProfile, outputFilename);
        setProjectName(resolvedProjectName);
        setProjectVersion(nextVersion);
        setVersionFingerprint(nextVersionFingerprint);
        void saveSessionToLocal('auto', {
          projectName: resolvedProjectName,
          projectVersion: nextVersion,
          versionFingerprint: nextVersionFingerprint,
        });
      } finally {
        setIsConverting(false);
      }
    },
    [
      editor,
      htmlExportProfile,
      resolveProjectVersionForOutput,
      sanitizeProjectFileName,
      saveSessionToLocal,
    ],
  );

  const requestProjectNameForAction = useCallback(
    (action: ProjectActionKind) => {
      setProjectNameDraft(projectName ?? '');
      setProjectNameModalAction(action);
    },
    [projectName],
  );

  const buildTemplateSlug = useCallback((value: string) => {
    const normalized = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[-]+|[-]+$/g, '');
    return normalized || `template-${Date.now()}`;
  }, []);

  const loadRemoteTemplates = useCallback(async () => {
    setIsLoadingRemoteTemplates(true);
    setRemoteTemplatesError(null);
    try {
      const response = await fetch('/api/templates');
      const payload = (await response.json().catch(() => null)) as
        | { templates?: RemoteTemplate[]; error?: string }
        | null;
      if (!response.ok) {
        setRemoteTemplatesError(payload?.error || 'Failed to load templates list.');
        setRemoteTemplates([]);
        return;
      }
      const templates = Array.isArray(payload?.templates) ? payload.templates : [];
      setRemoteTemplates(templates);
    } catch (error) {
      console.error('Failed to fetch templates list.', error);
      setRemoteTemplatesError('Could not reach templates endpoint.');
      setRemoteTemplates([]);
    } finally {
      setIsLoadingRemoteTemplates(false);
    }
  }, []);

  const openTemplatesLibraryModal = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }
    setLibraryTemplatesModal('select-template');
    void loadRemoteTemplates();
  }, [editor, loadRemoteTemplates]);

  const openUploadTemplateModal = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }
    setUploadTemplateName('');
    setUploadTemplateDescription('');
    setUploadTemplateAdminToken('');
    setUploadTemplateFileName(null);
    setUploadTemplateMjml(null);
    setLibraryTemplatesModal('upload-template');
  }, [editor]);

  const closeTemplatesLibraryModal = useCallback(() => {
    setLibraryTemplatesModal(null);
    setActiveRemoteTemplateId(null);
    setActiveDeleteTemplateId(null);
    setIsUploadingTemplate(false);
  }, []);

  const loadRemoteTemplateIntoEditor = useCallback(
    async (template: RemoteTemplate) => {
      if (!editor) {
        window.alert('Editor is not ready yet.');
        return;
      }
      setActiveRemoteTemplateId(template.id);
      try {
        const response = await fetch(`/api/templates/${encodeURIComponent(template.id)}`);
        const payload = (await response.json().catch(() => null)) as
          | { mjml?: string; error?: string }
          | null;
        if (!response.ok) {
          window.alert(payload?.error || 'Failed to load selected template.');
          return;
        }
        if (typeof payload?.mjml !== 'string' || !payload.mjml.trim()) {
          window.alert('Selected template is empty or invalid.');
          return;
        }

        const applied = applyMjmlToEditor(payload.mjml);
        if (!applied) {
          window.alert('Selected template does not contain a valid <mjml> root element.');
          return;
        }

        updateRecents(template.name, 'mjml');
        window.setTimeout(() => {
          void saveSessionToLocal('auto');
        }, 0);
        setToastMessage(`Loaded template: ${template.name}`);
        closeTemplatesLibraryModal();
      } catch (error) {
        console.error('Failed to load remote template.', error);
        window.alert('Failed to load selected template.');
      } finally {
        setActiveRemoteTemplateId(null);
      }
    },
    [applyMjmlToEditor, closeTemplatesLibraryModal, editor, saveSessionToLocal, updateRecents],
  );

  const handleUploadTemplateFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      input.value = '';
      return;
    }
    if (file.size > MAX_REMOTE_TEMPLATE_SIZE) {
      window.alert('Template file is too large (maximum size is 2 MB).');
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
      if (typeof result !== 'string' || !result.trim()) {
        window.alert('Unable to read MJML file contents.');
        return;
      }
      if (!sanitizeMjmlMarkup(result).toLowerCase().startsWith('<mjml')) {
        window.alert('The selected file does not contain a valid <mjml> root element.');
        return;
      }
      setUploadTemplateFileName(file.name);
      setUploadTemplateMjml(result);
      if (!uploadTemplateName.trim()) {
        const inferredName = file.name.replace(/\.[^.]+$/, '').trim();
        setUploadTemplateName(inferredName || file.name);
      }
    };
    reader.readAsText(file);
  }, [uploadTemplateName]);

  const submitTemplateUpload = useCallback(async () => {
    const name = uploadTemplateName.trim();
    const adminToken = uploadTemplateAdminToken.trim();
    const mjml = uploadTemplateMjml;

    if (!name) {
      setToastMessage('Template name is required.');
      return;
    }
    if (!adminToken) {
      setToastMessage('Admin token is required.');
      return;
    }
    if (!mjml) {
      setToastMessage('Please select an MJML file first.');
      return;
    }

    setIsUploadingTemplate(true);
    try {
      const response = await fetch('/api/templates/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({
          id: buildTemplateSlug(name),
          name,
          description: uploadTemplateDescription.trim(),
          mjml,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        window.alert(payload?.error || 'Failed to upload template.');
        return;
      }
      setToastMessage(`Template uploaded: ${name}`);
      setLibraryTemplatesModal('select-template');
      setUploadTemplateMjml(null);
      setUploadTemplateFileName(null);
      await loadRemoteTemplates();
    } catch (error) {
      console.error('Failed to upload template.', error);
      window.alert('Failed to upload template.');
    } finally {
      setIsUploadingTemplate(false);
    }
  }, [
    buildTemplateSlug,
    loadRemoteTemplates,
    uploadTemplateAdminToken,
    uploadTemplateDescription,
    uploadTemplateMjml,
    uploadTemplateName,
  ]);

  const deleteRemoteTemplate = useCallback(
    async (template: RemoteTemplate) => {
      const token = managementAdminToken.trim();
      if (!token) {
        setToastMessage('Admin token is required for delete.');
        return;
      }
      const confirmed = window.confirm(`Delete template "${template.name}"? This cannot be undone.`);
      if (!confirmed) {
        return;
      }

      setActiveDeleteTemplateId(template.id);
      try {
        const response = await fetch('/api/templates/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': token,
          },
          body: JSON.stringify({ id: template.id }),
        });
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        if (!response.ok) {
          window.alert(payload?.error || 'Failed to delete template.');
          return;
        }

        setToastMessage(`Template deleted: ${template.name}`);
        await loadRemoteTemplates();
      } catch (error) {
        console.error('Failed to delete template.', error);
        window.alert('Failed to delete template.');
      } finally {
        setActiveDeleteTemplateId(null);
      }
    },
    [loadRemoteTemplates, managementAdminToken],
  );

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
            void saveSessionToLocal('auto');
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
    if (!projectName) {
      requestProjectNameForAction('download-mjml');
      return;
    }
    executeDownloadMjml(projectName);
  }, [editor, executeDownloadMjml, projectName, requestProjectNameForAction]);

  const handleConvertMjmlToHtml = useCallback(async () => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    if (!projectName) {
      requestProjectNameForAction('export-html');
      return;
    }

    await executeExportHtml(projectName);
  }, [editor, executeExportHtml, projectName, requestProjectNameForAction]);

  const handleManualSave = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    void saveSessionToLocal('manual');
  }, [editor, saveSessionToLocal]);

  const handleEndSession = useCallback(() => {
    setSessionModal('end-session');
  }, []);

  const confirmEndSession = useCallback(() => {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
    void clearSessionFromIndexedDb();
    setSavedFingerprint(null);
    setLastAutosaveAt(null);
    setSessionModal(null);
    window.location.reload();
  }, []);

  const cancelProjectNameModal = useCallback(() => {
    setProjectNameModalAction(null);
    setProjectNameDraft(projectName ?? '');
  }, [projectName]);

  const confirmProjectNameModal = useCallback(async () => {
    const trimmed = projectNameDraft.trim();
    if (!trimmed) {
      setToastMessage('Project name is required.');
      return;
    }

    const action = projectNameModalAction;
    setProjectNameModalAction(null);
    if (action === 'download-mjml') {
      executeDownloadMjml(trimmed);
      return;
    }
    if (action === 'export-html') {
      await executeExportHtml(trimmed);
    }
  }, [executeDownloadMjml, executeExportHtml, projectNameDraft, projectNameModalAction]);

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
            <div className="templates-action-row">
              <button
                type="button"
                className="templates-action-button gjs-btn"
                onClick={openTemplatesLibraryModal}
                disabled={!editor}
                title="Select one of the shared MJML templates"
              >
                🗂️ Select template
              </button>
              <button
                type="button"
                className="templates-action-button gjs-btn"
                onClick={openUploadTemplateModal}
                disabled={!editor}
                title="Upload a new shared template to the library"
              >
                ⬆️ Upload template
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
      {libraryTemplatesModal === 'select-template' ? (
        <div className="session-modal-overlay" role="dialog" aria-modal="true">
          <div className="session-modal templates-library-modal">
            <h4>Select template</h4>
            <p>Choose a shared MJML template to load into the editor.</p>
            <label className="templates-upload-field">
              <span>Admin token (for delete actions)</span>
              <input
                className="templates-project-name-input"
                type="password"
                value={managementAdminToken}
                onChange={(event) => setManagementAdminToken(event.target.value)}
                placeholder="APP_ACCESS_PASSWORD"
              />
            </label>
            {isLoadingRemoteTemplates ? (
              <p className="templates-library-state">Loading templates...</p>
            ) : null}
            {remoteTemplatesError ? (
              <p className="templates-library-state templates-library-state--error">{remoteTemplatesError}</p>
            ) : null}
            {!isLoadingRemoteTemplates && !remoteTemplatesError ? (
              remoteTemplates.length > 0 ? (
                <ul className="templates-library-list">
                  {remoteTemplates.map((template) => {
                    const updatedAtLabel = template.updatedAt
                      ? new Date(template.updatedAt).toLocaleDateString()
                      : null;
                    return (
                      <li key={template.id} className="templates-library-item">
                        <div className="templates-library-item-header">
                          <strong>{template.name}</strong>
                          {template.locale ? <span>{template.locale}</span> : null}
                        </div>
                        {template.description ? (
                          <p className="templates-library-item-description">{template.description}</p>
                        ) : null}
                        <div className="templates-library-item-footer">
                          <span>{updatedAtLabel ? `Updated ${updatedAtLabel}` : ' '}</span>
                          <div className="templates-library-item-actions">
                            <button
                              type="button"
                              className="templates-action-button gjs-btn"
                              disabled={activeRemoteTemplateId === template.id}
                              onClick={() => {
                                void loadRemoteTemplateIntoEditor(template);
                              }}
                            >
                              {activeRemoteTemplateId === template.id ? 'Loading...' : 'Use template'}
                            </button>
                            <button
                              type="button"
                              className="templates-action-button templates-action-button--danger gjs-btn"
                              disabled={activeDeleteTemplateId === template.id}
                              onClick={() => {
                                void deleteRemoteTemplate(template);
                              }}
                            >
                              {activeDeleteTemplateId === template.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="templates-library-state">No templates are available yet.</p>
              )
            ) : null}
            <div className="session-modal-actions">
              <button
                type="button"
                className="templates-action-button gjs-btn"
                onClick={closeTemplatesLibraryModal}
              >
                Close
              </button>
              <button
                type="button"
                className="templates-action-button templates-action-button--primary gjs-btn"
                onClick={() => {
                  void loadRemoteTemplates();
                }}
                disabled={isLoadingRemoteTemplates}
              >
                Refresh list
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {libraryTemplatesModal === 'upload-template' ? (
        <div className="session-modal-overlay" role="dialog" aria-modal="true">
          <div className="session-modal templates-upload-modal">
            <h4>Upload template</h4>
            <p>Add a new MJML template to the shared library.</p>
            <label className="templates-upload-field">
              <span>Template name</span>
              <input
                className="templates-project-name-input"
                type="text"
                value={uploadTemplateName}
                onChange={(event) => setUploadTemplateName(event.target.value)}
                placeholder="ex: Marketing Eminence Newsletter RO"
                autoFocus
              />
            </label>
            <label className="templates-upload-field">
              <span>Description (optional)</span>
              <input
                className="templates-project-name-input"
                type="text"
                value={uploadTemplateDescription}
                onChange={(event) => setUploadTemplateDescription(event.target.value)}
                placeholder="Short description for this template"
              />
            </label>
            <label className="templates-upload-field">
              <span>Admin token</span>
              <input
                className="templates-project-name-input"
                type="password"
                value={uploadTemplateAdminToken}
                onChange={(event) => setUploadTemplateAdminToken(event.target.value)}
                placeholder="APP_ACCESS_PASSWORD"
              />
            </label>
            <div className="templates-upload-file-row">
              <button
                type="button"
                className="templates-action-button gjs-btn"
                onClick={() => uploadTemplateInputRef.current?.click()}
              >
                📎 Choose MJML file
              </button>
              <span>{uploadTemplateFileName || 'No file selected'}</span>
            </div>
            <div className="session-modal-actions">
              <button
                type="button"
                className="templates-action-button gjs-btn"
                onClick={closeTemplatesLibraryModal}
                disabled={isUploadingTemplate}
              >
                Cancel
              </button>
              <button
                type="button"
                className="templates-action-button templates-action-button--primary gjs-btn"
                onClick={() => {
                  void submitTemplateUpload();
                }}
                disabled={isUploadingTemplate}
              >
                {isUploadingTemplate ? 'Uploading...' : 'Upload template'}
              </button>
            </div>
            <input
              ref={uploadTemplateInputRef}
              type="file"
              accept=".mjml,text/xml,text/plain"
              onChange={handleUploadTemplateFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      ) : null}
      {projectNameModalAction ? (
        <div className="session-modal-overlay" role="dialog" aria-modal="true">
          <div className="session-modal">
            <h4>Project name</h4>
            <p>
              {projectNameModalAction === 'download-mjml'
                ? 'Set a project name for this MJML download.'
                : 'Set a project name before HTML export.'}
            </p>
            <input
              className="templates-project-name-input"
              type="text"
              value={projectNameDraft}
              onChange={(event) => setProjectNameDraft(event.target.value)}
              placeholder="example: spring-newsletter"
              autoFocus
            />
            <div className="session-modal-actions">
              <button
                type="button"
                className="templates-action-button gjs-btn"
                onClick={cancelProjectNameModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="templates-action-button templates-action-button--primary gjs-btn"
                onClick={() => {
                  void confirmProjectNameModal();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
