import {
  BarChart3,
  ClipboardList,
  CheckCircle2,
  CreditCard,
  FileText,
  FolderCog,
  Globe2,
  LogOut,
  Package,
  ReceiptText,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { MAIN_PAGES } from '@/pages.config';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LOOKUP_TABLES } from '@/features/lookups/lookupsTableRegistry';

const iconByPath = {
  '/': BarChart3,
  '/users': Users,
  '/verifications': CheckCircle2,
  '/subscriptions': CreditCard,
  '/plans-catalog': Package,
  '/rfqs': ClipboardList,
  '/quote-responses': FileText,
  '/transactions': ReceiptText,
  '/geography': Globe2,
};

export default function Sidebar() {
  const { admin, logout } = useAuth();
  const mainNavItems = MAIN_PAGES.filter(
    (item) => item.showInSidebar && item.sidebarGroup !== 'config'
  );

  return (
    <aside className="w-full border-b bg-card p-4 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-5">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Bitobbu
        </p>
        <h1 className="text-xl font-bold text-foreground">BackOffice Admin</h1>
      </div>

      <nav className="space-y-1">
        {mainNavItems.map((item) => {
          const Icon = iconByPath[item.path] || BarChart3;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          );
        })}
        <div className="pt-2">
          <div className="mb-1 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <FolderCog className="h-3.5 w-3.5" />
            Configuracion
          </div>
          <NavLink
            to="/config/lookups"
            end
            className={({ isActive }) =>
              cn(
                'ml-2 flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            Resumen de tablas
          </NavLink>
          {LOOKUP_TABLES.map((table) => (
            <NavLink
              key={table.key}
              to={`/config/lookups/${table.key}`}
              className={({ isActive }) =>
                cn(
                  'ml-2 flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {table.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mt-6 rounded-lg border bg-background p-3">
        <p className="truncate text-sm font-medium text-foreground">
          {admin?.full_name || 'Administrador'}
        </p>
        <p className="truncate text-xs text-muted-foreground">{admin?.email}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full justify-start"
        onClick={logout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesion
      </Button>
    </aside>
  );
}
