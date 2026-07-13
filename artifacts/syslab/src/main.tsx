import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';
import { setupAuth } from './lib/auth';
import App from './App';
import './index.css';

// In production, VITE_API_URL points to the deployed API server.
// In development the proxy handles /api, so no base URL is needed.
const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) setBaseUrl(apiUrl);

setupAuth();

createRoot(document.getElementById('root')!).render(<App />);
