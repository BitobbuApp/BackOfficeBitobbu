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
import { subscriptionPaymentsApi } from './services/subscriptionPaymentsApi';
import {
  useApprovePayment,
  useRejectPayment,
  useSubscriptionPaymentsList,
} from './hooks/useSubscriptionPaymentsData';

const STATUS = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  approved: { label: 'Aprobado', variant: 'default' },
  rejected: { label: 'Rechazado', variant: 'destructive' },
};

const formatDate = (date) => (date ? new Date(date).toLocaleDateString('es-VE') : '-');
const formatVes = (value) =>
  value === null || value === undefined
    ? '-'
    : `Bs. ${Number(value).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;

function Detail({ label, children }) {
  return (
    <div className="flex justify-between gap-4 border-b py-1 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}

export default function SubscriptionPaymentsPage() {
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [openingReceipt, setOpeningReceipt] = useState(false);

  const { data, isLoading, isError } = useSubscriptionPaymentsList({ status, page, limit: 20 });
  const approve = useApprovePayment();
  const reject = useRejectPayment();

  const rows = data?.items || [];
  const totalPages = data?.total_pages || 1;
  const isReviewing = approve.isPending || reject.isPending;

  const close = () => {
    setSelected(null);
    setRejecting(false);
    setReason('');
  };

  const openReceipt = async () => {
    // Open the tab synchronously so popup blockers allow it, then point it at the signed URL.
    const tab = window.open('', '_blank');
    setOpeningReceipt(true);
    try {
      const url = await subscriptionPaymentsApi.getReceiptUrl(selected.id);
      if (tab) tab.location.href = url;
    } catch {
      tab?.close();
      toast.error('No se pudo abrir el comprobante');
    } finally {
      setOpeningReceipt(false);
    }
  };

  const confirmReject = () => {
    if (reason.trim().length < 3) {
      toast.error('Indica el motivo del rechazo');
      return;
    }
    reject.mutate({ id: selected.id, reason: reason.trim() }, { onSuccess: close });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pagos reportados</h1>
          <p className="text-sm text-muted-foreground">
            Verifica cada pago movil contra el banco antes de aprobarlo. Aprobar activa o renueva el plan.
          </p>
        </div>
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
            {Object.entries(STATUS).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar los pagos.
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Fecha de pago</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Cargando pagos...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No hay pagos en este estado.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.company.trade_name}</TableCell>
                      <TableCell>{row.plan?.name_es || row.plan?.name}</TableCell>
                      <TableCell>
                        <div>{formatVes(row.amount_ves)}</div>
                        <div className="text-xs text-muted-foreground">${row.amount_usd}</div>
                      </TableCell>
                      <TableCell className="font-mono">{row.reference}</TableCell>
                      <TableCell>{formatDate(row.paid_at)}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS[row.status].variant}>{STATUS[row.status].label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" onClick={() => setSelected(row)}>
                          {row.status === 'pending' ? 'Revisar' : 'Ver'}
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
              <Button variant="outline" disabled={page <= 1 || isLoading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Anterior
              </Button>
              <Button variant="outline" disabled={page >= totalPages || isLoading} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pago de {selected?.company.trade_name}</DialogTitle>
            <DialogDescription>
              Compara la referencia, el monto y la cedula con el movimiento del banco.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div>
                <Detail label="Plan">{selected.plan?.name_es || selected.plan?.name}</Detail>
                <Detail label="Monto">
                  {formatVes(selected.amount_ves)} (${selected.amount_usd}
                  {selected.exchange_rate ? ` @ ${selected.exchange_rate}` : ''})
                </Detail>
                <Detail label="Banco emisor">{selected.bank_code}</Detail>
                <Detail label="Referencia">
                  <span className="font-mono">{selected.reference}</span>
                </Detail>
                <Detail label="Telefono">{selected.payer_phone}</Detail>
                <Detail label="Cedula / RIF">{selected.payer_document}</Detail>
                <Detail label="Fecha de pago">{formatDate(selected.paid_at)}</Detail>
                <Detail label="Reportado">{formatDate(selected.created_at)}</Detail>
                {selected.rejection_reason && <Detail label="Motivo de rechazo">{selected.rejection_reason}</Detail>}
              </div>
              <Button variant="outline" className="w-full" onClick={openReceipt} disabled={openingReceipt}>
                {openingReceipt ? 'Abriendo...' : 'Ver comprobante'}
              </Button>
              {rejecting && (
                <div className="space-y-1">
                  <Label>Motivo del rechazo</Label>
                  <Input
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Ej: referencia no encontrada en el banco"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={close} disabled={isReviewing}>
              Cerrar
            </Button>
            {selected?.status === 'pending' &&
              (rejecting ? (
                <Button variant="destructive" onClick={confirmReject} disabled={isReviewing}>
                  Confirmar rechazo
                </Button>
              ) : (
                <>
                  <Button variant="destructive" onClick={() => setRejecting(true)} disabled={isReviewing}>
                    Rechazar
                  </Button>
                  <Button onClick={() => approve.mutate(selected.id, { onSuccess: close })} disabled={isReviewing}>
                    Aprobar
                  </Button>
                </>
              ))}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
