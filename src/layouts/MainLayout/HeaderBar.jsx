import { useAuth } from '@/features/auth/AuthContext';

export default function HeaderBar() {
  const { admin } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      <div>
        <h2 className="text-sm font-medium text-muted-foreground">
          Panel Administrativo
        </h2>
        <p className="text-base font-semibold text-foreground">
          Bitobbu Internal Operations
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-foreground">
          {admin?.full_name || 'Administrador'}
        </p>
        <p className="text-xs text-muted-foreground">{admin?.email}</p>
      </div>
    </header>
  );
}
