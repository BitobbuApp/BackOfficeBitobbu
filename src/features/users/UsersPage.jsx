import { useState } from 'react';
import { MoreHorizontal, Search, UserRound } from 'lucide-react';
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
import { useUpdateUserStatus, useUserDetail, useUsersList } from './hooks/useUsersData';

const PAGE_SIZE = 10;

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-VE');
}

function statusBadge(status) {
  return status === 'active' ? 'default' : 'destructive';
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [profileFilter, setProfileFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const queryParams = {
    page,
    limit: PAGE_SIZE,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(profileFilter !== 'all' && { profile_type: profileFilter }),
  };

  const { data: usersData, isLoading, isError } = useUsersList(queryParams);
  const { data: userDetail, isLoading: isLoadingDetail } = useUserDetail(selectedUserId);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();

  const users = usersData?.items || [];
  const totalPages = usersData?.total_pages || 1;
  const totalCount = usersData?.total || 0;

  const toggleStatus = () => {
    if (!statusTarget) return;
    const nextStatus = statusTarget.status === 'active' ? 'suspended' : 'active';
    updateStatus(
      { id: statusTarget.id, data: { status: nextStatus, reason: 'Cambio administrativo manual' } },
      {
        onSettled: () => setStatusTarget(null),
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Users</h1>
        <Badge variant="secondary">{totalCount} resultados</Badge>
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

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar usuarios.
        </div>
      ) : (
        <>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Cargando usuarios...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
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
                            <DropdownMenuItem onClick={() => setSelectedUserId(user.id)}>
                              Ver perfil completo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusTarget(user)}>
                              {user.status === 'active' ? 'Suspender cuenta' : 'Reactivar cuenta'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              Perfil de Empresa
            </DialogTitle>
            <DialogDescription>Detalle completo de registro.</DialogDescription>
          </DialogHeader>
          {isLoadingDetail ? (
            <div className="py-4 text-center text-sm text-muted-foreground">Cargando perfil...</div>
          ) : userDetail ? (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Company:</span> {userDetail.company_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {userDetail.email}
              </p>
              <p>
                <span className="font-semibold">Contacts:</span>{' '}
                {userDetail.contacts?.join(', ') || '-'}
              </p>
              <p>
                <span className="font-semibold">Locations:</span>{' '}
                {userDetail.locations?.join(', ') || '-'}
              </p>
              <p>
                <span className="font-semibold">Payment Preferences:</span>{' '}
                {userDetail.payment_preferences?.join(', ') || '-'}
              </p>
            </div>
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">No se pudo cargar el perfil.</div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!statusTarget} onOpenChange={(open) => !open && setStatusTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cambiar el estado de este usuario?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatingStatus}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={toggleStatus} disabled={isUpdatingStatus}>
              {isUpdatingStatus ? 'Guardando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
