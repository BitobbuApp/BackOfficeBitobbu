import { Outlet, Link } from "react-router-dom"

export default function MainLayout() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <aside className="w-64 border-r bg-white flex flex-col p-4 space-y-4">
        <div className="text-xl font-bold mb-4">Bitobbu Admin</div>
        <nav className="flex flex-col space-y-2 text-sm font-medium">
          <Link to="/" className="px-4 py-2 hover:bg-slate-100 rounded-md">Dashboard</Link>
          <Link to="/usuarios" className="px-4 py-2 hover:bg-slate-100 rounded-md">Usuarios</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
