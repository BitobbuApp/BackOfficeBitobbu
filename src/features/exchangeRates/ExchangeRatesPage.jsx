import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useExchangeRates, useSetDailyRate } from './hooks/useExchangeRatesData';

const PAIR = { from_currency: 'USD', to_currency: 'VES' };

// Local calendar day (the admin's), not UTC: at 9pm in Caracas UTC is already tomorrow.
function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// effective_date is a DATE; read it as a calendar day so it does not shift a day back in UTC-4.
const formatDay = (value) => {
  const [y, m, d] = String(value).slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};

const formatRate = (value) =>
  Number(value).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

export default function ExchangeRatesPage() {
  const { data = [], isLoading, isError } = useExchangeRates(PAIR);
  const setDaily = useSetDailyRate();
  const [rate, setRate] = useState('');
  const [source, setSource] = useState('BCV');
  const [date, setDate] = useState(todayLocal());

  const latest = data[0];
  const isTodayLoaded = latest && String(latest.effective_date).slice(0, 10) === todayLocal();
  const existingForDate = data.find(
    (r) => String(r.effective_date).slice(0, 10) === date && r.source === source.trim().toUpperCase()
  );

  const save = () => {
    const value = Number(String(rate).replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Ingresa una tasa valida');
      return;
    }
    if (!source.trim()) {
      toast.error('Indica la fuente (ej. BCV)');
      return;
    }
    setDaily.mutate(
      { ...PAIR, rate: value, source: source.trim().toUpperCase(), effective_date: date },
      { onSuccess: () => setRate('') }
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Tasas de cambio</h1>
        <p className="text-sm text-muted-foreground">
          Tasa USD → VES usada para mostrar los precios de los planes en bolivares y registrar los pagos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tasa vigente</CardTitle>
            <CardDescription>La ultima cargada es la que ven las empresas.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : latest ? (
              <div className="space-y-1">
                <p className="text-3xl font-semibold text-foreground">Bs. {formatRate(latest.rate)}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {latest.source} · {formatDay(latest.effective_date)}
                  </span>
                  {!isTodayLoaded && <Badge variant="destructive">No es de hoy</Badge>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aun no hay tasas cargadas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cargar tasa del dia</CardTitle>
            <CardDescription>Si ya existe una tasa para esa fecha y fuente, se reemplaza.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <div className="space-y-1">
                <Label>Bolivares por 1 USD</Label>
                <Input
                  inputMode="decimal"
                  placeholder="Ej: 36,5432"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Fuente</Label>
                  <Input value={source} onChange={(e) => setSource(e.target.value)} maxLength={20} />
                </div>
                <div className="space-y-1">
                  <Label>Fecha</Label>
                  <Input type="date" value={date} max={todayLocal()} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
              {existingForDate && (
                <p className="text-xs text-muted-foreground">
                  Ya hay una tasa {existingForDate.source} para esa fecha (Bs. {formatRate(existingForDate.rate)}); se reemplazara.
                </p>
              )}
              <Button type="submit" disabled={setDaily.isPending || !rate}>
                {setDaily.isPending ? 'Guardando...' : 'Guardar tasa'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar las tasas.
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead className="text-right">Bs. por USD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Cargando historial...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Sin historial.
                  </TableCell>
                </TableRow>
              ) : (
                data.slice(0, 30).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{formatDay(r.effective_date)}</TableCell>
                    <TableCell>{r.source}</TableCell>
                    <TableCell className="text-right font-mono">{formatRate(r.rate)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
