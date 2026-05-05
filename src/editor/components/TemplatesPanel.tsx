// src/editor/components/TemplatesPanel.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useEditorMaybe } from '@grapesjs/react';
import type { Editor, Page } from 'grapesjs';
import { useLoading } from './useLoading';
import { sanitizeMjmlMarkup } from '../utils/mjml';
import { convertCurrentMjmlToHtml, type HtmlExportProfile } from '../utils/mjmlConversion';
import {
  parseLocalSession,
  serializeLocalSession,
  type StoredSession,
} from '../utils/localSession';

const MAX_TEMPLATE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_REMOTE_TEMPLATE_SIZE = 2 * 1024 * 1024; // 2MB (matches backend guardrail)
const LOCAL_SESSION_KEY_PREFIX = 'mjml-editor-local-session-v1';
const AUTOSAVE_IDLE_MS = 5 * 1000;
const FINGERPRINT_DEBOUNCE_MS = 350;
const SESSION_DB_NAME = 'mjml-editor-session-db';
const SESSION_DB_STORE = 'sessions';
const TAB_SESSION_ID_KEY = 'mjml-editor-tab-session-id-v1';
const TAB_SESSION_OWNER_PREFIX = 'mjml-editor-tab-owner-v1';
const SESSION_RETENTION_DAYS = 7;
const SESSION_RETENTION_MS = SESSION_RETENTION_DAYS * 24 * 60 * 60 * 1000;
const TAB_SESSION_LEASE_MS = 15 * 1000;
const TAB_SESSION_HEARTBEAT_MS = 5 * 1000;
const SHOW_JSON_ACTIONS = false;
const SHOW_RECENT_ACTIVITY = false;

const waitForUiFrame = () =>
  new Promise<void>((resolve) => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
      setTimeout(resolve, 0);
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });

const createTabSessionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const getTabSessionId = (ownerToken: string) => {
  if (typeof window === 'undefined') {
    return 'ssr';
  }

  const readClaim = (tabSessionId: string): { ownerToken: string; updatedAt: number } | null => {
    const claimKey = `${TAB_SESSION_OWNER_PREFIX}:${tabSessionId}`;
    const raw = window.localStorage.getItem(claimKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as { ownerToken?: unknown; updatedAt?: unknown };
      if (
        typeof parsed.ownerToken === 'string' &&
        typeof parsed.updatedAt === 'number' &&
        Number.isFinite(parsed.updatedAt)
      ) {
        return { ownerToken: parsed.ownerToken, updatedAt: parsed.updatedAt };
      }
      return null;
    } catch {
      return null;
    }
  };

  const writeClaim = (tabSessionId: string) => {
    const claimKey = `${TAB_SESSION_OWNER_PREFIX}:${tabSessionId}`;
    window.localStorage.setItem(
      claimKey,
      JSON.stringify({
        ownerToken,
        updatedAt: Date.now(),
      }),
    );
  };

  const hasActiveOwner = (tabSessionId: string) => {
    const claim = readClaim(tabSessionId);
    if (!claim) {
      return false;
    }
    if (claim.ownerToken === ownerToken) {
      return false;
    }
    return Date.now() - claim.updatedAt < TAB_SESSION_LEASE_MS;
  };

  let candidate = window.sessionStorage.getItem(TAB_SESSION_ID_KEY) || createTabSessionId();

  // Ensure uniqueness even when the browser duplicates sessionStorage.
  while (hasActiveOwner(candidate)) {
    candidate = createTabSessionId();
    window.sessionStorage.setItem(TAB_SESSION_ID_KEY, candidate);
  }

  window.sessionStorage.setItem(TAB_SESSION_ID_KEY, candidate);
  writeClaim(candidate);
  return candidate;
};

const buildLocalSessionKey = (tabSessionId: string) => `${LOCAL_SESSION_KEY_PREFIX}:tab:${tabSessionId}`;

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

interface AutosavedSessionItem {
  key: string;
  tabSessionId: string;
  projectName: string | null;
  savedAt: number;
}

const listAutosavedSessionsFromLocalStorage = (): AutosavedSessionItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const items: AutosavedSessionItem[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(`${LOCAL_SESSION_KEY_PREFIX}:tab:`)) {
      continue;
    }
    const raw = window.localStorage.getItem(key);
    const parsed = parseLocalSession(raw);
    if (!parsed) {
      continue;
    }
    items.push({
      key,
      tabSessionId: key.slice(`${LOCAL_SESSION_KEY_PREFIX}:tab:`.length),
      projectName: parsed.projectName,
      savedAt: parsed.savedAt,
    });
  }

  items.sort((a, b) => b.savedAt - a.savedAt);
  return items;
};

type SessionModalKind = 'end-session' | null;
type ProjectActionKind = 'download-mjml' | 'export-html' | 'manual-save' | 'load-template' | null;
type LibraryTemplatesModalKind = 'select-template' | 'upload-template' | null;
type LibrarySortKind = 'recent' | 'name-asc';

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

const writeSessionToIndexedDb = async (key: string, value: string) => {
  const db = await openSessionDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(SESSION_DB_STORE, 'readwrite');
    tx.objectStore(SESSION_DB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to write session to IndexedDB.'));
    tx.onabort = () => reject(tx.error ?? new Error('Failed to write session to IndexedDB.'));
  });
  db.close();
};

