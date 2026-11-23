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
import { usePlansCatalogList } from '@/features/plansCatalog/hooks/usePlansCatalogData';
import {
  useChangeSubscriptionPlan,
  useExtendSubscriptionDays,
  useSubscriptionHistory,
  useSubscriptionsList,
} from './hooks/useSubscriptionsData';

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString('es-VE') : 'Sin vencimiento';
}

const STATUS_FILTERS = [
  { value: 'active', label: 'Activas' },
  { value: 'expired', label: 'Vencidas' },
  { value: 'inactive', label: 'Reemplazadas' },
  { value: 'all', label: 'Todas' },
];

const STATUS_VARIANT = { active: 'default', expired: 'destructive', inactive: 'secondary' };

function HistoryList({ companyId }) {
  const { data = [], isLoading } = useSubscriptionHistory(companyId);
  if (isLoading) return <p className="text-xs text-muted-foreground">Cargando historial...</p>;
  if (data.length === 0) return <p className="text-xs text-muted-foreground">Sin historial.</p>;
  return (
    <ul className="max-h-40 space-y-1 overflow-y-auto text-xs">
      {data.map((item) => (
        <li key={item.id} className="flex justify-between gap-2 border-b py-1 last:border-b-0">
          <span>
            {item.plan_name} · {formatDate(item.current_period_start)} → {formatDate(item.current_period_end)}
          </span>
          <span className="text-muted-foreground">
            {item.payment_reference ? `ref. ${item.payment_reference} · ` : ''}
            {item.is_active ? 'actual' : item.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function SubscriptionsPage() {
  const [selected, setSelected] = useState(null);
  const [nextPlan, setNextPlan] = useState('');
  const [extendDays, setExtendDays] = useState('');
  const [reason, setReason] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('active');

  const { data, isLoading, isError } = useSubscriptionsList({
    page,
    limit: 10,
    ...(status !== 'all' && { status }),
  });
  const { data: plansData } = usePlansCatalogList({ is_active: true });
  const { mutateAsync: changePlan, isPending: isChangingPlan } = useChangeSubscriptionPlan();
  const { mutateAsync: extendDaysMutation, isPending: isExtendingDays } = useExtendSubscriptionDays();

  const rows = data?.items || [];
  const totalPages = data?.total_pages || 1;
  const plans = plansData?.items || [];
  const nextPlanInfo = plans.find((p) => p.code === nextPlan);
  const isPlanChange = !!selected && !!nextPlan && nextPlan !== selected.plan_code;
  const days = parseInt(extendDays, 10);
  const isExtension = days > 0;

  const openManage = (row) => {
    setSelected(row);
    setNextPlan(row.plan_code);
    setExtendDays('');
    setReason('');
  };

  const requestConfirm = () => {
    if (!isPlanChange && !isExtension) {
      toast.error('No hay cambios para aplicar');
      return;
    }
    if (reason.trim().length < 3) {
      toast.error('Indica el motivo del cambio');
      return;
    }
    setConfirmOpen(true);
  };

  const applyChanges = async () => {
    try {
      // Plan first: the extension applies to the new paid period.
      if (isPlanChange) {
        await changePlan({ companyId: selected.company_id, data: { plan_code: nextPlan, reason: reason.trim() } });
      }
      if (isExtension) {
        await extendDaysMutation({ companyId: selected.company_id, data: { days, reason: reason.trim() } });
      }
      setConfirmOpen(false);
      setSelected(null);
    } catch {
      // The mutation hooks already show the error toast.
      setConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Subscriptions</h1>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.company_name}</TableCell>
                      <TableCell>{row.plan_name}</TableCell>
                      <TableCell>{formatDate(row.activation_date)}</TableCell>
                      <TableCell>{formatDate(row.expiration_date)}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[row.status] ?? 'secondary'}>{row.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" disabled={!row.is_active} onClick={() => openManage(row)}>
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
              Cambiar plan o extender días de forma manual. Para pagos reportados usa la cola de Pagos.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">{selected.company_name}</p>
                <p className="text-muted-foreground">
                  Vigente: {selected.plan_name} (vence {formatDate(selected.expiration_date)})
                </p>
              </div>
              <div className="space-y-2">
                <Label>Nuevo Plan</Label>
                <Select value={nextPlan} onValueChange={setNextPlan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.code} value={plan.code}>
                        {plan.name_es || plan.name} (${plan.price})
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
                <p className="text-xs text-muted-foreground">Solo aplica a planes pagos; Gratis no vence.</p>
              </div>
              <div className="space-y-2">
                <Label>Motivo</Label>
                <Input
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Ej: cortesia por falla del servicio"
                />
              </div>
              <div className="space-y-2">
                <Label>Historial</Label>
                <HistoryList companyId={selected.company_id} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancelar
            </Button>
            <Button onClick={requestConfirm}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar actualizacion</AlertDialogTitle>
            <AlertDialogDescription>
              {isPlanChange ? `Cambio de plan a ${nextPlanInfo?.name_es || nextPlan} (inicia un periodo nuevo hoy)` : ''}
              {isPlanChange && isExtension ? ' + ' : ''}
              {isExtension ? `extension de ${days} dias` : ''}.
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
