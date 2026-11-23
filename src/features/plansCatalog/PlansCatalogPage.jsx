import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useCreatePlan,
  usePlansCatalogList,
  useUpdatePlan,
  useUpdatePlanStatus,
} from './hooks/usePlansCatalogData';

function emptyForm() {
  return {
    code: '',
    name: '',
    name_es: '',
    price: '',
    billing_cycle: '30',
    max_quotes_per_month: '',
    max_active_offers: '',
    sort_order: '0',
    is_default: false,
  };
}

// Empty input = unlimited (null).
const toLimit = (value) => (value === '' || value === null || value === undefined ? null : Number(value));
const fromLimit = (value) => (value === null || value === undefined ? '' : String(value));
const formatLimit = (value) => (value === null || value === undefined ? 'Ilimitado' : value);

export default function PlansCatalogPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const { data, isLoading, isError } = usePlansCatalogList({});
  const { mutate: createPlan, isPending: isCreating } = useCreatePlan();
  const { mutate: updatePlan, isPending: isUpdating } = useUpdatePlan();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdatePlanStatus();

  const plans = data?.items || [];

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || Number(a.price) - Number(b.price)),
    [plans]
  );

  const setField = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyForm());
    setIsEditorOpen(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      code: plan.code,
      name: plan.name,
      name_es: plan.name_es ?? '',
      price: String(plan.price),
      billing_cycle: String(plan.billing_cycle ?? 30),
      max_quotes_per_month: fromLimit(plan.max_quotes_per_month),
      max_active_offers: fromLimit(plan.max_active_offers),
      sort_order: String(plan.sort_order ?? 0),
      is_default: !!plan.is_default,
    });
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingPlan(null);
    setForm(emptyForm());
  };

  const savePlan = () => {
    if (!form.name.trim()) {
      toast.error('El nombre del plan es obligatorio');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(form.code.trim())) {
      toast.error('El codigo solo admite minusculas, numeros y guion bajo');
      return;
    }

    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      name_es: form.name_es.trim(),
      price: Number(form.price || 0),
      billing_cycle: Number(form.billing_cycle || 30),
      max_quotes_per_month: toLimit(form.max_quotes_per_month),
      max_active_offers: toLimit(form.max_active_offers),
      sort_order: Number(form.sort_order || 0),
    };
    // The backend refuses to unset the default plan directly; only send it when turning it on.
    if (form.is_default && !editingPlan?.is_default) payload.is_default = true;

    if (editingPlan) {
      updatePlan({ id: editingPlan.id, data: payload }, { onSuccess: closeEditor });
    } else {
      createPlan(payload, { onSuccess: closeEditor });
    }
  };

  const toggleStatus = () => {
    if (!deactivateTarget) return;
    updateStatus(
      { id: deactivateTarget.id, data: { status: !deactivateTarget.is_active, reason: 'Cambio de estado manual' } },
      { onSuccess: () => setDeactivateTarget(null) }
    );
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Plans Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Planes de suscripcion y sus limites mensuales. Un limite vacio significa ilimitado.
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Plan
        </Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar planes.
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Precio (USD)</TableHead>
                <TableHead>Ciclo (Días)</TableHead>
                <TableHead>Cotizaciones / mes</TableHead>
                <TableHead>Ofertas activas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Cargando planes...
                  </TableCell>
                </TableRow>
              ) : sortedPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No hay planes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                sortedPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{plan.name_es || plan.name}</span>
                        {plan.is_default && <Badge variant="secondary">Por defecto</Badge>}
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{plan.code}</span>
                    </TableCell>
                    <TableCell>${plan.price}</TableCell>
                    <TableCell>{plan.billing_cycle}</TableCell>
                    <TableCell>{formatLimit(plan.max_quotes_per_month)}</TableCell>
                    <TableCell>{formatLimit(plan.max_active_offers)}</TableCell>
                    <TableCell>
                      <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                        {plan.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(plan)}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={plan.is_active ? 'destructive' : 'secondary'}
                          disabled={plan.is_default}
                          onClick={() => setDeactivateTarget(plan)}
                        >
                          {plan.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isEditorOpen} onOpenChange={(open) => (open ? setIsEditorOpen(true) : closeEditor())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Editar Plan' : 'Crear Plan'}</DialogTitle>
            <DialogDescription>
              Los limites aplican de inmediato a todas las empresas en este plan.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Codigo</Label>
                <Input value={form.code} onChange={setField('code')} placeholder="starter" disabled={isSaving} />
              </div>
              <div className="space-y-1">
                <Label>Orden</Label>
                <Input type="number" min="0" value={form.sort_order} onChange={setField('sort_order')} disabled={isSaving} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input value={form.name} onChange={setField('name')} placeholder="Starter" disabled={isSaving} />
              </div>
              <div className="space-y-1">
                <Label>Nombre visible (ES)</Label>
                <Input value={form.name_es} onChange={setField('name_es')} placeholder="Starter" disabled={isSaving} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Precio USD</Label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={setField('price')} disabled={isSaving} />
              </div>
              <div className="space-y-1">
                <Label>Ciclo de Facturación (Días)</Label>
                <Input type="number" min="1" value={form.billing_cycle} onChange={setField('billing_cycle')} disabled={isSaving} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Cotizaciones por mes</Label>
                <Input type="number" min="0" placeholder="Ilimitado" value={form.max_quotes_per_month} onChange={setField('max_quotes_per_month')} disabled={isSaving} />
              </div>
              <div className="space-y-1">
                <Label>Ofertas activas</Label>
                <Input type="number" min="0" placeholder="Ilimitado" value={form.max_active_offers} onChange={setField('max_active_offers')} disabled={isSaving} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Plan por defecto</Label>
                <p className="text-xs text-muted-foreground">Las empresas nuevas empiezan en este plan.</p>
              </div>
              <Switch
                checked={form.is_default}
                disabled={isSaving || editingPlan?.is_default}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_default: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditor} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={savePlan} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cambiar el estado de este plan?
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
