// src/editor/components/useLoading.ts
import { createContext, useContext } from 'react';

export type LoadingContextValue = {
  show: (title: string, message?: string) => () => void;
  withLoading: <T>(promise: Promise<T>, title: string, message?: string) => Promise<T>;
};

export const LoadingContext = createContext<LoadingContextValue | null>(null);

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return ctx;
}
