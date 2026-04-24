import { useMemo, useState } from 'react';
import { MoreHorizontal, Search, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { mockUsers } from '@/mocks/backofficeMockData';
import { useDebounce } from '@/hooks/use-debounce';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PAGE_SIZE = 5;

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-VE');
}

function statusBadge(status) {
  return status === 'active' ? 'default' : 'destructive';
}

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileFilter, setProfileFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 250);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchFilter = profileFilter === 'all' || user.profile_type === profileFilter;
      const search = debouncedSearch.trim().toLowerCase();
      const matchSearch =
        !search ||
        user.company_name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.trade_name.toLowerCase().includes(search);
      return matchFilter && matchSearch;
    });
  }, [users, profileFilter, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginated = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleStatus = () => {
    if (!statusTarget) return;
    const nextStatus = statusTarget.status === 'active' ? 'suspended' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === statusTarget.id ? { ...u, status: nextStatus } : u))
    );
    toast.success(
      nextStatus === 'active' ? 'Cuenta reactivada (mock)' : 'Cuenta suspendida (mock)'
    );
    setStatusTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Users</h1>
        <Badge variant="secondary">{filteredUsers.length} resultados</Badge>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre o email..."
            className="pl-9"
          />
        </div>
        <Select
          value={profileFilter}
          onValueChange={(value) => {
            setProfileFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Tipo de cuenta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="buyer">Buyer</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company / Trade Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p className="font-medium">{user.company_name}</p>
                  <p className="text-xs text-muted-foreground">{user.trade_name}</p>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="uppercase">{user.profile_type}</TableCell>
                <TableCell>{formatDate(user.registration_date)}</TableCell>
                <TableCell>
                  <Badge variant={statusBadge(user.status)}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                        Ver perfil completo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusTarget(user)}>
                        {user.status === 'active' ? 'Suspender cuenta' : 'Reactivar cuenta'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Pagina {page} de {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              Perfil de Empresa
            </DialogTitle>
            <DialogDescription>Detalle completo de registro (mock data).</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Company:</span> {selectedUser.company_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {selectedUser.email}
              </p>
              <p>
                <span className="font-semibold">Contacts:</span>{' '}
                {selectedUser.contacts.join(', ')}
              </p>
              <p>
                <span className="font-semibold">Locations:</span>{' '}
                {selectedUser.locations.join(', ')}
              </p>
              <p>
                <span className="font-semibold">Payment Preferences:</span>{' '}
                {selectedUser.payment_preferences.join(', ')}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!statusTarget} onOpenChange={(open) => !open && setStatusTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion es simulada en frontend y no llama endpoints.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={toggleStatus}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
