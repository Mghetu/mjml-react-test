// src/main.tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const baseTitle = 'MJML Newsletter Editor';
const isLocalDevHost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
document.title = isLocalDevHost ? `dev-${baseTitle}` : baseTitle;

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
