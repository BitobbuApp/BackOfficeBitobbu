import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, FileText, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useVerificationsList } from './hooks/useVerificationsData';
import { VerificationDossierDialog } from './components/VerificationDossierDialog';

function formatDate(date) {
  return new Date(date).toLocaleString('es-VE');
}

const PAGE_SIZE = 10;

export default function VerificationsPage() {
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useVerificationsList({ 
    status: 'pending', 
    page, 
    limit: PAGE_SIZE 
  });

  const items = data?.items || [];
  const totalPages = data?.total_pages || 1;
  const totalCount = data?.total || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Verifications</h1>
        <Badge variant="secondary">{totalCount} pendientes</Badge>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Cargando verificaciones...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar las verificaciones.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.company_id} className="rounded-lg border bg-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">{item.legal_name || item.trade_name || 'Sin nombre registrado'}</p>
                  <p className="text-sm text-muted-foreground">
                    RIF: {item.tax_id || 'No provisto'} - {item.document_count} documento(s)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Actualizado: {formatDate(item.updated_at)}
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
      )}

      {items.length > 0 && !isLoading && !isError && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
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
      )}

      <VerificationDossierDialog verification={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
