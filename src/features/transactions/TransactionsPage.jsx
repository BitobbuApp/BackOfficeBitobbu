import { useMemo, useState } from 'react';
import { mockTransactions } from '@/mocks/backofficeMockData';
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

const PAGE_SIZE = 10;

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-VE');
}

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(mockTransactions.length / PAGE_SIZE);

  const rows = useMemo(
    () => mockTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
        <Badge variant="secondary">{mockTransactions.length} total</Badge>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Comprador</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((trx) => (
              <TableRow key={trx.id}>
                <TableCell className="font-medium">{trx.id}</TableCell>
                <TableCell>{trx.buyer_company}</TableCell>
                <TableCell>{trx.supplier_company}</TableCell>
                <TableCell>
                  {trx.currency} {trx.total_amount_usd.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{trx.status}</Badge>
                </TableCell>
                <TableCell>{formatDate(trx.created_at)}</TableCell>
              </TableRow>
            ))}
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
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
