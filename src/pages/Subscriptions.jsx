import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';

const PLANS = [
  { id: 'basic', name: 'Basic Tier' },
  { id: 'pro', name: 'Pro Tier' },
  { id: 'enterprise', name: 'Enterprise' },
];

export default function Subscriptions() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Acme Corp',
      planId: 'pro',
      planName: 'Pro Tier',
      status: 'active',
      activationDate: '2023-01-15',
      expirationDate: '2025-01-15',
    },
    {
      id: 2,
      name: 'Globex Inc',
      planId: 'basic',
      planName: 'Basic Tier',
      status: 'expired',
      activationDate: '2022-05-10',
      expirationDate: '2023-05-10',
    },
    {
      id: 3,
      name: 'Initech',
      planId: 'enterprise',
      planName: 'Enterprise',
      status: 'active',
      activationDate: '2023-11-01',
      expirationDate: '2025-11-01',
    },
  ]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newPlanId, setNewPlanId] = useState('');
  const [extensionDays, setExtensionDays] = useState('');

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'expired':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleManageClick = (company) => {
    setSelectedCompany(company);
    setNewPlanId(company.planId);
    setExtensionDays('');
    setIsManageModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedCompany) return;

    let willChangePlan = newPlanId !== selectedCompany.planId;
    let willExtend = parseInt(extensionDays) > 0;

    if (!willChangePlan && !willExtend) {
      toast.info('No changes were made.');
      setIsManageModalOpen(false);
      return;
    }

    if (willChangePlan) {
      setPendingAction(() => () => applyChanges(willChangePlan, willExtend));
      setIsAlertOpen(true);
    } else {
      applyChanges(willChangePlan, willExtend);
    }
  };

  const applyChanges = (changedPlan, extended) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === selectedCompany.id) {
          let updated = { ...c };

          if (changedPlan) {
            const plan = PLANS.find(p => p.id === newPlanId);
            updated.planId = newPlanId;
            updated.planName = plan.name;
          }

          if (extended) {
            const days = parseInt(extensionDays);
            const currentDate = new Date(updated.expirationDate);
            const newDate = addDays(currentDate, days);
            updated.expirationDate = format(newDate, 'yyyy-MM-dd');

            if (newDate > new Date()) {
                updated.status = 'active';
            }
          }

          return updated;
        }
        return c;
      })
    );

    setIsManageModalOpen(false);
    toast.success('Subscription updated successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Subscriptions Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage paid memberships, extensions, and courtesy upgrades.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Plan Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Activation Date</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.planName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(company.status)}>
                    {company.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{company.activationDate}</TableCell>
                <TableCell>{company.expirationDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleManageClick(company)}>
                    Manage Plan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Manage Modal */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              Adjust {selectedCompany?.name}'s plan tier or add courtesy extension days.
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
                <div>
                  <span className="font-medium text-slate-900 block">Activation</span>
                  {selectedCompany.activationDate}
                </div>
                <div>
                  <span className="font-medium text-slate-900 block">Expiration</span>
                  {selectedCompany.expirationDate}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plan Tier</Label>
                <Select value={newPlanId} onValueChange={setNewPlanId}>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLANS.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="days">Manual Day Extension</Label>
                <Input
                  id="days"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={extensionDays}
                  onChange={(e) => setExtensionDays(e.target.value)}
                />
                <p className="text-xs text-slate-500">Inject bonus expiration days (ideal for service compensations).</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for Plan Change */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to modify the core plan tier for this company. This will affect their billing and feature access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (pendingAction) pendingAction();
            }}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
