import { IconContext } from '@phosphor-icons/react';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IconContext.Provider value={{ size: 24 }}>
      <App />
    </IconContext.Provider>
  </React.StrictMode>,
)
