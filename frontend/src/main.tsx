// React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Router
import { BrowserRouter } from 'react-router-dom';

// Tailwind
import './index.css'

// Components
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
