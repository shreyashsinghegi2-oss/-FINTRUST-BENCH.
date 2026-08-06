import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { auth } from './lib/firebase.ts';
import './index.css';

const nativeFetch = window.fetch.bind(window);

// Every first-party API request carries the active Firebase ID token. This keeps
// API authentication centralized, including calls made by comparison and report flows.
window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const requestUrl =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const isFirstPartyApi =
    requestUrl.startsWith('/api/') || requestUrl.startsWith(`${window.location.origin}/api/`);

  if (!isFirstPartyApi) {
    return nativeFetch(input, init);
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    return new Response(
      JSON.stringify({ error: 'Authentication is required. Please sign in again.' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const idToken = await currentUser.getIdToken();
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  headers.set('Authorization', `Bearer ${idToken}`);

  return nativeFetch(input, {
    ...init,
    headers,
  });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
