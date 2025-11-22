// src/editor/components/TemplatesPanel.tsx
import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useEditorMaybe } from '@grapesjs/react';
import type { Editor, Page } from 'grapesjs';
import { sanitizeMjmlMarkup } from '../utils/mjml';

const MAX_TEMPLATE_SIZE = 5 * 1024 * 1024; // 5MB

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
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);

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

  const formatMjmlErrors = useCallback((errors: unknown) => {
    if (!Array.isArray(errors)) {
      return 'MJML validation failed.';
    }

    return errors
      .map((error) => {
        if (typeof error === 'string') {
          return error;
        }

        if (error && typeof error === 'object') {
          const { message, line, tagName } = error as { [key: string]: unknown };
          const pieces = [message, line ? `Line: ${line}` : null, tagName ? `Tag: ${tagName}` : null]
            .filter(Boolean)
            .join(' - ');

          if (pieces.length > 0) {
            return pieces;
          }
        }

        try {
          return JSON.stringify(error);
        } catch (serializationError) {
          console.error('Unable to serialize MJML error', serializationError);
          return 'Unknown MJML validation error.';
        }
      })
      .join('\n');
  }, []);

  const buildConversionError = useCallback((status: number, statusText: string, rawBody: string) => {
    const statusLabel = statusText ? `${status} ${statusText}` : `${status}`;
    const body = rawBody?.trim();

    if (!body) {
      return `MJML conversion failed (${statusLabel}).`;
    }

    return `MJML conversion failed (${statusLabel}):\n${body}`;
  }, []);

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

  const handleTriggerMjmlImport = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    mjmlInputRef.current?.click();
  }, [editor]);

  const handleTriggerSessionImport = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    sessionInputRef.current?.click();
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
          const sanitizedMarkup = sanitizeMjmlMarkup(result);
          if (!sanitizedMarkup.toLowerCase().startsWith('<mjml')) {
            window.alert('The selected file does not contain a valid <mjml> root element.');
            return;
          }

          const wrapper = editor.DomComponents.getWrapper();
          if (wrapper) {
            wrapper.set('content', '');
          }
          editor.Css.clear();
          editor.setComponents(sanitizedMarkup);
          updateRecents(file.name, 'mjml');
        } catch (error) {
          console.error(error);
          window.alert('Failed to import the MJML template.');
        }
      };

      reader.readAsText(file);
    },
    [editor, updateRecents],
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

  const handleExportSession = useCallback(() => {
    if (!editor) {
      window.alert('Editor is not ready yet.');
      return;
    }

    try {
      const data = editor.getProjectData();
      const serialized = JSON.stringify(data, null, 2);
      const blob = new Blob([serialized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'project.json';
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 0);
    } catch (error) {
      console.error(error);
      window.alert('Failed to export the session.');
    }
  }, [editor]);

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

    const mjmlMarkup = editor.getHtml();
    setIsConverting(true);

    try {
      const response = await fetch('/api/convert-mjml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mjml: mjmlMarkup }),
      });

      const contentType = response.headers
        .get('content-type')
        ?.toLowerCase()
        .includes('application/json');
      const rawBody = await response.text();
      let payload: Record<string, unknown> | null = null;

      if (contentType) {
        try {
          payload = JSON.parse(rawBody || '{}');
        } catch (error) {
          console.error('Unable to parse MJML conversion response JSON', error, rawBody);
        }
      }

      if (!response.ok) {
        if (response.status === 400 && payload?.errors) {
          window.alert(formatMjmlErrors(payload.errors));
          return;
        }

        const failureMessage = buildConversionError(
          response.status,
          response.statusText,
          rawBody,
        );

        console.error('MJML conversion failed', response.status, rawBody);
        window.alert(failureMessage);
        return;
      }

      if (!payload || typeof payload.html !== 'string') {
        console.error('Unexpected conversion response', rawBody);
        window.alert('Unexpected response from MJML conversion service.');
        return;
      }

      downloadFile(payload.html, 'template.html', 'text/html');
    } catch (error) {
      console.error('MJML conversion request failed', error);
      window.alert(`Unable to reach the MJML conversion service: ${String(error)}`);
    } finally {
      setIsConverting(false);
    }
  }, [buildConversionError, downloadFile, editor, formatMjmlErrors]);

  return (
    <div
      className="templates-panel gjs-one-bg gjs-two-color"
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <div className="templates-actions">
        <button
          type="button"
          className="templates-action-button gjs-btn"
          onClick={handleTriggerMjmlImport}
          disabled={!editor}
          title="Import an MJML template from your computer"
        >
          Import MJML Template
        </button>
        <button
          type="button"
          className="templates-action-button gjs-btn"
          onClick={handleTriggerSessionImport}
          disabled={!editor}
          title="Import a previously exported session JSON file"
        >
          Import Session (JSON)
        </button>
        <button
          type="button"
          className="templates-action-button gjs-btn"
          onClick={handleExportSession}
          disabled={!editor}
          title="Download the current editor session as JSON"
        >
          Export Session (JSON)
        </button>
        <button
          type="button"
          className="templates-action-button gjs-btn"
          onClick={handleExportMjml}
          disabled={!editor}
          title="Download the current MJML markup"
        >
          Export MJML
        </button>
        <button
          type="button"
          className="templates-action-button gjs-btn"
          onClick={handleConvertMjmlToHtml}
          disabled={!editor || isConverting}
          title="Convert current MJML to HTML via backend"
        >
          {isConverting ? 'Converting…' : 'Convert MJML to HTML'}
        </button>
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
  );
}
