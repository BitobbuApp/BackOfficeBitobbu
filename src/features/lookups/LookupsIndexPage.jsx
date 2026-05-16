import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LOOKUP_TABLES } from './lookupsTableRegistry';

export default function LookupsIndexPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Configuracion de Tablas Maestras</h1>
        <p className="text-sm text-muted-foreground">
          Listado de catalogos conectados a sus endpoints reales del backend admin.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {LOOKUP_TABLES.map((table) => (
          <Card key={table.key} className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{table.label}</CardTitle>
              <CardDescription>{table.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{table.area}</Badge>
                <span className="text-xs text-muted-foreground">tableKey: {table.key}</span>
              </div>
              <p className="text-sm text-foreground">{table.appFunction}</p>
              <p className="text-xs text-muted-foreground">
                Endpoint: <code>{table.endpointLabel}</code>
              </p>
              <Link
                to={`/config/lookups/${table.key}`}
                className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Gestionar tabla
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
