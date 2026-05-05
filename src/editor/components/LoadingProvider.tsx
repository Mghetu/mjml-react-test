// src/editor/components/LoadingProvider.tsx
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import LoadingOverlay from './LoadingOverlay';
import { LoadingContext } from './useLoading';

const SHOW_DELAY_MS = 0;
const MIN_VISIBLE_MS = 350;

type LoadingOp = {
  id: number;
  title: string;
  message?: string;
};

export default function LoadingProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<LoadingOp[]>([]);
  const [visible, setVisible] = useState(false);
  const [displayOp, setDisplayOp] = useState<LoadingOp | null>(null);

  const nextIdRef = useRef(1);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const visibleSinceRef = useRef<number | null>(null);

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current != null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current != null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const top = stack.at(-1) ?? null;

  useEffect(() => {
    if (top) {
      setDisplayOp(top);
    } else if (!visible) {
      setDisplayOp(null);
    }
  }, [top, visible]);

  useEffect(() => {
    if (stack.length > 0) {
      clearHideTimer();
      if (!visible && showTimerRef.current == null) {
        showTimerRef.current = window.setTimeout(() => {
          showTimerRef.current = null;
          setVisible(true);
          visibleSinceRef.current = Date.now();
        }, SHOW_DELAY_MS);
      }
      return undefined;
    }

    clearShowTimer();
    if (!visible) {
      visibleSinceRef.current = null;
      return undefined;
    }

    const since = visibleSinceRef.current ?? Date.now();
    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - since));
    hideTimerRef.current = window.setTimeout(() => {
      hideTimerRef.current = null;
      setVisible(false);
      visibleSinceRef.current = null;
    }, wait);

    return () => {
      clearHideTimer();
    };
  }, [stack, visible, clearHideTimer, clearShowTimer]);

  useEffect(
    () => () => {
      clearShowTimer();
      clearHideTimer();
    },
    [clearHideTimer, clearShowTimer],
  );

  const dismiss = useCallback((id: number) => {
    setStack((prev) => prev.filter((op) => op.id !== id));
  }, []);

  const show = useCallback(
    (title: string, message?: string) => {
      const id = nextIdRef.current++;
      setStack((prev) => [...prev, { id, title, message }]);
      return () => {
        dismiss(id);
      };
    },
    [dismiss],
  );

  const withLoading = useCallback(
    async <T,>(promise: Promise<T>, title: string, message?: string): Promise<T> => {
      const release = show(title, message);
      try {
        return await promise;
      } finally {
        release();
      }
    },
    [show],
  );

  const value = useMemo(() => ({ show, withLoading }), [show, withLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay visible={visible} title={displayOp?.title ?? ''} message={displayOp?.message} />
    </LoadingContext.Provider>
  );
}
