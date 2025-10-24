// src/editor/patches/fixMjWrapper.ts
import type { Editor } from 'grapesjs';

/**
 * Hot-patch for grapesjs-mjml: prevents <mj-wrapper> from losing its children
 * when certain style changes (e.g., padding) trigger a rerender.
 *
 * It overrides the wrapper view's rerender to force appendChildren = false.
 */
export function fixMjWrapper(editor: Editor): void {
  // Avoid double-patching (React StrictMode, hot reload, etc.)
  const flag = '__mjWrapperPatched__';
  if ((editor as any)[flag]) return;
  (editor as any)[flag] = true;

  // Wait until everything is registered
  editor.on('load', () => {
    const dc = editor.DomComponents as any;
    const type = dc?.getType?.('mj-wrapper');

    const viewProto = type?.view?.prototype;
    if (!viewProto) {
      console.warn('[fixMjWrapper] Could not find mj-wrapper view prototype.');
      return;
    }

    // Keep original (just in case you ever want to restore / debug)
    const origRerender = viewProto.rerender;

    // Override rerender to avoid appendChildren=true path
    // render(model, frag, opts, appendChildren=false)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    viewProto.rerender = function patchedRerender(this: any, ...args: any[]) {
      if (typeof this.render === 'function') {
        return this.render(null, null, {}, false);
      }
      // Fallback: call original if signature ever changes
      if (typeof origRerender === 'function') {
        return origRerender.apply(this, args);
      }
      return null;
    };

    console.info('[fixMjWrapper] Patched mj-wrapper rerender() successfully.');
  });
}
