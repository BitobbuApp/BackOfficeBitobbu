import { UserRound, MapPin, Phone, Building, Star, Briefcase, Globe, Award, DollarSign } from 'lucide-react';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
            <div className="space-y-4 md:col-span-2">
              <h4 className="font-semibold flex items-center gap-2 border-b pb-2">
                <Building className="h-4 w-4" /> Datos de la Empresa
              </h4>
              {userDetail.company ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  
                  {/* Basic Info */}
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Razón Social</span>
                      <span className="font-medium">{userDetail.company.company_name || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Nombre Comercial</span>
                      <span>{userDetail.company.trade_name || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">RIF / Tax ID</span>
                      <span>{userDetail.company.tax_id || 'No registrado'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Año de Fundación</span>
                      <span>{userDetail.company.founding_year || 'No registrado'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Sitio Web</span>
                      <span>{userDetail.company.website ? <a href={userDetail.company.website} target="_blank" rel="noreferrer" className="text-primary underline">{userDetail.company.website}</a> : 'No registrado'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Tipo de Perfil</span>
                      <div className="flex gap-2 mt-1">
                        {userDetail.company.can_buy && <Badge variant="outline">Comprador</Badge>}
                        {userDetail.company.can_sell && <Badge variant="outline">Vendedor</Badge>}
                        {!userDetail.company.can_buy && !userDetail.company.can_sell && <span>No definido</span>}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Descripción (Bio)</span>
                      <span className="text-muted-foreground italic text-xs">{userDetail.company.bio || 'Sin descripción'}</span>
                    </div>
                  </div>

                  {/* Commercial Profile */}
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Sector Primario</span>
                      <span>{userDetail.company.sector?.name_es || 'No definido'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Tipo de Empresa</span>
                      <span>{userDetail.company.company_type?.name_es || 'No definido'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Tamaño de Empresa</span>
                      <span>{userDetail.company.company_size?.range_name || 'No definido'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Transacciones Mensuales Estimadas</span>
                      <span>{userDetail.company.monthly_transactions?.range_name || 'No definido'}</span>
                    </div>

                    {/* Subscriptions */}
                    {userDetail.company.subscriptions?.length > 0 && (
                      <div className="flex flex-col mt-2">
                        <span className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                          <Award className="h-3 w-3" /> Suscripción Actual
                        </span>
                        <span>
                          <Badge className="bg-amber-500 hover:bg-amber-600">
                            {userDetail.company.subscriptions[0].plan?.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">
                            hasta {new Date(userDetail.company.subscriptions[0].end_date).toLocaleDateString('es-VE')}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact & Geography */}
                  <div className="space-y-3">
                    {userDetail.company.locations?.length > 0 && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                          <MapPin className="h-3 w-3" /> Ubicaciones
                        </span>
                        <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                          {userDetail.company.locations.map((loc) => (
                            <li key={loc.id}>
                              <span className="font-medium text-foreground">{loc.state?.name}, {loc.country?.name_es}</span>
                              {loc.is_main_headquarters && <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0 h-4">Principal</Badge>}
                              <br />{loc.address}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {userDetail.company.contacts?.length > 0 && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                          <Phone className="h-3 w-3" /> Contactos
                        </span>
                        <ul className="list-disc pl-4 text-xs text-muted-foreground">
                          {userDetail.company.contacts.map((contact) => (
                            <li key={contact.id}>
                              {contact.full_name} <br/>
                              <span className="text-[10px]">{contact.phone_number} | {contact.email}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {userDetail.company.social_media?.length > 0 && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                          <Globe className="h-3 w-3" /> Redes Sociales
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {userDetail.company.social_media.map((sm) => (
                            <a key={sm.id} href={sm.url} target="_blank" rel="noreferrer" className="text-primary text-xs underline">
                              {sm.platform}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Categories & Operations */}
                  <div className="space-y-3">
                    {userDetail.company.categories_of_interest?.length > 0 && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                          <Star className="h-3 w-3" /> Categorías de Interés
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {userDetail.company.categories_of_interest.map((cat) => (
                            <Badge key={cat.id} variant="secondary" className="font-normal">{cat.category?.name_es}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {userDetail.company.payment_methods?.length > 0 && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                          <DollarSign className="h-3 w-3" /> Métodos de Pago
                        </span>
                        <ul className="list-disc pl-4 text-xs text-muted-foreground">
                          {userDetail.company.payment_methods.map((pm) => (
                            <li key={pm.id}>{pm.method?.name_es}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

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
