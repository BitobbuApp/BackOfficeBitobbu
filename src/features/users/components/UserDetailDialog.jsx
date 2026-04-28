import { UserRound, MapPin, Phone, Building } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useUserDetail } from '../hooks/useUsersData';

export function UserDetailDialog({ userId, onClose }) {
  const { data: userDetail, isLoading: isLoadingDetail } = useUserDetail(userId);

  return (
    <Dialog open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Perfil de Usuario y Empresa
          </DialogTitle>
          <DialogDescription>
            Detalle completo de la cuenta y la organización asociada.
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetail ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Cargando detalles del perfil...
          </div>
        ) : userDetail ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* User Info */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2 border-b pb-2">
                <UserRound className="h-4 w-4" /> Datos de Usuario
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Nombre Completo</span>
                  <span>{userDetail.full_name || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Email</span>
                  <span>{userDetail.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Fecha de Registro</span>
                  <span>{new Date(userDetail.registration_date).toLocaleDateString('es-VE')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Estado de Cuenta</span>
                  <span>
                    <Badge variant={userDetail.status === 'active' ? 'default' : 'destructive'}>
                      {userDetail.status}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2 border-b pb-2">
                <Building className="h-4 w-4" /> Datos de la Empresa
              </h4>
              {userDetail.company ? (
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Nombre / Razón Social</span>
                    <span>{userDetail.company.trade_name || userDetail.company.company_name || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">RIF / Tax ID</span>
                    <span>{userDetail.company.tax_id || 'No registrado'}</span>
                  </div>
                  
                  {userDetail.company.locations?.length > 0 && (
                    <div className="flex flex-col mt-2">
                      <span className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                        <MapPin className="h-3 w-3" /> Ubicaciones
                      </span>
                      <ul className="list-disc pl-4 text-xs text-muted-foreground">
                        {userDetail.company.locations.map((loc) => (
                          <li key={loc.id}>
                            {loc.state?.name}, {loc.country?.name_es}
                            {loc.is_main_headquarters && ' (Principal)'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {userDetail.company.contacts?.length > 0 && (
                    <div className="flex flex-col mt-2">
                      <span className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                        <Phone className="h-3 w-3" /> Contactos
                      </span>
                      <ul className="list-disc pl-4 text-xs text-muted-foreground">
                        {userDetail.company.contacts.map((contact) => (
                          <li key={contact.id}>
                            {contact.full_name} - {contact.phone_number}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">El usuario no tiene una empresa asociada.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No se pudo cargar el perfil del usuario.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
