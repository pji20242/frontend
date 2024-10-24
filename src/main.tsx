import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // Estilos globais
import App from './App.tsx';  // Componente principal

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
