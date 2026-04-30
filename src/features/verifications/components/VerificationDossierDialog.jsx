import { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCompanyDocuments, useApproveVerification, useRejectVerification } from '../hooks/useVerificationsData';

export function VerificationDossierDialog({ verification, onClose }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');

  const { data: documents, isLoading } = useCompanyDocuments(verification?.company_id);
  const { mutate: approveMutation, isPending: isApproving } = useApproveVerification();
  const { mutate: rejectMutation, isPending: isRejecting } = useRejectVerification();

  const handleApprove = () => {
    approveMutation(verification.company_id, {
      onSuccess: () => onClose(),
    });
  };

  const handleReject = () => {
    if (!reason.trim()) return;
    rejectMutation(
      { id: verification.company_id, data: { reason } },
      {
        onSuccess: () => {
          setRejectOpen(false);
          setReason('');
          onClose();
        },
      }
    );
  };

  const isPending = isApproving || isRejecting;

  return (
    <Dialog open={!!verification} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Dossier de Verificación
          </DialogTitle>
          <DialogDescription>
            Revisión manual de los documentos provistos por la empresa.
          </DialogDescription>
        </DialogHeader>

        {verification && (
          <div className="space-y-6 mt-4">
            {/* Company Info Header */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm border">
              <p>
                <span className="font-semibold">Empresa:</span>{' '}
                {verification.legal_name || verification.trade_name || 'Sin nombre registrado'}
              </p>
              <p>
                <span className="font-semibold">RIF / Tax ID:</span> {verification.tax_id || 'No provisto'}
              </p>
              <p>
                <span className="font-semibold">Documentos Subidos:</span> {verification.document_count} documento(s)
              </p>
            </div>

            {/* Documents List */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2 border-b pb-2">
                <FileText className="h-4 w-4" /> Documentos Adjuntos
              </h4>
              
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Cargando documentos...</p>
              ) : documents && documents.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between border p-3 rounded-md bg-card gap-3">
                      <div>
                        <p className="font-medium text-sm">{doc.type.name_es}</p>
                        <p className="text-xs text-muted-foreground">
                          Subido: {new Date(doc.created_at).toLocaleDateString('es-VE')}
                        </p>
                        {doc.status === 'rejected' && (
                          <Badge variant="destructive" className="mt-1 flex items-center gap-1 w-max text-[10px]">
                            <XCircle className="h-3 w-3" /> Rechazado
                          </Badge>
                        )}
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Ver Documento
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  La empresa no ha subido ningún documento.
                </p>
              )}
            </div>

            {/* Action Area */}
            {rejectOpen ? (
              <div className="space-y-3 pt-4 border-t border-destructive/20 bg-destructive/5 p-4 rounded-lg">
                <h4 className="font-semibold text-destructive text-sm">Motivo de Rechazo</h4>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explique qué documentos faltan o están incorrectos..."
                  disabled={isPending}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setRejectOpen(false)} disabled={isPending}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleReject} disabled={isPending || !reason.trim()}>
                    {isRejecting ? 'Rechazando...' : 'Confirmar Rechazo'}
                  </Button>
                </div>
              </div>
            ) : (
              <DialogFooter className="pt-4 border-t">
                <Button variant="outline" onClick={() => setRejectOpen(true)} disabled={isPending}>
                  Rechazar
                </Button>
                <Button onClick={handleApprove} disabled={isPending}>
                  {isApproving ? 'Aprobando...' : 'Aprobar Empresa'}
                </Button>
              </DialogFooter>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
