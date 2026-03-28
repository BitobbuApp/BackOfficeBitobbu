import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const MOCK_SUPPLIERS = [
  {
    id: "1",
    companyName: "Acme Corp",
    taxId: "J-12345678-9",
    legalRep: "John Doe",
    contactEmail: "contact@acme.com",
    contactPhone: "+1 555-0100",
    status: "Pending",
    documentUrl: "https://example.com/doc1.pdf",
    submittedAt: "2023-10-25T10:00:00Z",
  },
  {
    id: "2",
    companyName: "Globex Corporation",
    taxId: "J-98765432-1",
    legalRep: "Jane Smith",
    contactEmail: "hello@globex.com",
    contactPhone: "+1 555-0200",
    status: "Pending",
    documentUrl: "https://example.com/doc2.pdf",
    submittedAt: "2023-10-26T14:30:00Z",
  },
  {
    id: "3",
    companyName: "Initech",
    taxId: "J-45678912-3",
    legalRep: "Bill Lumbergh",
    contactEmail: "mgmt@initech.com",
    contactPhone: "+1 555-0300",
    status: "Pending",
    documentUrl: "https://example.com/doc3.pdf",
    submittedAt: "2023-10-27T09:15:00Z",
  },
];

export function Verifications() {
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Rejection state
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Approval state
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  const pendingSuppliers = suppliers.filter((s) => s.status === "Pending");

  const openDossier = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDossierOpen(true);
  };

  const handleApprove = () => {
    // PATCH /companies/:id/verify equivalent
    setSuppliers((prev) =>
      prev.map((s) => (s.id === selectedSupplier.id ? { ...s, status: "Verified" } : s))
    );
    setIsApproveOpen(false);
    setIsDossierOpen(false);
    setSelectedSupplier(null);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;

    // Submit rejection reason to backend equivalent
    setSuppliers((prev) =>
      prev.map((s) => (s.id === selectedSupplier.id ? { ...s, status: "Rejected", rejectReason } : s))
    );

    setRejectReason("");
    setIsRejectOpen(false);
    setIsDossierOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Verifications Queue</h1>
        <Badge variant="secondary" className="text-sm">
          {pendingSuppliers.length} Pending
        </Badge>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Tax ID</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No pending verifications.
                </TableCell>
              </TableRow>
            ) : (
              pendingSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.companyName}</TableCell>
                  <TableCell>{supplier.taxId}</TableCell>
                  <TableCell>{new Date(supplier.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openDossier(supplier)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDossierOpen} onOpenChange={setIsDossierOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Supplier Dossier</DialogTitle>
            <DialogDescription>
              Review the legal and contact information to verify this supplier.
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Company Name:</span>
                <span className="col-span-3 text-sm">{selectedSupplier.companyName}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Tax ID / RIF:</span>
                <span className="col-span-3 text-sm">{selectedSupplier.taxId}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Legal Rep:</span>
                <span className="col-span-3 text-sm">{selectedSupplier.legalRep}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Contact Email:</span>
                <span className="col-span-3 text-sm">{selectedSupplier.contactEmail}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Contact Phone:</span>
                <span className="col-span-3 text-sm">{selectedSupplier.contactPhone}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Document:</span>
                <span className="col-span-3 text-sm">
                  <a
                    href={selectedSupplier.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Registration Document
                  </a>
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="destructive" onClick={() => setIsRejectOpen(true)}>
              Reject
            </Button>
            <Button variant="default" onClick={() => setIsApproveOpen(true)}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Alert Dialog */}
      <AlertDialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Supplier?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark {selectedSupplier?.companyName} as verified and grant them the Verified Bitobbu badge.
              Do you wish to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>Confirm Approval</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Supplier Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting the verification of {selectedSupplier?.companyName}. This feedback will be shared with them.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="E.g. The document uploaded is not readable or missing signature..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
              Submit Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
