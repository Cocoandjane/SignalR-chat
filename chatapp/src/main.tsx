import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { RoomProvider } from './context/RoomContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RoomProvider>
    <App />
    </RoomProvider>
  </React.StrictMode>,
)
