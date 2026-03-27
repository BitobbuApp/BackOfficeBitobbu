import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center text-slate-800">
        <h1 className="text-4xl font-bold mb-4">Bitobbu Administrativo</h1>
        <p className="text-xl text-slate-500 max-w-2xl mb-8">
            El entorno de desarrollo para el panel superadministrador ha sido inicializado mediante Vite y React.<br/>
            Las tareas para el agente en la nube han sido generadas en <code>/tasks</code>.
        </p>
    </div>
  </React.StrictMode>,
)
