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

const COLUMNS = 7;

function StateRow({ children }) {
  return (
    <TableRow>
      <TableCell colSpan={COLUMNS} className="py-6 text-center text-muted-foreground">
        {children}
      </TableCell>
    </TableRow>
  );
}

export default function SubcategoriesTable({
  subcategories,
  isLoading,
  hasCategory,
  onEdit,
  onToggleStatus,
  isUpdatingStatus,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Orden</TableHead>
            <TableHead>Nombre (ES)</TableHead>
            <TableHead>Nombre (EN)</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-center">Empresas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasCategory ? (
            <StateRow>Selecciona una categoría para ver sus subcategorías.</StateRow>
          ) : isLoading ? (
            <StateRow>Cargando...</StateRow>
          ) : subcategories.length === 0 ? (
            <StateRow>Esta categoría todavía no tiene subcategorías.</StateRow>
          ) : (
            subcategories.map((subcategory) => (
              <TableRow key={subcategory.id} className={subcategory.is_active ? '' : 'opacity-60'}>
                <TableCell>{subcategory.sort_order}</TableCell>
                <TableCell className="font-medium">{subcategory.name_es}</TableCell>
                <TableCell>{subcategory.name_en}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{subcategory.slug}</TableCell>
                <TableCell className="text-center">{subcategory.company_count ?? 0}</TableCell>
                <TableCell>
                  <Badge variant={subcategory.is_active ? 'default' : 'secondary'}>
                    {subcategory.is_active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(subcategory)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onToggleStatus(subcategory)}
                      disabled={isUpdatingStatus}
                    >
                      {subcategory.is_active ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
