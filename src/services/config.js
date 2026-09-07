const PRODUCTION_API_BASE_URL = 'https://repair-lens.onrender.com';

export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://localhost:4000';
  }

  return PRODUCTION_API_BASE_URL;
}
