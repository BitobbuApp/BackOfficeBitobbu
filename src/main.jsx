import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './pages/Dashboard'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center text-slate-800 w-full">
        <Dashboard />
      </div>
    </QueryClientProvider>
  </React.StrictMode>,
)
