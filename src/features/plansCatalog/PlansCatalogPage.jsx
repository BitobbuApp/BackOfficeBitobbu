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
    price: '',
    billing_cycle: '30',
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
      price: String(plan.price),
      billing_cycle: String(plan.billing_cycle),
    });
    setIsEditorOpen(true);
  };

  const savePlan = () => {
    if (!form.name.trim()) {
      toast.error('El nombre del plan es obligatorio');
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price || 0),
      billing_cycle: Number(form.billing_cycle || 30),
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
    const nextStatus = !deactivateTarget.is_active;

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
                <TableHead>Precio (USD)</TableHead>
                <TableHead>Ciclo (Días)</TableHead>
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
                    <TableCell>${plan.price}</TableCell>
                    <TableCell>{plan.billing_cycle}</TableCell>
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Precio USD</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      price: event.target.value,
                    }))
                  }
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-1">
                <Label>Ciclo de Facturación (Días)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.billing_cycle}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, billing_cycle: event.target.value }))
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
