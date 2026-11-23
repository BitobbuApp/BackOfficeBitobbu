import { useState, useEffect } from 'react';
import { Search, Calendar, FilterX, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function DataTableFilters({
  onFilterChange,
  statusOptions = [],
  idPlaceholder = "ID (Serial)",
  onExport,
  isExporting = false,
}) {
  const [serial, setSerial] = useState('');
  const [status, setStatus] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleApplyFilters = () => {
    const filters = {
      serial_number: serial || undefined,
      status: status === 'all' ? undefined : status,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    };
    onFilterChange(filters);
  };

  const handleClear = () => {
    setSerial('');
    setStatus('all');
    setFromDate('');
    setToDate('');
    onFilterChange({});
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" onKeyDown={handleKeyDown}>
        {/* Serial Number Search */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase">Buscar por {idPlaceholder}</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Ej: 33"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase">Estado</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase">Desde</label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Date To */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase">Hasta</label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onExport ? (
          <Button variant="outline" size="sm" onClick={onExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Descargando...' : 'Exportar CSV'}
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground">
          <FilterX className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
        <Button size="sm" onClick={handleApplyFilters} className="px-8">
          Buscar
        </Button>
      </div>
    </div>
  );
}
