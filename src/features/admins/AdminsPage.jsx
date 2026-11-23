import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminsList, useCreateAdmin, useUpdateAdmin, useDeleteAdmin } from './hooks/useAdminsData';
import { useAuth } from '@/features/auth/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminsPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ops_admin');
  const [status, setStatus] = useState('active');
  const [showPassword, setShowPassword] = useState(false);
  const { admin: currentAdmin } = useAuth();

  const { data: admins = [], isLoading, isError } = useAdminsList();
  const { mutate: createAdmin, isPending: isCreating } = useCreateAdmin();
  const { mutate: updateAdmin, isPending: isUpdating } = useUpdateAdmin();
  const { mutate: deleteAdmin } = useDeleteAdmin();

  const openCreate = () => {
    setEditingAdmin(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('ops_admin');
    setStatus('active');
    setIsEditorOpen(true);
  };

  const openEdit = (admin) => {
    setEditingAdmin(admin);
    setFullName(admin.full_name);
    setEmail(admin.email);
    setPassword(''); // Reset password field
    setRole(admin.role);
    setStatus(admin.status);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    const payload = {
      full_name: fullName,
      email: email,
      role: role,
      status: status,
    };

    if (password) {
      payload.password = password;
    }

    if (editingAdmin) {
      updateAdmin({ id: editingAdmin.id, data: payload }, { onSuccess: () => setIsEditorOpen(false) });
    } else {
      createAdmin(payload, { onSuccess: () => setIsEditorOpen(false) });
    }
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este administrador?')) {
      deleteAdmin(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Gestión de Administradores</h1>
        <Button onClick={openCreate}>Nuevo Administrador</Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar administradores.
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">Cargando...</TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No hay administradores.</TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.full_name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{admin.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.status === 'active' ? 'default' : 'destructive'}>
                        {admin.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {admin.last_login_at ? new Date(admin.last_login_at).toLocaleString() : 'Nunca'}
                    </TableCell>
                    <TableCell className="text-right">
                      {admin.id !== currentAdmin?.id && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(admin)}>Editar</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(admin.id)}>Eliminar</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAdmin ? 'Editar Administrador' : 'Nuevo Administrador'}</DialogTitle>
            <DialogDescription>Completa los datos del administrador.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nombre Completo</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ej: Juan Pérez" />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@empresa.com" />
            </div>
            <div className="space-y-1">
              <Label>Contraseña {editingAdmin && '(Dejar en blanco para no cambiar)'}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Rol</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="ops_admin">Ops Admin</SelectItem>
                    <SelectItem value="catalog_admin">Catalog Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
