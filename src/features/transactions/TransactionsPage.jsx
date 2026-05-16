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

import { useTransactionsList } from './hooks/useTransactionsData';
import { DataTableFilters } from '@/components/DataTableFilters';
import { useDownloadFile } from '@/hooks/useDownloadFile';
import { transactionsApi } from './services/transactionsApi';

const PAGE_SIZE = 10;

const TRX_STATUS_OPTIONS = [
  { label: 'En Proceso', value: 'in_process' },
  { label: 'Completada', value: 'completed' },
  { label: 'Cancelada', value: 'cancelled' },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-VE');
}

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data, isLoading, isError } = useTransactionsList({ page, limit: PAGE_SIZE, ...filters });
  const { downloadFile, isDownloading } = useDownloadFile();

  const rows = data?.items || [];
  const totalPages = data?.totalPages || data?.total_pages || 1;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleExport = async () => {
    await downloadFile({
      downloader: () => transactionsApi.exportList(filters),
      filename: 'transactions.csv',
      successMessage: 'Exportacion iniciada',
      errorMessage: 'Error al exportar transacciones',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
        <Badge variant="secondary">{data?.total || 0} total</Badge>
      </div>

      <DataTableFilters 
        onFilterChange={handleFilterChange} 
        statusOptions={TRX_STATUS_OPTIONS}
        idPlaceholder="TRX-ID"
        onExport={handleExport}
        isExporting={isDownloading}
      />

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar transacciones.
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Total (USD)</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fecha Est.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Cargando transacciones...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No hay transacciones registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className="font-bold text-primary">TRX-{trx.serial_number}</TableCell>
                      <TableCell className="font-medium">{trx.product_description || 'Desconocido'}</TableCell>
                      <TableCell>{trx.buyer_name || 'Desconocido'}</TableCell>
                      <TableCell>{trx.supplier_name || 'Desconocido'}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        {trx.payment_currency || 'USD'} ${trx.total_amount_usd?.toLocaleString('en-US') || 0}
                      </TableCell>
                      <TableCell>{trx.delivery_time || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{trx.status}</Badge>
                      </TableCell>
                      <TableCell>{trx.estimated_delivery_date ? formatDate(trx.estimated_delivery_date) : formatDate(trx.created_at)}</TableCell>
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
