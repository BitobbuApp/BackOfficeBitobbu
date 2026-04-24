import {
  BarChart3,
  ClipboardList,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe2,
  ListTree,
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

const iconByPath = {
  '/': BarChart3,
  '/users': Users,
  '/verifications': CheckCircle2,
  '/subscriptions': CreditCard,
  '/plans-catalog': Package,
  '/lookups': ListTree,
  '/rfqs': ClipboardList,
  '/quote-responses': FileText,
  '/transactions': ReceiptText,
  '/geography': Globe2,
};

export default function Sidebar() {
  const { admin, logout } = useAuth();

  return (
    <aside className="w-full border-b bg-card p-4 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-5">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Bitobbu
        </p>
        <h1 className="text-xl font-bold text-foreground">BackOffice Admin</h1>
      </div>

      <nav className="space-y-1">
        {MAIN_PAGES.filter((item) => item.showInSidebar).map((item) => {
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
