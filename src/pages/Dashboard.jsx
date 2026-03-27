import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { Users, FileText, Send, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mocked fetch for now since the API endpoints might not exist yet,
// but simulating the idea of fetching paginated metadata.
const fetchTotalUsers = async () => {
  // Simulating an API call: GET /users
  return new Promise(resolve => setTimeout(() => resolve({ total: 1250 }), 500));
};

const fetchRecentRFQs = async () => {
  // Simulating an API call: GET /requests?createdAfter=...
  return new Promise(resolve => setTimeout(() => resolve({ total: 42 }), 500));
};

const fetchRecentQuotations = async () => {
  // Simulating an API call: GET /quotations?createdAfter=...
  return new Promise(resolve => setTimeout(() => resolve({ total: 156 }), 500));
};

const fetchPendingSuppliers = async () => {
  // Simulating an API call: GET /suppliers?status=pending
  return new Promise(resolve => setTimeout(() => resolve({ total: 8 }), 500));
};

export default function Dashboard() {
  const userName = "Admin"; // You can replace this with actual auth data if available

  const results = useQueries({
    queries: [
      { queryKey: ['usersTotal'], queryFn: fetchTotalUsers },
      { queryKey: ['recentRFQs'], queryFn: fetchRecentRFQs },
      { queryKey: ['recentQuotations'], queryFn: fetchRecentQuotations },
      { queryKey: ['pendingSuppliers'], queryFn: fetchPendingSuppliers },
    ]
  });

  const isLoading = results.some(result => result.isLoading);

  const metrics = {
    totalUsers: results[0].data?.total || 0,
    recentRFQs: results[1].data?.total || 0,
    recentQuotations: results[2].data?.total || 0,
    pendingSuppliers: results[3].data?.total || 0,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {userName}</h1>
        <p className="text-slate-500 mt-2">Here's an overview of your platform's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Registered Users
            </CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : metrics.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Across all roles</p>
          </CardContent>
        </Card>

        {/* RFQs Last 7 Days Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              RFQs (Last 7 Days)
            </CardTitle>
            <FileText className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : metrics.recentRFQs.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Quotation requests created</p>
          </CardContent>
        </Card>

        {/* Quotations Last 7 Days Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Quotations (Last 7 Days)
            </CardTitle>
            <Send className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : metrics.recentQuotations.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Responses sent</p>
          </CardContent>
        </Card>

        {/* Pending Suppliers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Verifications
            </CardTitle>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : metrics.pendingSuppliers.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Suppliers in queue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
