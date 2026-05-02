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
import { useRfqsList } from './hooks/useRfqsData';
import { DataTableFilters } from '@/components/DataTableFilters';
import { useDownloadFile } from '@/hooks/useDownloadFile';
import { rfqsApi } from './services/rfqsApi';

const PAGE_SIZE = 10;

const RFQ_STATUS_OPTIONS = [
  { label: 'Activo', value: 'active' },
  { label: 'Completado', value: 'completed' },
  { label: 'Cerrado', value: 'closed' },
  { label: 'Eliminado', value: 'deleted' },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-VE');
}

export default function RfqsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data, isLoading, isError } = useRfqsList({ page, limit: PAGE_SIZE, ...filters });
  const { downloadFile, isDownloading } = useDownloadFile();

  const rows = data?.items || [];
  const totalPages = data?.total_pages || 1;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 on filter change
  };

  const handleExport = async () => {
    await downloadFile({
      downloader: () => rfqsApi.exportList(filters),
      filename: 'rfqs.csv',
      successMessage: 'Exportacion iniciada',
      errorMessage: 'Error al exportar RFQs',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">RFQs</h1>
        <Badge variant="secondary">{data?.total || 0} total</Badge>
      </div>

      <DataTableFilters 
        onFilterChange={handleFilterChange} 
        statusOptions={RFQ_STATUS_OPTIONS}
        idPlaceholder="RFQ-ID"
        onExport={handleExport}
        isExporting={isDownloading}
      />

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar los RFQs.
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Respuestas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Vencimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      Cargando RFQs...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No hay RFQs registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-bold text-primary">
                        RFQ-{rfq.serial_number}
                      </TableCell>
                      <TableCell className="font-medium">{rfq.category || 'N/A'}</TableCell>
                      <TableCell>{rfq.product_service}</TableCell>
                      <TableCell>{rfq.company?.trade_name || 'Desconocido'}</TableCell>
                      <TableCell>
                        {rfq.quantity} {rfq.unit}
                      </TableCell>
                      <TableCell>{rfq.response_count || 0}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rfq.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(rfq.created_at)}</TableCell>
                      <TableCell>{rfq.expiration_date ? formatDate(rfq.expiration_date) : '-'}</TableCell>
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
