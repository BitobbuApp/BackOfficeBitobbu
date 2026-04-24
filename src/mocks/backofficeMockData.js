export const mockAdminUsers = [
  {
    id: 'adm-1',
    email: 'admin@bitobbu.com',
    password: 'Admin123!',
    full_name: 'Mariana Ortega',
    role: 'superadmin',
    status: 'active',
  },
];

export const mockDashboardKpis = {
  total_users: 1248,
  rfqs_last_7_days: 186,
  quotes_last_7_days: 142,
  suppliers_pending_verification: 23,
};

export const mockUsers = [
  {
    id: 'cmp-001',
    company_name: 'Alimentos La Sierra, C.A.',
    trade_name: 'La Sierra',
    email: 'compras@lasierra.com',
    profile_type: 'buyer',
    registration_date: '2026-02-10T10:00:00.000Z',
    status: 'active',
    contacts: ['Ana Perez', 'Luis Mena'],
    locations: ['Caracas, VE', 'Valencia, VE'],
    payment_preferences: ['Transferencia', 'Credito 30 dias'],
  },
  {
    id: 'cmp-002',
    company_name: 'Insumos Industriales Andinos',
    trade_name: 'Insumos Andinos',
    email: 'ventas@andinos.com',
    profile_type: 'supplier',
    registration_date: '2026-01-18T12:30:00.000Z',
    status: 'suspended',
    contacts: ['Daniel Rojas'],
    locations: ['Merida, VE'],
    payment_preferences: ['Transferencia'],
  },
  {
    id: 'cmp-003',
    company_name: 'Distribuidora Integral Delta',
    trade_name: 'Delta',
    email: 'admin@delta.com',
    profile_type: 'both',
    registration_date: '2026-03-05T08:15:00.000Z',
    status: 'active',
    contacts: ['Carmen Ruiz'],
    locations: ['Maracay, VE', 'Barquisimeto, VE'],
    payment_preferences: ['Transferencia', 'Contado'],
  },
  {
    id: 'cmp-004',
    company_name: 'Ferreteria Oriente Global',
    trade_name: 'Oriente Global',
    email: 'operaciones@orienteglobal.com',
    profile_type: 'supplier',
    registration_date: '2026-02-25T15:00:00.000Z',
    status: 'active',
    contacts: ['Jose Nunez'],
    locations: ['Puerto La Cruz, VE'],
    payment_preferences: ['Transferencia'],
  },
  {
    id: 'cmp-005',
    company_name: 'Mercado Mayorista Centro',
    trade_name: 'Mayorista Centro',
    email: 'info@mayoristacentro.com',
    profile_type: 'buyer',
    registration_date: '2026-01-30T11:45:00.000Z',
    status: 'active',
    contacts: ['Ricardo Vivas'],
    locations: ['Caracas, VE'],
    payment_preferences: ['Credito 15 dias'],
  },
  {
    id: 'cmp-006',
    company_name: 'BioPack Soluciones',
    trade_name: 'BioPack',
    email: 'contacto@biopack.com',
    profile_type: 'both',
    registration_date: '2025-12-22T09:10:00.000Z',
    status: 'suspended',
    contacts: ['Marta Colina'],
    locations: ['San Cristobal, VE'],
    payment_preferences: ['Contado'],
  },
];

export const mockVerifications = [
  {
    id: 'ver-001',
    company_id: 'cmp-002',
    company_name: 'Insumos Industriales Andinos',
    tax_id: 'J-41234567-8',
    representative: 'Daniel Rojas',
    primary_contact: 'ventas@andinos.com',
    submitted_at: '2026-04-18T10:30:00.000Z',
    document_url: '#',
    status: 'pending',
  },
  {
    id: 'ver-002',
    company_id: 'cmp-004',
    company_name: 'Ferreteria Oriente Global',
    tax_id: 'J-39871234-1',
    representative: 'Jose Nunez',
    primary_contact: 'operaciones@orienteglobal.com',
    submitted_at: '2026-04-20T09:15:00.000Z',
    document_url: '#',
    status: 'pending',
  },
];

export const mockSubscriptions = [
  {
    company_id: 'cmp-001',
    company_name: 'Alimentos La Sierra, C.A.',
    plan_tier: 'Growth',
    activation_date: '2026-01-01',
    expiration_date: '2026-07-01',
    status: 'active',
  },
  {
    company_id: 'cmp-002',
    company_name: 'Insumos Industriales Andinos',
    plan_tier: 'Starter',
    activation_date: '2025-11-15',
    expiration_date: '2026-04-10',
    status: 'expired',
  },
  {
    company_id: 'cmp-003',
    company_name: 'Distribuidora Integral Delta',
    plan_tier: 'Enterprise',
    activation_date: '2026-03-01',
    expiration_date: '2027-03-01',
    status: 'active',
  },
  {
    company_id: 'cmp-004',
    company_name: 'Ferreteria Oriente Global',
    plan_tier: 'Growth',
    activation_date: '2026-02-01',
    expiration_date: '2026-08-01',
    status: 'active',
  },
];