const readSessionFromIndexedDb = async (key: string) => {
  const db = await openSessionDb();
  const result = await new Promise<string | null>((resolve, reject) => {
    const tx = db.transaction(SESSION_DB_STORE, 'readonly');
    const request = tx.objectStore(SESSION_DB_STORE).get(key);
    request.onsuccess = () => resolve(typeof request.result === 'string' ? request.result : null);
    request.onerror = () => reject(request.error ?? new Error('Failed to read session from IndexedDB.'));
  });
  db.close();
  return result;
};

const clearSessionFromIndexedDb = async (key: string) => {
  const db = await openSessionDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(SESSION_DB_STORE, 'readwrite');
    tx.objectStore(SESSION_DB_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to clear session from IndexedDB.'));
    tx.onabort = () => reject(tx.error ?? new Error('Failed to clear session from IndexedDB.'));
  });
  db.close();
};

const purgeExpiredLocalSessions = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  const now = Date.now();
  const keysToDelete: string[] = [];

  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(`${LOCAL_SESSION_KEY_PREFIX}:tab:`)) {
      continue;
    }

    const raw = window.localStorage.getItem(key);
    if (!raw) {
      keysToDelete.push(key);
      continue;
    }

    const parsed = parseLocalSession(raw);
    if (!parsed) {
      keysToDelete.push(key);
      continue;
    }

    const ageMs = now - parsed.savedAt;
    if (!Number.isFinite(ageMs) || ageMs > SESSION_RETENTION_MS) {
      keysToDelete.push(key);
    }
  }

  if (keysToDelete.length === 0) {
    return;
  }

  await Promise.all(
    keysToDelete.map(async (key) => {
      window.localStorage.removeItem(key);
      try {
        await clearSessionFromIndexedDb(key);
      } catch (error) {
        console.error('Failed to clear expired session from IndexedDB.', error);
      }
    }),
  );
};

export interface TemplatesPanelProps {
  isVisible: boolean;
}

