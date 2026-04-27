import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

function emptyForm() {
  return {
    name: '',
    code: '',
    price_usd_monthly: '',
    trial_days: '',
    max_users: '',
  };
}

import {
  useCreatePlan,
  usePlansCatalogList,
  useUpdatePlan,
  useUpdatePlanStatus,
} from './hooks/usePlansCatalogData';

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
    () => [...plans].sort((a, b) => a.name.localeCompare(b.name)),
    [plans]
  );

  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyForm());
    setIsEditorOpen(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      code: plan.code,
      price_usd_monthly: String(plan.price_usd_monthly),
      trial_days: String(plan.trial_days),
      max_users: String(plan.max_users),
    });
    setIsEditorOpen(true);
  };

  const savePlan = () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error('Name y code son obligatorios');
      return;
    }

    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toLowerCase().replace(/\s+/g, '_'),
      price_usd_monthly: Number(form.price_usd_monthly || 0),
      trial_days: Number(form.trial_days || 0),
      max_users: Number(form.max_users || 0),
    };

    if (editingPlan) {
      updatePlan(
        { id: editingPlan.id, data: payload },
        {
          onSuccess: () => {
            setIsEditorOpen(false);
            setEditingPlan(null);
            setForm(emptyForm());
          },
        }
      );
    } else {
      createPlan(payload, {
        onSuccess: () => {
          setIsEditorOpen(false);
          setEditingPlan(null);
          setForm(emptyForm());
        },
      });
    }
  };

  const toggleStatus = () => {
    if (!deactivateTarget) return;
    const nextStatus = deactivateTarget.status === 'active' ? 'inactive' : 'active';

    updateStatus(
      { id: deactivateTarget.id, data: { status: nextStatus, reason: 'Cambio de estado manual' } },
      {
        onSuccess: () => {
          setDeactivateTarget(null);
        },
      }
    );
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Plans Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Crear, actualizar y desactivar planes de suscripcion.
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
                <TableHead>Code</TableHead>
                <TableHead>Precio (USD/mes)</TableHead>
                <TableHead>Trial</TableHead>
                <TableHead>Max Users</TableHead>
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
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.code}</TableCell>
                    <TableCell>${plan.price_usd_monthly}</TableCell>
                    <TableCell>{plan.trial_days} dias</TableCell>
                    <TableCell>{plan.max_users}</TableCell>
                    <TableCell>
                      <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(plan)}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={plan.status === 'active' ? 'destructive' : 'secondary'}
                          onClick={() => setDeactivateTarget(plan)}
                        >
                          {plan.status === 'active' ? 'Desactivar' : 'Activar'}
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

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Editar Plan' : 'Crear Plan'}</DialogTitle>
            <DialogDescription>Modificar la configuración del plan.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Growth Plus"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1">
              <Label>Code</Label>
              <Input
                value={form.code}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, code: event.target.value }))
                }
                placeholder="growth_plus"
                disabled={isSaving}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label>Precio USD/mes</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.price_usd_monthly}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      price_usd_monthly: event.target.value,
                    }))
                  }
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-1">
                <Label>Trial dias</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.trial_days}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, trial_days: event.target.value }))
                  }
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-1">
                <Label>Max users</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.max_users}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, max_users: event.target.value }))
                  }
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)} disabled={isSaving}>
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
