import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, FileText, ShieldCheck } from 'lucide-react';
import { mockVerifications } from '@/mocks/backofficeMockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  return new Date(date).toLocaleString('es-VE');
}

export default function VerificationsPage() {
  const [items, setItems] = useState(mockVerifications);
  const [selected, setSelected] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');

  const approve = (item) => {
    setItems((prev) => prev.filter((v) => v.id !== item.id));
    setSelected(null);
    toast.success('Proveedor aprobado (mock)');
  };

  const reject = (event) => {
    if (!reason.trim()) {
      event.preventDefault();
      toast.error('El motivo de rechazo es obligatorio');
      return;
    }
    if (!selected) return;
    setItems((prev) => prev.filter((v) => v.id !== selected.id));
    setRejectOpen(false);
    setSelected(null);
    setReason('');
    toast.success('Proveedor rechazado (mock)');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Verifications</h1>
        <Badge variant="secondary">{items.length} pendientes</Badge>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">{item.company_name}</p>
                <p className="text-sm text-muted-foreground">
                  RIF: {item.tax_id} - {item.primary_contact}
                </p>
                <p className="text-xs text-muted-foreground">
                  Enviado: {formatDate(item.submitted_at)}
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelected(item)}>
                <Eye className="mr-2 h-4 w-4" />
                Revisar
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
            No hay proveedores pendientes.
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Dossier de Verificacion
            </DialogTitle>
            <DialogDescription>Revision manual con datos mock.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Company:</span> {selected.company_name}
              </p>
              <p>
                <span className="font-semibold">Tax ID:</span> {selected.tax_id}
              </p>
              <p>
                <span className="font-semibold">Representative:</span>{' '}
                {selected.representative}
              </p>
              <p>
                <span className="font-semibold">Primary Contact:</span>{' '}
                {selected.primary_contact}
              </p>
              <a
                href={selected.document_url}
                onClick={(event) => event.preventDefault()}
                className="inline-flex items-center text-sm font-medium text-primary underline"
              >
                <FileText className="mr-2 h-4 w-4" />
                Ver documento (mock)
              </a>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(true)}>
              Rechazar
            </Button>
            <Button onClick={() => selected && approve(selected)}>Aprobar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar verificacion</AlertDialogTitle>
            <AlertDialogDescription>
              Debes indicar el motivo de rechazo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Motivo obligatorio..."
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={reject}>Confirmar rechazo</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
