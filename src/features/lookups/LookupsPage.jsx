import { useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DEFAULT_LOOKUP_TABLE_KEY,
  LOOKUP_TABLES_BY_KEY,
} from './lookupsTableRegistry';
import {
  useCreateLookup,
  useLookupsList,
  useUpdateLookup,
  useUpdateLookupStatus,
} from './hooks/useLookupsData';

function normalizeCode(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, '_');
}

function renderCellValue(item, column) {
  const value = item[column.key];

  if (column.type === 'status') {
    return (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'active' : 'inactive'}
      </Badge>
    );
  }

  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
}

export default function LookupsPage() {
  const { tableKey } = useParams();
  const selectedTable = tableKey || DEFAULT_LOOKUP_TABLE_KEY;
  const tableMeta = LOOKUP_TABLES_BY_KEY[selectedTable];
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');

  if (!tableMeta) {
    return <Navigate to={`/config/lookups/${DEFAULT_LOOKUP_TABLE_KEY}`} replace />;
  }

  const { data: currentRows, isLoading, isError } = useLookupsList(tableMeta);
  const { mutate: createLookup, isPending: isCreating } = useCreateLookup();
  const { mutate: updateLookup, isPending: isUpdating } = useUpdateLookup();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateLookupStatus();

  const openCreate = () => {
    if (!tableMeta.supportsCreate) {
      return;
    }

    setEditingItem(null);
    setCode('');
    setLabel('');
    setEditorOpen(true);
  };

  const openEdit = (item) => {
    if (!tableMeta.supportsEdit) {
      return;
    }

    setEditingItem(item);
    setCode(item.code ?? '');
    setLabel(item.label ?? '');
    setEditorOpen(true);
  };

  const saveLookup = () => {
    if (!code.trim() || !label.trim()) {
      toast.error('Code y Label son obligatorios');
      return;
    }

    const payload = {
      code: normalizeCode(code),
      label: label.trim(),
      is_active: editingItem ? editingItem.is_active : true,
    };

    if (editingItem) {
      updateLookup(
        { tableConfig: tableMeta, id: String(editingItem.id), data: payload },
        {
          onSuccess: () => {
            setEditorOpen(false);
          },
        }
      );
      return;
    }

    createLookup(
      { tableConfig: tableMeta, data: payload },
      {
        onSuccess: () => {
          setEditorOpen(false);
        },
      }
    );
  };

  const toggleLookup = (item) => {
    if (!tableMeta.supportsStatus) {
      return;
    }

    updateStatus({
      tableConfig: tableMeta,
      id: String(item.id),
      data: { is_active: !item.is_active },
    });
  };

  const isSaving = isCreating || isUpdating;
  const hasActions = tableMeta.supportsEdit || tableMeta.supportsStatus;
  const columnCount = tableMeta.columns.length + (hasActions ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{tableMeta.label}</h1>
          <p className="text-sm text-muted-foreground">{tableMeta.appFunction}</p>
        </div>
        {tableMeta.supportsCreate ? (
          <Button onClick={openCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo registro
          </Button>
        ) : null}
      </div>

      <div className="rounded-lg border bg-card p-3 space-y-1">
        <p className="text-sm text-muted-foreground">{tableMeta.description}</p>
        <p className="text-xs text-muted-foreground">
          Endpoint conectado: <code>{tableMeta.endpoint}</code>
        </p>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar los datos de la tabla.
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                {tableMeta.columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
                {hasActions ? (
                  <TableHead className="text-right">Actions</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columnCount} className="py-4 text-center text-muted-foreground">
                    Cargando registros...
                  </TableCell>
                </TableRow>
              ) : currentRows && currentRows.length > 0 ? (
                currentRows.map((item, index) => (
                  <TableRow key={item.id ?? `${tableMeta.key}-${index}`}>
                    {tableMeta.columns.map((column) => (
                      <TableCell key={column.key} className={column.key === 'code' ? 'font-medium' : ''}>
                        {renderCellValue(item, column)}
                      </TableCell>
                    ))}
                    {hasActions ? (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {tableMeta.supportsEdit ? (
                            <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                              Editar
                            </Button>
                          ) : null}
                          {tableMeta.supportsStatus ? (
                            <Button
                              size="sm"
                              variant={item.is_active ? 'secondary' : 'default'}
                              onClick={() => toggleLookup(item)}
                              disabled={isUpdatingStatus}
                            >
                              {item.is_active ? 'Desactivar' : 'Activar'}
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columnCount} className="py-4 text-center text-muted-foreground">
                    No hay registros en esta tabla.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {tableMeta.supportsCreate || tableMeta.supportsEdit ? (
        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar registro' : 'Crear registro'}</DialogTitle>
              <DialogDescription>Edicion en tabla {tableMeta.label}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Code</Label>
                <Input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="my_lookup_code"
                  disabled={isSaving || !!editingItem}
                />
              </div>
              <div className="space-y-1">
                <Label>Label</Label>
                <Input
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  placeholder="My Lookup Label"
                  disabled={isSaving}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditorOpen(false)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button onClick={saveLookup} disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