export const mockPlans = ['Starter', 'Growth', 'Enterprise'];

export const mockPlanCatalog = [
  {
    id: 'plan-1',
    name: 'Starter',
    code: 'starter',
    price_usd_monthly: 29,
    trial_days: 7,
    max_users: 3,
    status: 'active',
  },
  {
    id: 'plan-2',
    name: 'Growth',
    code: 'growth',
    price_usd_monthly: 79,
    trial_days: 14,
    max_users: 10,
    status: 'active',
  },
  {
    id: 'plan-3',
    name: 'Enterprise',
    code: 'enterprise',
    price_usd_monthly: 199,
    trial_days: 30,
    max_users: 999,
    status: 'inactive',
  },
];

export const mockLookupTables = {
  company_types: [
    { id: 'ct-1', code: 'manufacturer', label: 'Manufacturer', is_active: true },
    { id: 'ct-2', code: 'distributor', label: 'Distributor', is_active: true },
    { id: 'ct-3', code: 'retailer', label: 'Retailer', is_active: true },
  ],
  verification_statuses: [
    { id: 'vs-1', code: 'pending', label: 'Pending', is_active: true },
    { id: 'vs-2', code: 'approved', label: 'Approved', is_active: true },
    { id: 'vs-3', code: 'rejected', label: 'Rejected', is_active: true },
  ],
  payment_terms: [
    { id: 'pt-1', code: 'cash', label: 'Cash', is_active: true },
    { id: 'pt-2', code: 'credit_15', label: 'Credit 15 Days', is_active: true },
    { id: 'pt-3', code: 'credit_30', label: 'Credit 30 Days', is_active: true },
  ],
};

export const mockRfqs = Array.from({ length: 26 }).map((_, index) => ({
  id: `rfq-${index + 1}`,
  product_service: `Producto RFQ ${index + 1}`,
  buyer_company: `Comprador ${((index % 6) + 1).toString().padStart(2, '0')}`,
  quantity: 100 + index * 5,
  unit: 'kg',
  status: ['open', 'closed', 'in_review'][index % 3],
  created_at: new Date(2026, 2, (index % 28) + 1).toISOString(),
}));

export const mockQuoteResponses = Array.from({ length: 24 }).map((_, index) => ({
  id: `qr-${index + 1}`,
  rfq_id: `rfq-${(index % 12) + 1}`,
  supplier_company: `Proveedor ${((index % 7) + 1).toString().padStart(2, '0')}`,
  price_usd: 20 + index * 1.7,
  quantity: 120 + index * 3,
  status: ['negotiating', 'accepted', 'rejected'][index % 3],
  created_at: new Date(2026, 2, (index % 28) + 1).toISOString(),
}));

export const mockTransactions = Array.from({ length: 22 }).map((_, index) => ({
  id: `trx-${index + 1}`,
  buyer_company: `Comprador ${((index % 6) + 1).toString().padStart(2, '0')}`,
  supplier_company: `Proveedor ${((index % 7) + 1).toString().padStart(2, '0')}`,
  total_amount_usd: 500 + index * 73,
  currency: 'USD',
  status: ['awaiting_payment', 'payment_review', 'in_transit', 'completed'][index % 4],
  created_at: new Date(2026, 2, (index % 28) + 1).toISOString(),
}));

export const mockCountries = [
  { id: 'country-1', code: 'VE', name: 'Venezuela', is_active: true },
  { id: 'country-2', code: 'CO', name: 'Colombia', is_active: true },
  { id: 'country-3', code: 'PA', name: 'Panama', is_active: false },
];

export const mockStates = [
  { id: 'state-1', country_code: 'VE', code: 'DC', name: 'Distrito Capital', is_active: true },
  { id: 'state-2', country_code: 'VE', code: 'MIR', name: 'Miranda', is_active: true },
  { id: 'state-3', country_code: 'VE', code: 'ZUL', name: 'Zulia', is_active: true },
  { id: 'state-4', country_code: 'CO', code: 'ANT', name: 'Antioquia', is_active: true },
  { id: 'state-5', country_code: 'PA', code: 'PAN', name: 'Panama', is_active: false },
];
