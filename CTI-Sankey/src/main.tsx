import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../cti-sankey/src/index.css'
import App from '../cti-sankey/src/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