export default function TemplatesPanel({ isVisible }: TemplatesPanelProps) {
  const editor = useEditorMaybe();
  const { show } = useLoading();
  const tabOwnerTokenRef = useRef(createTabSessionId());
  const tabSessionIdRef = useRef(getTabSessionId(tabOwnerTokenRef.current));
  const scopedSessionKeyRef = useRef(buildLocalSessionKey(tabSessionIdRef.current));
  const scopedSessionKey = scopedSessionKeyRef.current;
  const mjmlInputRef = useRef<HTMLInputElement | null>(null);
  const sessionInputRef = useRef<HTMLInputElement | null>(null);
  const uploadTemplateInputRef = useRef<HTMLInputElement | null>(null);
  const didTryRestoreRef = useRef(false);
  const fingerprintDebounceRef = useRef<number | null>(null);
  const autosaveTimeoutRef = useRef<number | null>(null);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [htmlExportProfile, setHtmlExportProfile] = useState<HtmlExportProfile>('email-safe');
  const [currentFingerprint, setCurrentFingerprint] = useState<string | null>(null);
  const [savedFingerprint, setSavedFingerprint] = useState<string | null>(null);
  const [lastAutosaveAt, setLastAutosaveAt] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sessionModal, setSessionModal] = useState<SessionModalKind>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [projectVersion, setProjectVersion] = useState(1);
  const [versionFingerprint, setVersionFingerprint] = useState<string | null>(null);
  const [freshTemplateFingerprint, setFreshTemplateFingerprint] = useState<string | null>(null);
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  const [projectNameDraft, setProjectNameDraft] = useState('');
  const [projectNameModalAction, setProjectNameModalAction] = useState<ProjectActionKind>(null);
  const [libraryTemplatesModal, setLibraryTemplatesModal] = useState<LibraryTemplatesModalKind>(null);
  const [remoteTemplates, setRemoteTemplates] = useState<RemoteTemplate[]>([]);
  const [isLoadingRemoteTemplates, setIsLoadingRemoteTemplates] = useState(false);
  const [remoteTemplatesError, setRemoteTemplatesError] = useState<string | null>(null);
  const [activeRemoteTemplateId, setActiveRemoteTemplateId] = useState<string | null>(null);
  const [activeDeleteTemplateId, setActiveDeleteTemplateId] = useState<string | null>(null);
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [librarySort, setLibrarySort] = useState<LibrarySortKind>('recent');
  const [pendingDeleteTemplate, setPendingDeleteTemplate] = useState<RemoteTemplate | null>(null);
  const [deleteTemplateAdminToken, setDeleteTemplateAdminToken] = useState('');
  const [uploadTemplateName, setUploadTemplateName] = useState('');
  const [uploadTemplateDescription, setUploadTemplateDescription] = useState('');
  const [uploadTemplateAdminToken, setUploadTemplateAdminToken] = useState('');
  const [uploadTemplateFileName, setUploadTemplateFileName] = useState<string | null>(null);
  const [uploadTemplateMjml, setUploadTemplateMjml] = useState<string | null>(null);
  const [isUploadingTemplate, setIsUploadingTemplate] = useState(false);
  const [autosavedSessions, setAutosavedSessions] = useState<AutosavedSessionItem[]>([]);
  const [activeAutosavedSessionKey, setActiveAutosavedSessionKey] = useState<string | null>(null);
  const [isCompactSessionStatus, setIsCompactSessionStatus] = useState(false);

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

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const notifyEditorNotReady = useCallback(() => {
    showToast('Editor is not ready yet.');
  }, [showToast]);

  const loadStoredSession = useCallback(async (): Promise<StoredSession | null> => {
    const raw = window.localStorage.getItem(scopedSessionKey);
    const parsed = parseLocalSession(raw);
    if (parsed) {
      return parsed;
    }
    if (raw && !parsed) {
      // Clear corrupted or incompatible payloads so they don't repeatedly prompt restore.
      window.localStorage.removeItem(scopedSessionKey);
    }
    try {
      const indexedDbRaw = await readSessionFromIndexedDb(scopedSessionKey);
      const indexedDbParsed = parseLocalSession(indexedDbRaw);
      if (!indexedDbParsed && indexedDbRaw) {
        await clearSessionFromIndexedDb(scopedSessionKey);
      }
      return indexedDbParsed;
    } catch (error) {
      console.error('Failed to load session from IndexedDB fallback.', error);
      return null;
    }
  }, [scopedSessionKey]);

  const loadStoredSessionByKey = useCallback(async (sessionKey: string): Promise<StoredSession | null> => {
    const raw = window.localStorage.getItem(sessionKey);
    const parsed = parseLocalSession(raw);
    if (parsed) {
      return parsed;
    }
    if (raw && !parsed) {
      window.localStorage.removeItem(sessionKey);
    }
    try {
      const indexedDbRaw = await readSessionFromIndexedDb(sessionKey);
      const indexedDbParsed = parseLocalSession(indexedDbRaw);
      if (!indexedDbParsed && indexedDbRaw) {
        await clearSessionFromIndexedDb(sessionKey);
      }
      return indexedDbParsed;
    } catch (error) {
      console.error('Failed to load session from IndexedDB fallback.', error);
      return null;
    }
  }, []);

  const reconcileAutosavedSessions = useCallback(() => {
    const items = listAutosavedSessionsFromLocalStorage();
    setAutosavedSessions(items);
    setActiveAutosavedSessionKey((current) => {
      if (!current) {
        return current;
      }
      return items.some((item) => item.key === current) ? current : null;
    });
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
          window.localStorage.setItem(scopedSessionKey, serializedPayload);
          try {
            await clearSessionFromIndexedDb(scopedSessionKey);
          } catch {
            // Ignore cleanup failures; localStorage already has the latest payload.
          }
        } catch (error) {
          if (!isQuotaExceededError(error)) {
            throw error;
          }
          await writeSessionToIndexedDb(scopedSessionKey, serializedPayload);
          window.localStorage.removeItem(scopedSessionKey);
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
        reconcileAutosavedSessions();

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
    [editor, projectName, projectVersion, reconcileAutosavedSessions, scopedSessionKey, versionFingerprint],
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
        setFreshTemplateFingerprint(null);
        setAutosaveEnabled(true);
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
    setFreshTemplateFingerprint(initialFingerprint);
    setAutosaveEnabled(false);
  }, [editor]);

  useEffect(() => {
    void (async () => {
      await purgeExpiredLocalSessions();
      reconcileAutosavedSessions();
    })();
  }, [reconcileAutosavedSessions]);

  useEffect(() => {
    reconcileAutosavedSessions();
  }, [reconcileAutosavedSessions]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageOrFocusSync = () => {
      reconcileAutosavedSessions();
    };
    const handleVisibilitySync = () => {
      if (document.visibilityState === 'visible') {
        reconcileAutosavedSessions();
      }
    };

    window.addEventListener('storage', handleStorageOrFocusSync);
    window.addEventListener('focus', handleStorageOrFocusSync);
    document.addEventListener('visibilitychange', handleVisibilitySync);

    return () => {
      window.removeEventListener('storage', handleStorageOrFocusSync);
      window.removeEventListener('focus', handleStorageOrFocusSync);
      document.removeEventListener('visibilitychange', handleVisibilitySync);
    };
  }, [reconcileAutosavedSessions]);

  useEffect(() => {
    const tabSessionId = tabSessionIdRef.current;
    const ownerToken = tabOwnerTokenRef.current;
    const claimKey = `${TAB_SESSION_OWNER_PREFIX}:${tabSessionId}`;

    const writeClaimHeartbeat = () => {
      window.localStorage.setItem(
        claimKey,
        JSON.stringify({
          ownerToken,
          updatedAt: Date.now(),
        }),
      );
    };

    const releaseClaimOnUnload = () => {
      const raw = window.localStorage.getItem(claimKey);
      if (!raw) {
        return;
      }
      try {
        const parsed = JSON.parse(raw) as { ownerToken?: unknown };
        if (parsed.ownerToken === ownerToken) {
          window.localStorage.removeItem(claimKey);
        }
      } catch {
        window.localStorage.removeItem(claimKey);
      }
    };

    writeClaimHeartbeat();
    const heartbeatId = window.setInterval(writeClaimHeartbeat, TAB_SESSION_HEARTBEAT_MS);
    window.addEventListener('beforeunload', releaseClaimOnUnload);

    return () => {
      window.clearInterval(heartbeatId);
      window.removeEventListener('beforeunload', releaseClaimOnUnload);
    };
  }, []);

  useEffect(() => {
    if (!editor || didTryRestoreRef.current) {
      return;
    }

    didTryRestoreRef.current = true;
    void (async () => {
      const stored = await loadStoredSession();
      if (stored) {
        const release = show(
          'Restoring last session…',
          'Applying your saved draft from this browser tab.',
        );
        try {
          await waitForUiFrame();
          await waitForUiFrame();
          restoreStoredSession(stored);
        } finally {
          release();
        }
        return;
      }
      initializeFreshSessionState();
    })();
  }, [editor, initializeFreshSessionState, loadStoredSession, restoreStoredSession, show]);

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
    if (autosaveTimeoutRef.current) {
      window.clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }
    if (!editor || !autosaveEnabled) {
      return;
    }
    if (!currentFingerprint || currentFingerprint === savedFingerprint) {
      return;
    }

    autosaveTimeoutRef.current = window.setTimeout(() => {
      void saveSessionToLocal('auto');
    }, AUTOSAVE_IDLE_MS);

    return () => {
      if (autosaveTimeoutRef.current) {
        window.clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    };
  }, [autosaveEnabled, currentFingerprint, editor, saveSessionToLocal, savedFingerprint]);

  useEffect(() => {
    if (autosaveEnabled) {
      return;
    }
    if (!freshTemplateFingerprint || !currentFingerprint) {
      return;
    }
    if (currentFingerprint !== freshTemplateFingerprint) {
      setAutosaveEnabled(true);
    }
  }, [autosaveEnabled, currentFingerprint, freshTemplateFingerprint]);

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
        notifyEditorNotReady();
        return;
      }

      const versionState = resolveProjectVersionForOutput();
      if (!versionState) {
        showToast('Unable to determine the current MJML content.');
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
    [
      downloadFile,
      editor,
      notifyEditorNotReady,
      resolveProjectVersionForOutput,
      sanitizeProjectFileName,
      saveSessionToLocal,
      showToast,
    ],
  );

  const executeExportHtml = useCallback(
    async (resolvedProjectName: string) => {
      if (!editor) {
        notifyEditorNotReady();
        return;
      }

      const versionState = resolveProjectVersionForOutput();
      if (!versionState) {
        showToast('Unable to determine the current MJML content.');
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
      notifyEditorNotReady,
      resolveProjectVersionForOutput,
      sanitizeProjectFileName,
      saveSessionToLocal,
      showToast,
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
    const base = normalized || 'template';
    // Keep every upload as a new entry to avoid accidental overwrite
    // when users reuse names similar to default templates.
    return `${base}-${Date.now()}`;
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
      notifyEditorNotReady();
      return;
    }
    setLibrarySearchQuery('');
    setLibrarySort('recent');
    setLibraryTemplatesModal('select-template');
    void loadRemoteTemplates();
  }, [editor, loadRemoteTemplates, notifyEditorNotReady]);

  const openUploadTemplateModal = useCallback(() => {
    if (!editor) {
      notifyEditorNotReady();
      return;
    }
    setUploadTemplateName('');
    setUploadTemplateDescription('');
    setUploadTemplateAdminToken('');
    setUploadTemplateFileName(null);
    setUploadTemplateMjml(null);
    setLibraryTemplatesModal('upload-template');
  }, [editor, notifyEditorNotReady]);

  const closeTemplatesLibraryModal = useCallback(() => {
    setLibraryTemplatesModal(null);
    setActiveRemoteTemplateId(null);
    setActiveDeleteTemplateId(null);
    setPendingDeleteTemplate(null);
    setDeleteTemplateAdminToken('');
    setIsUploadingTemplate(false);
  }, []);

  const loadRemoteTemplateIntoEditor = useCallback(
    async (template: RemoteTemplate) => {
      if (!editor) {
        notifyEditorNotReady();
        return;
      }
      setActiveRemoteTemplateId(template.id);
      const releaseLoading = show('Loading template…', template.name);
      try {
        const response = await fetch(`/api/templates/${encodeURIComponent(template.id)}`);
        const payload = (await response.json().catch(() => null)) as
          | { mjml?: string; error?: string }
          | null;
        if (!response.ok) {
          showToast(payload?.error || 'Failed to load selected template.');
          return;
        }
        if (typeof payload?.mjml !== 'string' || !payload.mjml.trim()) {
          showToast('Selected template is empty or invalid.');
          return;
        }

        await waitForUiFrame();
        const applied = applyMjmlToEditor(payload.mjml);
        if (!applied) {
          showToast('Selected template does not contain a valid <mjml> root element.');
          return;
        }

        setProjectName(null);
        setFreshTemplateFingerprint(null);
        setAutosaveEnabled(true);
        updateRecents(template.name, 'mjml');
        setProjectNameDraft(template.name.trim());
        setProjectNameModalAction('load-template');
        closeTemplatesLibraryModal();
      } catch (error) {
        console.error('Failed to load remote template.', error);
        showToast('Failed to load selected template.');
      } finally {
        releaseLoading();
        setActiveRemoteTemplateId(null);
      }
    },
    [applyMjmlToEditor, closeTemplatesLibraryModal, editor, notifyEditorNotReady, show, showToast, updateRecents],
  );

  const handleUploadTemplateFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      input.value = '';
      return;
    }
    if (file.size > MAX_REMOTE_TEMPLATE_SIZE) {
      showToast('Template file is too large (maximum size is 2 MB).');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      showToast('Failed to read the selected MJML file.');
      input.value = '';
    };
    reader.onload = () => {
      input.value = '';
      const result = reader.result;
      if (typeof result !== 'string' || !result.trim()) {
        showToast('Unable to read MJML file contents.');
        return;
      }
      if (!sanitizeMjmlMarkup(result).toLowerCase().startsWith('<mjml')) {
        showToast('The selected file does not contain a valid <mjml> root element.');
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
  }, [showToast, uploadTemplateName]);

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
        showToast(payload?.error || 'Failed to upload template.');
        return;
      }
      setToastMessage(`Template uploaded: ${name}`);
      setLibraryTemplatesModal('select-template');
      setUploadTemplateMjml(null);
      setUploadTemplateFileName(null);
      await loadRemoteTemplates();
    } catch (error) {
      console.error('Failed to upload template.', error);
      showToast('Failed to upload template.');
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
    showToast,
  ]);

  const openDeleteTemplateModal = useCallback((template: RemoteTemplate) => {
    setPendingDeleteTemplate(template);
    setDeleteTemplateAdminToken('');
  }, []);

  const cancelDeleteTemplateModal = useCallback(() => {
    setPendingDeleteTemplate(null);
    setDeleteTemplateAdminToken('');
  }, []);

  const confirmDeleteTemplate = useCallback(async () => {
      if (!pendingDeleteTemplate) {
        return;
      }
      const token = deleteTemplateAdminToken.trim();
      if (!token) {
        setToastMessage('Admin token is required for delete.');
        return;
      }

      const template = pendingDeleteTemplate;
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
          showToast(payload?.error || 'Failed to delete template.');
          return;
        }

        setToastMessage(`Template deleted: ${template.name}`);
        setPendingDeleteTemplate(null);
        setDeleteTemplateAdminToken('');
        await loadRemoteTemplates();
      } catch (error) {
        console.error('Failed to delete template.', error);
        showToast('Failed to delete template.');
      } finally {
        setActiveDeleteTemplateId(null);
      }
    }, [deleteTemplateAdminToken, loadRemoteTemplates, pendingDeleteTemplate, showToast]);

  const handleTriggerMjmlImport = useCallback(() => {
    if (!editor) {
      notifyEditorNotReady();
      return;
    }

    mjmlInputRef.current?.click();
  }, [editor, notifyEditorNotReady]);

  const handleImportMjmlChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const file = input.files?.[0];

      if (!file) {
        input.value = '';
        return;
      }

      if (!editor) {
        notifyEditorNotReady();
        input.value = '';
        return;
      }

      if (file.size > MAX_TEMPLATE_SIZE) {
        showToast('Template is too large (maximum size is 5 MB).');
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        showToast('Failed to read the selected MJML file.');
        input.value = '';
      };
      reader.onload = async () => {
        input.value = '';
        const result = reader.result;
        if (typeof result !== 'string') {
          showToast('Unable to read MJML file contents.');
          return;
        }

        const releaseLoading = show('Importing MJML file…', file.name);
        try {
          await waitForUiFrame();
          const applied = applyMjmlToEditor(result);
          if (!applied) {
            showToast('The selected file does not contain a valid <mjml> root element.');
            return;
          }
          setFreshTemplateFingerprint(null);
          setAutosaveEnabled(true);
          updateRecents(file.name, 'mjml');
          // Persist imported content right away so refresh restores this exact session.
          window.setTimeout(() => {
            void saveSessionToLocal('auto');
          }, 0);
        } catch (error) {
          console.error(error);
          showToast('Failed to import the MJML template.');
        } finally {
          releaseLoading();
        }
      };

      reader.readAsText(file);
    },
    [applyMjmlToEditor, editor, notifyEditorNotReady, saveSessionToLocal, show, showToast, updateRecents],
  );

  const handleTriggerSessionImport = useCallback(() => {
    if (!editor) {
      notifyEditorNotReady();
      return;
    }
    sessionInputRef.current?.click();
  }, [editor, notifyEditorNotReady]);

  const handleImportSessionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const file = input.files?.[0];

      if (!file) {
        input.value = '';
        return;
      }

      if (!editor) {
        notifyEditorNotReady();
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        showToast('Failed to read the selected session file.');
        input.value = '';
      };
      reader.onload = async () => {
        input.value = '';
        const result = reader.result;
        if (typeof result !== 'string') {
          showToast('Invalid session JSON file.');
          return;
        }

        const releaseLoading = show('Importing session…', file.name);
        try {
          await waitForUiFrame();
          const projectData = JSON.parse(result) as Parameters<Editor['loadProjectData']>[0];
          editor.loadProjectData(projectData);
          const pages = editor.Pages.getAll();
          const firstPage = pages[0] as Page | undefined;
          if (firstPage) {
            editor.Pages.select(firstPage);
          }
          updateRecents(file.name, 'json');
          showToast('Session imported successfully.');
        } catch (error) {
          console.error(error);
          showToast('Invalid session JSON file.');
        } finally {
          releaseLoading();
        }
      };

      reader.readAsText(file);
    },
    [editor, notifyEditorNotReady, show, showToast, updateRecents],
  );

  const handleExportMjml = useCallback(() => {
    if (!editor) {
      notifyEditorNotReady();
      return;
    }
    if (!projectName) {
      requestProjectNameForAction('download-mjml');
      return;
    }
    executeDownloadMjml(projectName);
  }, [editor, executeDownloadMjml, notifyEditorNotReady, projectName, requestProjectNameForAction]);

  const handleConvertMjmlToHtml = useCallback(async () => {
    if (!editor) {
      notifyEditorNotReady();
      return;
    }

    if (!projectName) {
      requestProjectNameForAction('export-html');
      return;
    }

    await executeExportHtml(projectName);
  }, [editor, executeExportHtml, notifyEditorNotReady, projectName, requestProjectNameForAction]);

  const handleManualSave = useCallback(() => {
    if (!editor) {
      notifyEditorNotReady();
      return;
    }

    if (!projectName) {
      requestProjectNameForAction('manual-save');
      return;
    }

    void saveSessionToLocal('manual');
  }, [editor, notifyEditorNotReady, projectName, requestProjectNameForAction, saveSessionToLocal]);

  const handleEndSession = useCallback(() => {
    setSessionModal('end-session');
  }, []);

  const handleRestoreAutosavedSession = useCallback(
    async (sessionKey: string) => {
      if (!editor) {
        notifyEditorNotReady();
        return;
      }

      setActiveAutosavedSessionKey(sessionKey);
      try {
        const stored = await loadStoredSessionByKey(sessionKey);
        if (!stored) {
          setToastMessage('Selected autosaved session is no longer available.');
          reconcileAutosavedSessions();
          return;
        }

        const displayName = stored.projectName?.trim() || 'Untitled project';
        const releaseLoading = show('Restoring session…', displayName);
        try {
          if (sessionKey !== scopedSessionKey) {
            const restoredPayload = serializeLocalSession(stored.mjml, stored.savedAt, {
              projectName: stored.projectName,
              projectVersion: stored.projectVersion,
              versionFingerprint: stored.versionFingerprint,
            });
            try {
              window.localStorage.setItem(scopedSessionKey, restoredPayload);
              try {
                await clearSessionFromIndexedDb(scopedSessionKey);
              } catch {
                // Ignore cleanup failures when localStorage already has the payload.
              }
            } catch (error) {
              if (!isQuotaExceededError(error)) {
                throw error;
              }
              await writeSessionToIndexedDb(scopedSessionKey, restoredPayload);
              window.localStorage.removeItem(scopedSessionKey);
            }
            window.localStorage.removeItem(sessionKey);
            try {
              await clearSessionFromIndexedDb(sessionKey);
            } catch {
              // Ignore cleanup failures for source key migration.
            }
          }

          restoreStoredSession(stored);
          setFreshTemplateFingerprint(null);
          setAutosaveEnabled(true);
          reconcileAutosavedSessions();
          setToastMessage('Autosaved session restored.');
        } finally {
          releaseLoading();
        }
      } finally {
        setActiveAutosavedSessionKey(null);
      }
    },
    [
      editor,
      loadStoredSessionByKey,
      notifyEditorNotReady,
      reconcileAutosavedSessions,
      restoreStoredSession,
      scopedSessionKey,
      show,
    ],
  );

  const filteredRemoteTemplates = useMemo(() => {
    const normalizedQuery = librarySearchQuery.trim().toLowerCase();
    const byFilter = remoteTemplates.filter((template) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        template.name.toLowerCase().includes(normalizedQuery) ||
        template.description.toLowerCase().includes(normalizedQuery);
      return matchesQuery;
    });

    const sorted = [...byFilter];
    if (librarySort === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      return sorted;
    }
    sorted.sort((a, b) => {
      const aTs = Date.parse(a.updatedAt || '');
      const bTs = Date.parse(b.updatedAt || '');
      return (Number.isFinite(bTs) ? bTs : 0) - (Number.isFinite(aTs) ? aTs : 0);
    });
    return sorted;
  }, [librarySearchQuery, librarySort, remoteTemplates]);

  const confirmEndSession = useCallback(() => {
    window.localStorage.removeItem(scopedSessionKey);
    void clearSessionFromIndexedDb(scopedSessionKey);
    reconcileAutosavedSessions();
    setSavedFingerprint(null);
    setLastAutosaveAt(null);
    setSessionModal(null);
    window.location.reload();
  }, [reconcileAutosavedSessions, scopedSessionKey]);

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
      return;
    }
    if (action === 'manual-save') {
      setProjectName(trimmed);
      await saveSessionToLocal('manual', { projectName: trimmed });
      return;
    }
    if (action === 'load-template') {
      setProjectName(trimmed);
      await saveSessionToLocal('manual', { projectName: trimmed });
      setToastMessage(`Template loaded. Project name: ${trimmed}`);
    }
  }, [
    executeDownloadMjml,
    executeExportHtml,
    projectNameDraft,
    projectNameModalAction,
    saveSessionToLocal,
  ]);

  const isUnsaved =
    autosaveEnabled &&
    currentFingerprint !== null &&
    savedFingerprint !== null &&
    currentFingerprint !== savedFingerprint;
  const hasLocalSave = savedFingerprint !== null && lastAutosaveAt !== null;
  const sessionStatusLabel = !hasLocalSave
    ? 'No local save yet'
    : isUnsaved
      ? 'Unsaved changes'
      : 'Autosaved';
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
  const shouldShowSessionStatus = hasLocalSave || isUnsaved;

  useEffect(() => {
    if (!shouldShowSessionStatus || isUnsaved) {
      setIsCompactSessionStatus(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCompactSessionStatus(true);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isUnsaved, shouldShowSessionStatus, lastAutosaveAt]);

  return (
    <>
      <div
        className="templates-panel gjs-one-bg gjs-two-color"
        style={{ display: isVisible ? 'flex' : 'none' }}
      >
        <div className="templates-actions">
          <div className="templates-action-group">
            <div className="templates-group-header">
              <h4 className="templates-group-title">Quick Actions</h4>
              <p className="templates-group-description">
                Import or export template files for the current project.
              </p>
            </div>
            <div className="templates-action-row">
              <button
                type="button"
                className="templates-action-button templates-action-button--secondary gjs-btn"
                onClick={handleTriggerMjmlImport}
                disabled={!editor}
                title="Import an MJML template from your computer"
              >
                📂 Import MJML File
              </button>
              <button
                type="button"
                className="templates-action-button templates-action-button--secondary gjs-btn"
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
            <div className="templates-group-header">
              <h4 className="templates-group-title">Session</h4>
            </div>
            <div className="templates-action-row">
              <button
                type="button"
                className="templates-action-button templates-action-button--secondary gjs-btn"
                onClick={handleManualSave}
                disabled={!editor}
                title="Save current session to local storage"
              >
                ✅ Save Session
              </button>
              <button
                type="button"
                className="templates-action-button templates-action-button--danger gjs-btn"
                onClick={handleEndSession}
                title="Clear local session and restart"
              >
                🧹 End Session
              </button>
            </div>
            {SHOW_JSON_ACTIONS ? (
              <div className="templates-action-row">
                <button
                  type="button"
                  className="templates-action-button templates-action-button--secondary gjs-btn"
                  onClick={handleTriggerSessionImport}
                  disabled={!editor}
                  title="Import a saved GrapesJS session JSON"
                >
                  📥 Import Session JSON
                </button>
              </div>
            ) : null}
          </div>

          <div className="templates-action-group templates-action-group--database">
            <div className="templates-group-header">
              <h4 className="templates-group-title">Template Library</h4>
              <p className="templates-group-description">
                Browse shared templates or upload new ones to the database.
              </p>
            </div>
            <div className="templates-action-row">
              <button
                type="button"
                className="templates-action-button templates-action-button--full templates-action-button--secondary gjs-btn"
                onClick={openTemplatesLibraryModal}
                disabled={!editor}
                title="Select one of the shared MJML templates from the database"
              >
                🗂️ Select template from database
              </button>
            </div>
            <div className="templates-action-row">
              <button
                type="button"
                className="templates-action-button templates-action-button--full templates-action-button--secondary gjs-btn"
                onClick={openUploadTemplateModal}
                disabled={!editor}
                title="Upload a new shared template to the database"
              >
                ⬆️ Upload template to database
              </button>
            </div>
            <div className="templates-autosaved-sessions">
              <h5 className="templates-subgroup-title">Sessions saved locally</h5>
              {autosavedSessions.length > 0 ? (
                <ul className="templates-autosaved-list">
                  {autosavedSessions.map((session) => {
                    const isCurrentTab = session.key === scopedSessionKey;
                    const displayName = session.projectName?.trim() || 'Untitled project';
                    const savedAtLabel = new Date(session.savedAt).toLocaleString();
                    const isRestoring = activeAutosavedSessionKey === session.key;
                    return (
                      <li
                        key={session.key}
                        className={`templates-autosaved-item ${isCurrentTab ? 'templates-autosaved-item--active' : ''}`}
                      >
                        <div className="templates-autosaved-meta">
                          <strong>{displayName}</strong>
                          <span>{savedAtLabel}</span>
                          <span>{isCurrentTab ? 'Current tab session' : `Tab ${session.tabSessionId}`}</span>
                        </div>
                        <button
                          type="button"
                          className="templates-action-button gjs-btn"
                          disabled={!editor || isRestoring}
                          onClick={() => {
                            void handleRestoreAutosavedSession(session.key);
                          }}
                        >
                          {isRestoring ? 'Restoring...' : 'Restore'}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="templates-autosaved-empty">No autosaved sessions found in local storage.</p>
              )}
            </div>
          </div>
        </div>

        {SHOW_RECENT_ACTIVITY ? (
          <div className="templates-recents">
            <h4>Recent activity</h4>
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
        ) : null}

        <input
          ref={mjmlInputRef}
          type="file"
          accept=".mjml,text/xml,text/plain"
          onChange={handleImportMjmlChange}
          style={{ display: 'none' }}
        />
        {SHOW_JSON_ACTIONS ? (
          <input
            ref={sessionInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportSessionChange}
            style={{ display: 'none' }}
          />
        ) : null}
      </div>
      {shouldShowSessionStatus ? (
        <div
          className={`${sessionStatusClass} ${isCompactSessionStatus ? 'session-status-badge--compact' : ''}`}
          role="status"
          aria-live="polite"
          aria-label={
            lastAutosaveLabel
              ? `${sessionStatusLabel}. Last autosave at ${lastAutosaveLabel}.`
              : sessionStatusLabel
          }
        >
          <div className="session-status-title">
            <span className="session-status-dot" aria-hidden="true" />
            <span className="session-status-label">{sessionStatusLabel}</span>
          </div>
          <div className="session-status-meta">
            {lastAutosaveLabel ? `Last autosave at ${lastAutosaveLabel}` : 'Last autosave: not yet'}
          </div>
        </div>
      ) : null}
      {toastMessage ? (
        <div className="session-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}
      {sessionModal ? (
        <div className="session-modal-overlay" role="dialog" aria-modal="true">
          <div className="session-modal">
            {sessionModal === 'end-session' ? (
              <>
                <h4>End current session?</h4>
                <p>This will clear the local draft for this tab and reload the editor.</p>
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
                    className="templates-action-button templates-action-button--danger gjs-btn"
                    onClick={confirmEndSession}
                  >
                    End session
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
      {libraryTemplatesModal === 'select-template' ? (
        <div className="session-modal-overlay" role="dialog" aria-modal="true">
          <div className="session-modal templates-library-modal">
            <h4>Select template</h4>
            <p>Choose a shared MJML template to load into the editor.</p>
            <div className="templates-library-controls">
              <input
                className="templates-project-name-input templates-library-search-input"
                type="search"
                value={librarySearchQuery}
                onChange={(event) => setLibrarySearchQuery(event.target.value)}
                placeholder="Search by name or description"
              />
              <div className="templates-library-control-row templates-library-control-row--single">
                <label className="templates-library-control-field">
                  <span>Sort</span>
                  <select
                    className="templates-profile-select"
                    value={librarySort}
                    onChange={(event) => setLibrarySort(event.target.value as LibrarySortKind)}
                  >
                    <option value="recent">Most recent</option>
                    <option value="name-asc">Name A-Z</option>
                  </select>
                </label>
              </div>
            </div>
            {isLoadingRemoteTemplates ? (
              <p className="templates-library-state">Loading templates...</p>
            ) : null}
            {remoteTemplatesError ? (
              <p className="templates-library-state templates-library-state--error">{remoteTemplatesError}</p>
            ) : null}
            {!isLoadingRemoteTemplates && !remoteTemplatesError ? (
              filteredRemoteTemplates.length > 0 ? (
                <ul className="templates-library-list">
                  {filteredRemoteTemplates.map((template) => {
                    const updatedAtLabel = template.updatedAt
                      ? new Date(template.updatedAt).toLocaleDateString()
                      : null;
                    return (
                      <li key={template.id} className="templates-library-item">
                        <div className="templates-library-item-header">
                          <strong>{template.name}</strong>
                        </div>
                        {template.description ? (
                          <p className="templates-library-item-description">{template.description}</p>
                        ) : null}
                        <div className="templates-library-item-footer">
                          <span>{updatedAtLabel ? `Updated ${updatedAtLabel}` : ' '}</span>
                          <div className="templates-library-item-actions">
                            <button
                              type="button"
                              className="templates-action-button templates-action-button--secondary gjs-btn"
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
                                openDeleteTemplateModal(template);
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
                <p className="templates-library-state">
                  {remoteTemplates.length === 0
                    ? 'No templates are available yet.'
                    : 'No templates match the current filters.'}
                </p>
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
                className="templates-action-button templates-action-button--secondary gjs-btn"
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
      {pendingDeleteTemplate ? (
        <div className="session-modal-overlay" role="dialog" aria-modal="true">
          <div className="session-modal templates-upload-modal">
            <h4>Delete template</h4>
            <p>
              You are deleting <strong>{pendingDeleteTemplate.name}</strong>. This cannot be undone.
            </p>
            <label className="templates-upload-field">
              <span>Admin token</span>
              <input
                className="templates-project-name-input"
                type="password"
                value={deleteTemplateAdminToken}
                onChange={(event) => setDeleteTemplateAdminToken(event.target.value)}
                placeholder="APP_ACCESS_PASSWORD"
                autoFocus
              />
            </label>
            <div className="session-modal-actions">
              <button
                type="button"
                className="templates-action-button gjs-btn"
                onClick={cancelDeleteTemplateModal}
                disabled={activeDeleteTemplateId === pendingDeleteTemplate.id}
              >
                Cancel
              </button>
              <button
                type="button"
                className="templates-action-button templates-action-button--danger gjs-btn"
                onClick={() => {
                  void confirmDeleteTemplate();
                }}
                disabled={activeDeleteTemplateId === pendingDeleteTemplate.id}
              >
                {activeDeleteTemplateId === pendingDeleteTemplate.id ? 'Deleting...' : 'Delete template'}
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
                : projectNameModalAction === 'export-html'
                  ? 'Set a project name before HTML export.'
                  : projectNameModalAction === 'manual-save'
                    ? 'Name this project to save the local session.'
                    : 'Name this project before loading the database template.'}
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
                Save name
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
