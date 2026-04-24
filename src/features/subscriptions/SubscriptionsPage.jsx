import { useState } from 'react';
import { toast } from 'sonner';
import { mockPlans, mockSubscriptions } from '@/mocks/backofficeMockData';
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

export default function SubscriptionsPage() {
  const [rows, setRows] = useState(mockSubscriptions);
  const [selected, setSelected] = useState(null);
  const [nextPlan, setNextPlan] = useState('Starter');
  const [extendDays, setExtendDays] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openManage = (row) => {
    setSelected(row);
    setNextPlan(row.plan_tier);
    setExtendDays('');
  };

  const applyChanges = () => {
    if (!selected) return;
    setRows((prev) =>
      prev.map((row) =>
        row.company_id === selected.company_id
          ? {
              ...row,
              plan_tier: nextPlan,
            }
          : row
      )
    );
    setConfirmOpen(false);
    setSelected(null);
    toast.success('Plan actualizado (mock)');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Subscriptions</h1>

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
            {rows.map((row) => (
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
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              Flujo simulado para visualizar UX sin backend.
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
                      <SelectItem key={plan} value={plan}>
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
              Se aplicara cambio de plan
              {extendDays ? ` + extension de ${extendDays} dias` : ''} en modo mock.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={applyChanges}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
