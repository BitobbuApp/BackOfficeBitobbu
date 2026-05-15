import { BarChart3, FileText, Send, ShieldAlert, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/AuthContext';
import { useDashboardKpis } from './hooks/useDashboardData';

export default function DashboardPage() {
  const { admin } = useAuth();
  const { data: dashboardKpis, isLoading, isError, error } = useDashboardKpis();

  const kpis = [
    {
      key: 'users',
      label: 'Usuarios Registrados (Activos)',
      value: `${dashboardKpis?.total_users?.toLocaleString('en-US') ?? '-'} (${dashboardKpis?.active_users?.toLocaleString('en-US') ?? '-'})`,
      icon: Users,
    },
    {
      key: 'companies',
      label: 'Empresas Totales',
      value: dashboardKpis?.total_companies?.toLocaleString('en-US') ?? '-',
      icon: FileText,
    },
    {
      key: 'verifications',
      label: 'Verificaciones Pendientes',
      value: dashboardKpis?.pending_verifications?.toLocaleString('en-US') ?? '-',
      icon: ShieldAlert,
    },
    {
      key: 'rfqs',
      label: 'RFQs Últimos 30 Días',
      value: dashboardKpis?.rfqs_last_30_days?.toLocaleString('en-US') ?? '-',
      icon: FileText,
    },
    {
      key: 'quotes',
      label: 'Cotizaciones Últimos 30 Días',
      value: dashboardKpis?.quotes_last_30_days?.toLocaleString('en-US') ?? '-',
      icon: Send,
    },
    {
      key: 'gmv',
      label: 'GMV Transaccionado (USD)',
      value: dashboardKpis?.total_gmv_usd?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ?? '-',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Bienvenido de vuelta, {admin?.full_name || admin?.email || 'Admin'}
        </h1>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando KPIs...</p>}

      {isError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar dashboard: {error?.message}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
