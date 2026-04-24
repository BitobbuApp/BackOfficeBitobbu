import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { mockPlanCatalog } from '@/mocks/backofficeMockData';
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

export default function PlansCatalogPage() {
  const [plans, setPlans] = useState(mockPlanCatalog);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [deactivateTarget, setDeactivateTarget] = useState(null);

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
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlan.id ? { ...plan, ...payload } : plan
        )
      );
      toast.success('Plan actualizado (mock)');
    } else {
      setPlans((prev) => [
        ...prev,
        { id: `plan-${Date.now()}`, status: 'active', ...payload },
      ]);
      toast.success('Plan creado (mock)');
    }

    setIsEditorOpen(false);
    setEditingPlan(null);
    setForm(emptyForm());
  };

  const toggleStatus = () => {
    if (!deactivateTarget) return;
    const nextStatus = deactivateTarget.status === 'active' ? 'inactive' : 'active';
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === deactivateTarget.id ? { ...plan, status: nextStatus } : plan
      )
    );
    toast.success(
      nextStatus === 'inactive' ? 'Plan desactivado (mock)' : 'Plan activado (mock)'
    );
    setDeactivateTarget(null);
  };

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
            {sortedPlans.map((plan) => (
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
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Editar Plan' : 'Crear Plan'}</DialogTitle>
            <DialogDescription>Formulario mock para validar UI.</DialogDescription>
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
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={savePlan}>Guardar</Button>
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
              Esta accion es mock y solo actualiza el estado visual del plan.
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
