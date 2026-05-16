import DashboardPage from '@/features/dashboard/DashboardPage';
import UsersPage from '@/features/users/UsersPage';
import VerificationsPage from '@/features/verifications/VerificationsPage';
import SubscriptionsPage from '@/features/subscriptions/SubscriptionsPage';
import PlansCatalogPage from '@/features/plansCatalog/PlansCatalogPage';
import LookupsPage from '@/features/lookups/LookupsPage';
import RfqsPage from '@/features/rfqs/RfqsPage';
import QuoteResponsesPage from '@/features/quoteResponses/QuoteResponsesPage';
import TransactionsPage from '@/features/transactions/TransactionsPage';
import GeographyPage from '@/features/geography/GeographyPage';
import AdminsPage from '@/features/admins/AdminsPage';
import LegacyLookupsRedirect from '@/features/lookups/LegacyLookupsRedirect';
import LookupsIndexPage from '@/features/lookups/LookupsIndexPage';

export const MAIN_PAGES = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardPage,
    showInSidebar: true,
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersPage,
    showInSidebar: true,
  },
  {
    path: '/verifications',
    name: 'Verifications',
    component: VerificationsPage,
    showInSidebar: true,
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: SubscriptionsPage,
    showInSidebar: true,
  },
  {
    path: '/plans-catalog',
    name: 'Plans Catalog',
    component: PlansCatalogPage,
    showInSidebar: true,
  },
  {
    path: '/lookups',
    name: 'Lookups (Legacy)',
    component: LegacyLookupsRedirect,
    showInSidebar: false,
  },
  {
    path: '/config/lookups',
    name: 'Configuracion',
    component: LookupsIndexPage,
    showInSidebar: false,
    sidebarGroup: 'config',
  },
  {
    path: '/rfqs',
    name: 'RFQs',
    component: RfqsPage,
    showInSidebar: true,
  },
  {
    path: '/quote-responses',
    name: 'Quote Responses',
    component: QuoteResponsesPage,
    showInSidebar: true,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: TransactionsPage,
    showInSidebar: true,
  },
  {
    path: '/geography',
    name: 'Geography',
    component: GeographyPage,
    showInSidebar: true,
  },
  {
    path: '/admins',
    name: 'Admins',
    component: AdminsPage,
    showInSidebar: true,
  },
  {
    path: '/config/lookups/:tableKey',
    name: 'Lookup Table Detail',
    component: LookupsPage,
    showInSidebar: false,
    sidebarGroup: 'config',
  },
];
