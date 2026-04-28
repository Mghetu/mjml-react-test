// src/App.tsx
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Editor from './editor/Editor';
import './App.css';

type AuthState = 'checking' | 'authenticated' | 'unauthenticated';

const authRequest = async (url: string, options: RequestInit = {}) =>
  fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await authRequest('/api/auth/session', {
          method: 'GET',
        });
        setAuthState(response.ok ? 'authenticated' : 'unauthenticated');
      } catch {
        setAuthState('unauthenticated');
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim()) {
      setAuthError('Please enter the access password.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);
    try {
      const response = await authRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setAuthError(payload?.error || 'Login failed. Please try again.');
        setAuthState('unauthenticated');
        return;
      }

      setPassword('');
      setAuthState('authenticated');
    } catch {
      setAuthError('Unable to reach authentication service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await authRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // No-op: we still clear local auth state.
    } finally {
      setAuthState('unauthenticated');
      setIsSubmitting(false);
    }
  };

  const loginButtonLabel = useMemo(() => (isSubmitting ? 'Signing in...' : 'Sign in'), [isSubmitting]);

  if (authState === 'checking') {
    return (
      <main className="auth-screen">
        <section className="auth-card">
          <h1>Checking session</h1>
          <p>Validating access...</p>
        </section>
      </main>
    );
  }

  if (authState !== 'authenticated') {
    return (
      <main className="auth-screen">
        <section className="auth-card">
          <h1>MJML Editor Access</h1>
          <p>Enter the shared password to continue.</p>
          <form className="auth-form" onSubmit={handleLogin}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            {authError ? <div className="auth-error">{authError}</div> : null}
            <button type="submit" disabled={isSubmitting}>
              {loginButtonLabel}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <button className="logout-button" type="button" onClick={handleLogout} disabled={isSubmitting}>
        Log out
      </button>
      <Editor />
    </div>
  );
}
