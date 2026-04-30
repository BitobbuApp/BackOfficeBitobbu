import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
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

const tableOptions = [
  { key: 'company_types', label: 'Company Types' },
  { key: 'verification_statuses', label: 'Verification Statuses' },
  { key: 'payment_terms', label: 'Payment Terms' },
];

function normalizeCode(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, '_');
}

import {
  useCreateLookup,
  useLookupsList,
  useUpdateLookup,
  useUpdateLookupStatus,
} from './hooks/useLookupsData';

export default function LookupsPage() {
  const [selectedTable, setSelectedTable] = useState(tableOptions[0].key);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');

  const { data: currentRows, isLoading, isError } = useLookupsList(selectedTable);
  const { mutate: createLookup, isPending: isCreating } = useCreateLookup();
  const { mutate: updateLookup, isPending: isUpdating } = useUpdateLookup();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateLookupStatus();

  const activeLabel = useMemo(
    () => tableOptions.find((opt) => opt.key === selectedTable)?.label || selectedTable,
    [selectedTable]
  );

  const openCreate = () => {
    setEditingItem(null);
    setCode('');
    setLabel('');
    setEditorOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setCode(item.code);
    setLabel(item.label);
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
        { tableKey: selectedTable, id: editingItem.id, data: payload },
        {
          onSuccess: () => {
            setEditorOpen(false);
          },
        }
      );
    } else {
      createLookup(
        { tableKey: selectedTable, data: payload },
        {
          onSuccess: () => {
            setEditorOpen(false);
          },
        }
      );
    }
  };

  const toggleLookup = (item) => {
    updateStatus({
      tableKey: selectedTable,
      id: item.id,
      data: { is_active: !item.is_active },
    });
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lookup Tables</h1>
          <p className="text-sm text-muted-foreground">
            Crear, listar y actualizar valores de tablas lookup.
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Lookup
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-3">
        <div className="max-w-xs space-y-1">
          <Label>Tabla</Label>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tableOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                <TableHead>{activeLabel} Code</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    Cargando registros...
                  </TableCell>
                </TableRow>
              ) : currentRows && currentRows.length > 0 ? (
                currentRows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? 'active' : 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={item.is_active ? 'secondary' : 'default'}
                          onClick={() => toggleLookup(item)}
                          disabled={isUpdatingStatus}
                        >
                          {item.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No hay registros en esta tabla.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Lookup' : 'Crear Lookup'}</DialogTitle>
            <DialogDescription>Edición en tabla {activeLabel}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Code</Label>
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="my_lookup_code"
                disabled={isSaving || editingItem} // Generally code shouldn't change, but it's up to you
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
    </div>
  );
}
