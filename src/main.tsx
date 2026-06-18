import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConcreteProvider } from './context/ConcreteContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConcreteProvider>
      <App />
    </ConcreteProvider>
  </StrictMode>,
)

