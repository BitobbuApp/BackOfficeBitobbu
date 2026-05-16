import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuoteResponsesList } from './hooks/useQuoteResponsesData';
import { DataTableFilters } from '@/components/DataTableFilters';
import { useDownloadFile } from '@/hooks/useDownloadFile';
import { quoteResponsesApi } from './services/quoteResponsesApi';

const PAGE_SIZE = 10;

const QUOTE_STATUS_OPTIONS = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Enviada', value: 'sent' },
  { label: 'Aceptada', value: 'accepted' },
  { label: 'Rechazada', value: 'rejected' },
  { label: 'Vencida', value: 'expired' },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-VE');
}

export default function QuoteResponsesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data, isLoading, isError } = useQuoteResponsesList({ page, limit: PAGE_SIZE, ...filters });
  const { downloadFile, isDownloading } = useDownloadFile();

  const rows = data?.items || [];
  const totalPages = data?.totalPages || data?.total_pages || 1;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleExport = async () => {
    await downloadFile({
      downloader: () => quoteResponsesApi.exportList(filters),
      filename: 'quote-responses.csv',
      successMessage: 'Exportacion iniciada',
      errorMessage: 'Error al exportar cotizaciones',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Quote Responses</h1>
        <Badge variant="secondary">{data?.total || 0} total</Badge>
      </div>

      <DataTableFilters 
        onFilterChange={handleFilterChange} 
        statusOptions={QUOTE_STATUS_OPTIONS}
        idPlaceholder="QUOTE-ID"
        onExport={handleExport}
        isExporting={isDownloading}
      />

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar cotizaciones.
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Solicitud</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Precio U. (USD)</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Total (USD)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Cargando cotizaciones...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No hay cotizaciones registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-bold text-primary">QUO-{quote.serial_number}</TableCell>
                      <TableCell className="font-medium">{quote.request_product || 'Desconocido'}</TableCell>
                      <TableCell>{quote.supplier_name || 'Desconocido'}</TableCell>
                      <TableCell>${quote.unit_price_usd.toFixed(2)}</TableCell>
                      <TableCell>{quote.quantity}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        ${quote.total_amount_usd?.toLocaleString('en-US') || 0}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{quote.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(quote.created_at)}</TableCell>
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
    </div>
  );
}
