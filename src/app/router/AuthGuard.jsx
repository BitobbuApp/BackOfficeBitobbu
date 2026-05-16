import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

export default function AuthGuard({ children }) {
  const { isAuthenticated, isLoadingSession } = useAuth();
  const location = useLocation();

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Verificando sesion...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
