import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogFooter,
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

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-VE');
}

import {
  useChangeSubscriptionPlan,
  useExtendSubscriptionDays,
  useSubscriptionsList,
} from './hooks/useSubscriptionsData';

const mockPlans = ['starter', 'growth', 'enterprise'];

export default function SubscriptionsPage() {
  const [selected, setSelected] = useState(null);
  const [nextPlan, setNextPlan] = useState('');
  const [extendDays, setExtendDays] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useSubscriptionsList({ page, limit: 10 });
  const { mutate: changePlan, isPending: isChangingPlan } = useChangeSubscriptionPlan();
  const { mutate: extendDaysMutation, isPending: isExtendingDays } = useExtendSubscriptionDays();

  const rows = data?.items || [];
  const totalPages = data?.total_pages || 1;

  const openManage = (row) => {
    setSelected(row);
    setNextPlan(row.plan_tier.toLowerCase()); // assuming tier comes Capitalized or we just use lower case code
    setExtendDays('');
  };

  const applyChanges = () => {
    if (!selected) return;

    const isPlanChange = nextPlan && nextPlan !== selected.plan_tier.toLowerCase();
    const isExtension = extendDays && parseInt(extendDays, 10) > 0;

    if (isPlanChange) {
      changePlan({
        companyId: selected.company_id,
        data: { plan_code: nextPlan, reason: 'Cambio administrativo manual' },
      }, {
        onSuccess: () => {
          if (!isExtension) {
            setConfirmOpen(false);
            setSelected(null);
          }
        }
      });
    }

    if (isExtension) {
      extendDaysMutation({
        companyId: selected.company_id,
        data: { days: parseInt(extendDays, 10), reason: 'Extensión manual' },
      }, {
        onSuccess: () => {
          setConfirmOpen(false);
          setSelected(null);
        }
      });
    }

    if (!isPlanChange && !isExtension) {
      toast.error('No hay cambios para aplicar');
      setConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Subscriptions</h1>

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar las suscripciones.
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Activation</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Cargando suscripciones...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No hay suscripciones registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.company_id}>
                      <TableCell className="font-medium">{row.company_name}</TableCell>
                      <TableCell>{row.plan_tier}</TableCell>
                      <TableCell>{formatDate(row.activation_date)}</TableCell>
                      <TableCell>{formatDate(row.expiration_date)}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === 'active' ? 'default' : 'destructive'}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" onClick={() => openManage(row)}>
                          Manage Plan
                        </Button>
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              Cambiar plan o extender días de forma manual.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">{selected.company_name}</p>
                <p className="text-muted-foreground">
                  Vigente: {selected.plan_tier} (vence {formatDate(selected.expiration_date)})
                </p>
              </div>
              <div className="space-y-2">
                <Label>Nuevo Plan</Label>
                <Select value={nextPlan} onValueChange={setNextPlan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlans.map((plan) => (
                      <SelectItem key={plan} value={plan} className="capitalize">
                        {plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Extension Manual (dias)</Label>
                <Input
                  type="number"
                  min="0"
                  value={extendDays}
                  onChange={(event) => setExtendDays(event.target.value)}
                  placeholder="Ej: 15"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancelar
            </Button>
            <Button onClick={() => setConfirmOpen(true)}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar actualizacion</AlertDialogTitle>
            <AlertDialogDescription>
              Se aplicara cambio de plan a {nextPlan}
              {extendDays ? ` + extension de ${extendDays} dias` : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isChangingPlan || isExtendingDays}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={applyChanges} disabled={isChangingPlan || isExtendingDays}>
              {isChangingPlan || isExtendingDays ? 'Guardando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
