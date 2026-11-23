import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <HeaderBar />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
