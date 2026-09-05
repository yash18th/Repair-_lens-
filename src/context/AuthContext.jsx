import React, { createContext, useContext, useMemo, useState } from 'react';

const SESSION_KEY = 'repairlens.mock.auth.session';
const MOCK_AUTH_MODE = 'mock-frontend-only';

const AuthContext = createContext(null);

function readSessionState() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(SESSION_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.warn('Unable to read mock auth session:', error);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const existing = readSessionState();

    if (existing && existing.user) {
      return {
        status: 'logged_in',
        user: existing.user,
        error: null,
        isMockAuth: true,
        mode: MOCK_AUTH_MODE,
      };
    }

    return {
      status: 'logged_out',
      user: null,
      error: null,
      isMockAuth: true,
      mode: MOCK_AUTH_MODE,
    };
  });

  const persistSession = (nextState) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (nextState && nextState.status === 'logged_in' && nextState.user) {
      window.sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          user: nextState.user,
          mode: MOCK_AUTH_MODE,
          isMockAuth: true,
        })
      );
      return;
    }

    window.sessionStorage.removeItem(SESSION_KEY);
  };

  const login = async ({ email, password }) => {
    const normalizedEmail = String(email || '').trim();
    const normalizedPassword = String(password || '');

    if (!normalizedEmail || !normalizedPassword) {
      const nextState = {
        status: 'login_error',
        user: null,
        error: 'Please enter your email address and password.',
        isMockAuth: true,
        mode: MOCK_AUTH_MODE,
      };
      setAuthState(nextState);
      return { ok: false, error: nextState.error };
    }

    setAuthState({
      status: 'logging_in',
      user: null,
      error: null,
      isMockAuth: true,
      mode: MOCK_AUTH_MODE,
    });

    await new Promise((resolve) => setTimeout(resolve, 250));

    const user = {
      name: normalizedEmail.split('@')[0] || 'RepairLens User',
      email: normalizedEmail,
    };

    const nextState = {
      status: 'logged_in',
      user,
      error: null,
      isMockAuth: true,
      mode: MOCK_AUTH_MODE,
    };

    setAuthState(nextState);
    persistSession(nextState);

    return { ok: true, user };
  };

  const register = async ({ fullName, email, password }) => {
    const name = String(fullName || '').trim();
    const normalizedEmail = String(email || '').trim();
    const normalizedPassword = String(password || '');

    if (!name || !normalizedEmail || !normalizedPassword) {
      const nextState = {
        status: 'registration_error',
        user: null,
        error: 'Please complete all required fields.',
        isMockAuth: true,
        mode: MOCK_AUTH_MODE,
      };
      setAuthState(nextState);
      return { ok: false, error: nextState.error };
    }

    setAuthState({
      status: 'registering',
      user: null,
      error: null,
      isMockAuth: true,
      mode: MOCK_AUTH_MODE,
    });

    await new Promise((resolve) => setTimeout(resolve, 250));

    const user = {
      name,
      email: normalizedEmail,
    };

    const nextState = {
      status: 'logged_in',
      user,
      error: null,
      isMockAuth: true,
      mode: MOCK_AUTH_MODE,
    };

    setAuthState(nextState);
    persistSession(nextState);

    return { ok: true, user };
  };

  const logout = () => {
    const nextState = {
      status: 'logged_out',
      user: null,
      error: null,
      isMockAuth: true,
      mode: MOCK_AUTH_MODE,
    };

    setAuthState(nextState);
    persistSession(null);
    return { ok: true };
  };

  const value = useMemo(
    () => ({
      ...authState,
      isAuthenticated: authState.status === 'logged_in',
      isLoggingIn: authState.status === 'logging_in',
      isRegistering: authState.status === 'registering',
      login,
      register,
      logout,
      authMode: MOCK_AUTH_MODE,
      isMockAuth: true,
    }),
    [authState]
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
