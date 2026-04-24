import { BarChart3, FileText, Send, ShieldAlert, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/AuthContext';
import { mockDashboardKpis } from '@/mocks/backofficeMockData';

const kpis = [
  {
    key: 'users',
    label: 'Usuarios Registrados',
    value: mockDashboardKpis.total_users.toLocaleString('en-US'),
    icon: Users,
  },
  {
    key: 'rfqs',
    label: 'RFQs Ultimos 7 Dias',
    value: mockDashboardKpis.rfqs_last_7_days.toLocaleString('en-US'),
    icon: FileText,
  },
  {
    key: 'quotes',
    label: 'Cotizaciones Ultimos 7 Dias',
    value: mockDashboardKpis.quotes_last_7_days.toLocaleString('en-US'),
    icon: Send,
  },
  {
    key: 'verifications',
    label: 'Verificaciones Pendientes',
    value: mockDashboardKpis.suppliers_pending_verification.toLocaleString('en-US'),
    icon: ShieldAlert,
  },
];

export default function DashboardPage() {
  const { admin } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Bienvenido de vuelta, {admin?.full_name || admin?.email || 'Admin'}
        </h1>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vista de Datos Mock</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta pantalla usa datos simulados para visualizar UI del MVP sin dependencia de endpoints.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
