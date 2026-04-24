import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from './AuthContext';

function resolveErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'No se pudo iniciar sesion. Verifica tus credenciales.'
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login(form);
      toast.success('Sesion iniciada');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Error de autenticacion', {
        description: resolveErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">Bitobbu Admin Login</CardTitle>
          <CardDescription>
            Acceso restringido para el equipo administrativo interno.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@bitobbu.com"
                required
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar password' : 'Mostrar password'}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesion'}
            </Button>
          </form>
          <div className="mt-4 rounded-md border bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Mock credentials</p>
            <p>Email: admin@bitobbu.com</p>
            <p>Password: Admin123!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
