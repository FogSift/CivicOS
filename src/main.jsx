/**
 * @fileId d8e65057-f6c6-4ace-82d0-50c7d3d43836
 * @module CivicOS/main
 * @description React root — mounts <App /> into #root.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
