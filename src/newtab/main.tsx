import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initPersistence } from '../persistence/persistence'
import { NewTab } from './NewTab'
import '../index.css'

void initPersistence()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NewTab />
  </StrictMode>,
)
