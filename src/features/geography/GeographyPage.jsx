import { useMemo, useState } from 'react';
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

import {
  useCountriesList,
  useCreateCountry,
  useCreateState,
  useStatesList,
  useUpdateCountry,
  useUpdateCountryStatus,
  useUpdateState,
  useUpdateStateStatus,
} from './hooks/useGeographyData';

export default function GeographyPage() {
  const [tab, setTab] = useState('countries');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState(''); // For states list filter
  const [countryCode, setCountryCode] = useState(''); // For state creation form
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const { data: countriesData, isLoading: isLoadingCountries, isError: isErrorCountries } = useCountriesList();

  const countries = countriesData || [];

  // Update selected country code for list if empty and countries load
  if (!selectedCountryCode && countries.length > 0) {
    setSelectedCountryCode(countries[0].code);
  }

  const { data: statesData, isLoading: isLoadingStates, isError: isErrorStates } = useStatesList(
    tab === 'states' ? selectedCountryCode : null
  );

  const states = statesData || [];

  const { mutate: createCountry, isPending: isCreatingCountry } = useCreateCountry();
  const { mutate: updateCountry, isPending: isUpdatingCountry } = useUpdateCountry();
  const { mutate: updateCountryStatus, isPending: isUpdatingCountryStatus } = useUpdateCountryStatus();

  const { mutate: createState, isPending: isCreatingState } = useCreateState();
  const { mutate: updateState, isPending: isUpdatingState } = useUpdateState();
  const { mutate: updateStateStatus, isPending: isUpdatingStateStatus } = useUpdateStateStatus();

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
        code: normalizeCode(code),
        name: name.trim(),
        is_active: editingItem ? editingItem.is_active : true,
      };
      if (editingItem) {
        updateCountry({ id: editingItem.id, data: payload }, { onSuccess: () => setEditorOpen(false) });
      } else {
        createCountry(payload, { onSuccess: () => setEditorOpen(false) });
      }
    } else {
      const payload = {
        country_code: countryCode,
        code: normalizeCode(code),
        name: name.trim(),
        is_active: editingItem ? editingItem.is_active : true,
      };
      if (editingItem) {
        updateState({ id: editingItem.id, data: payload }, { onSuccess: () => setEditorOpen(false) });
      } else {
        createState(payload, { onSuccess: () => setEditorOpen(false) });
      }
    }
  };

  const toggleCountry = (item) => {
    updateCountryStatus({ id: item.id, data: { is_active: !item.is_active } });
  };

  const toggleState = (item) => {
    updateStateStatus({ id: item.id, data: { is_active: !item.is_active } });
  };

  const isSaving =
    isCreatingCountry || isUpdatingCountry || isCreatingState || isUpdatingState;
  const isUpdatingStatus = isUpdatingCountryStatus || isUpdatingStateStatus;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Geography</h1>
        <Button onClick={openCreate}>Nuevo {tab === 'countries' ? 'Pais' : 'Estado'}</Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        {tab === 'states' && (
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap">Filtrar por pais:</Label>
            <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Seleccione pais" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {tab === 'countries' ? (
        isErrorCountries ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            Error al cargar paises.
          </div>
        ) : (
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
                {isLoadingCountries ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">Cargando...</TableCell>
                  </TableRow>
                ) : countries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">No hay paises registrados.</TableCell>
                  </TableRow>
                ) : (
                  countries.map((country) => (
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
                          <Button size="sm" variant="secondary" onClick={() => toggleCountry(country)} disabled={isUpdatingStatus}>
                            {country.is_active ? 'Desactivar' : 'Activar'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        isErrorStates ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            Error al cargar estados.
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
                {isLoadingStates ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">Cargando...</TableCell>
                  </TableRow>
                ) : states.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No hay estados registrados.</TableCell>
                  </TableRow>
                ) : (
                  states.map((state) => (
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
                          <Button size="sm" variant="secondary" onClick={() => toggleState(state)} disabled={isUpdatingStatus}>
                            {state.is_active ? 'Desactivar' : 'Activar'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Actualizar' : 'Crear'} {tab === 'countries' ? 'Pais' : 'Estado'}</DialogTitle>
            <DialogDescription>Formulario de edicion.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {tab === 'states' && (
              <div className="space-y-1">
                <Label>Pais</Label>
                <Select value={countryCode} onValueChange={setCountryCode} disabled={isSaving || editingItem}>
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
              <Input value={code} onChange={(event) => setCode(event.target.value)} disabled={isSaving || editingItem} />
            </div>
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} disabled={isSaving} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
