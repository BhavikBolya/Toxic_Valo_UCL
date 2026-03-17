import React from 'react'
import ReactDOM from 'react-dom/client'
import './storage' // Install window.storage polyfill BEFORE app loads
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
