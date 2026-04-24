import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { mockCountries, mockStates } from '@/mocks/backofficeMockData';
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

function normalizeCode(raw) {
  return raw.trim().toUpperCase().replace(/\s+/g, '_');
}

export default function GeographyPage() {
  const [countries, setCountries] = useState(mockCountries);
  const [states, setStates] = useState(mockStates);
  const [tab, setTab] = useState('countries');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [countryCode, setCountryCode] = useState('VE');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const countryOptions = useMemo(
    () => countries.map((c) => ({ code: c.code, name: c.name })),
    [countries]
  );

  const openCreate = () => {
    setEditingItem(null);
    setCode('');
    setName('');
    setCountryCode(countryOptions[0]?.code || 'VE');
    setEditorOpen(true);
  };

  const openEditCountry = (item) => {
    setEditingItem(item);
    setCode(item.code);
    setName(item.name);
    setEditorOpen(true);
  };

  const openEditState = (item) => {
    setEditingItem(item);
    setCode(item.code);
    setName(item.name);
    setCountryCode(item.country_code);
    setEditorOpen(true);
  };

  const save = () => {
    if (!code.trim() || !name.trim()) {
      toast.error('Code y nombre son obligatorios');
      return;
    }

    if (tab === 'countries') {
      const payload = {
        id: editingItem?.id || `country-${Date.now()}`,
        code: normalizeCode(code),
        name: name.trim(),
        is_active: editingItem?.is_active ?? true,
      };
      setCountries((prev) =>
        editingItem ? prev.map((c) => (c.id === editingItem.id ? payload : c)) : [...prev, payload]
      );
      toast.success(editingItem ? 'Pais actualizado (mock)' : 'Pais creado (mock)');
    } else {
      const payload = {
        id: editingItem?.id || `state-${Date.now()}`,
        country_code: countryCode,
        code: normalizeCode(code),
        name: name.trim(),
        is_active: editingItem?.is_active ?? true,
      };
      setStates((prev) =>
        editingItem ? prev.map((s) => (s.id === editingItem.id ? payload : s)) : [...prev, payload]
      );
      toast.success(editingItem ? 'Estado actualizado (mock)' : 'Estado creado (mock)');
    }
    setEditorOpen(false);
  };

  const toggleCountry = (item) => {
    setCountries((prev) =>
      prev.map((country) =>
        country.id === item.id ? { ...country, is_active: !country.is_active } : country
      )
    );
    toast.success('Estado del pais actualizado (mock)');
  };

  const toggleState = (item) => {
    setStates((prev) =>
      prev.map((state) => (state.id === item.id ? { ...state, is_active: !state.is_active } : state))
    );
    toast.success('Estado del estado actualizado (mock)');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Geography</h1>
        <Button onClick={openCreate}>Nuevo {tab === 'countries' ? 'Pais' : 'Estado'}</Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={tab === 'countries' ? 'default' : 'outline'}
          onClick={() => setTab('countries')}
        >
          Countries
        </Button>
        <Button
          variant={tab === 'states' ? 'default' : 'outline'}
          onClick={() => setTab('states')}
        >
          States
        </Button>
      </div>

      {tab === 'countries' ? (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow key={country.id}>
                  <TableCell className="font-medium">{country.code}</TableCell>
                  <TableCell>{country.name}</TableCell>
                  <TableCell>
                    <Badge variant={country.is_active ? 'default' : 'secondary'}>
                      {country.is_active ? 'active' : 'inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditCountry(country)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => toggleCountry(country)}>
                        {country.is_active ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {states.map((state) => (
                <TableRow key={state.id}>
                  <TableCell>{state.country_code}</TableCell>
                  <TableCell className="font-medium">{state.code}</TableCell>
                  <TableCell>{state.name}</TableCell>
                  <TableCell>
                    <Badge variant={state.is_active ? 'default' : 'secondary'}>
                      {state.is_active ? 'active' : 'inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditState(state)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => toggleState(state)}>
                        {state.is_active ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Actualizar' : 'Crear'} {tab === 'countries' ? 'Pais' : 'Estado'}</DialogTitle>
            <DialogDescription>Flujo mock para validar UI administrativa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {tab === 'states' && (
              <div className="space-y-1">
                <Label>Pais</Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.code} - {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1">
              <Label>Code</Label>
              <Input value={code} onChange={(event) => setCode(event.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
