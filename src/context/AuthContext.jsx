import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const SESSION_KEY = 'repairlens.auth.session';
const AuthContext = createContext(null);

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function readSessionState() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(SESSION_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.warn('Unable to read auth session:', error);
    return null;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const existing = readSessionState();

    if (existing && existing.user) {
      return {
        status: 'logged_in',
        user: existing.user,
        error: null,
        isMockAuth: false,
      };
    }

    return {
      status: 'logged_out',
      user: null,
      error: null,
      isMockAuth: false,
    };
  });

  const persistSession = useCallback((nextState) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (nextState && nextState.status === 'logged_in' && nextState.user) {
      window.sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ user: nextState.user })
      );
      return;
    }

    window.sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const hydrateSession = useCallback(async () => {
    try {
      const payload = await fetchJson(`${apiBaseUrl}/api/auth/me`);
      const user = payload.user || null;

      if (!user) {
        setAuthState({ status: 'logged_out', user: null, error: null, isMockAuth: false });
        persistSession(null);
        return;
      }

      const nextState = { status: 'logged_in', user, error: null, isMockAuth: false };
      setAuthState(nextState);
      persistSession(nextState);
    } catch (error) {
      setAuthState({ status: 'logged_out', user: null, error: null, isMockAuth: false });
      persistSession(null);
    }
  }, [persistSession]);

  const login = async ({ email, password }) => {
    const normalizedEmail = String(email || '').trim();
    const normalizedPassword = String(password || '');

    if (!normalizedEmail || !normalizedPassword) {
      const nextState = {
        status: 'login_error',
        user: null,
        error: 'Please enter your email address and password.',
        isMockAuth: false,
      };
      setAuthState(nextState);
      return { ok: false, error: nextState.error };
    }

    setAuthState({
      status: 'logging_in',
      user: null,
      error: null,
      isMockAuth: false,
    });

    try {
      const payload = await fetchJson(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });

      const user = payload.user || null;
      const nextState = {
        status: user ? 'logged_in' : 'login_error',
        user,
        error: user ? null : payload.message || 'Unable to sign in.',
        isMockAuth: false,
      };

      setAuthState(nextState);
      persistSession(nextState);
      return { ok: Boolean(user), user, error: nextState.error };
    } catch (error) {
      const nextState = {
        status: 'login_error',
        user: null,
        error: error.message || 'Unable to sign in. Please try again.',
        isMockAuth: false,
      };
      setAuthState(nextState);
      return { ok: false, error: nextState.error };
    }
  };

  const register = async ({ fullName, email, password, confirmPassword }) => {
    const name = String(fullName || '').trim();
    const normalizedEmail = String(email || '').trim();
    const normalizedPassword = String(password || '');
    const normalizedConfirmPassword = String(confirmPassword || '');

    if (!name || !normalizedEmail || !normalizedPassword || !normalizedConfirmPassword) {
      const nextState = {
        status: 'registration_error',
        user: null,
        error: 'Please complete all required fields.',
        isMockAuth: false,
      };
      setAuthState(nextState);
      return { ok: false, error: nextState.error };
    }

    setAuthState({
      status: 'registering',
      user: null,
      error: null,
      isMockAuth: false,
    });

    try {
      const payload = await fetchJson(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          email: normalizedEmail,
          password: normalizedPassword,
          confirmPassword: normalizedConfirmPassword,
        }),
      });

      const user = payload.user || null;
      const nextState = {
        status: user ? 'logged_in' : 'registration_error',
        user,
        error: user ? null : payload.message || 'Unable to create your account.',
        isMockAuth: false,
      };

      setAuthState(nextState);
      persistSession(nextState);
      return { ok: Boolean(user), user, error: nextState.error };
    } catch (error) {
      const nextState = {
        status: 'registration_error',
        user: null,
        error: error.message || 'Unable to create your account right now.',
        isMockAuth: false,
      };
      setAuthState(nextState);
      return { ok: false, error: nextState.error };
    }
  };

  const logout = async () => {
    try {
      await fetchJson(`${apiBaseUrl}/api/auth/logout`, { method: 'POST' });
    } catch (error) {
      console.warn('Logout request failed:', error.message);
    }

    const nextState = {
      status: 'logged_out',
      user: null,
      error: null,
      isMockAuth: false,
    };

    setAuthState(nextState);
    persistSession(null);
    return { ok: true };
  };

  React.useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  const value = useMemo(
    () => ({
      ...authState,
      isAuthenticated: authState.status === 'logged_in',
      isLoggingIn: authState.status === 'logging_in',
      isRegistering: authState.status === 'registering',
      login,
      register,
      logout,
      authMode: 'real-backend',
      isMockAuth: false,
      hydrateSession,
    }),
    [authState, hydrateSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
