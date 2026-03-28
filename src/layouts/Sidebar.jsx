import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  MessageSquare,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Verifications', href: '/verifications', icon: ShieldCheck },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
];

export function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white shadow-xl">
      <div className="flex h-16 items-center justify-center border-b border-slate-700 bg-slate-900 px-6">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-100">
          Superadmin
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                )
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-700 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
          Logout
        </Button>
      </div>
    </div>
  );
}
