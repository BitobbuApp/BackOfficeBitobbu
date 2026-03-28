import React, { useState, useMemo, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import { MoreHorizontal, Search } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { toast } from "sonner"

// Mock Data
const mockUsers = [
  { id: 1, companyName: "Acme Corp", email: "contact@acme.com", profileType: "Buyer", registrationDate: "2023-01-15", status: "Active" },
  { id: 2, companyName: "Global Tech", email: "info@globaltech.io", profileType: "Supplier", registrationDate: "2023-03-22", status: "Suspended" },
  { id: 3, companyName: "Stark Industries", email: "tony@stark.com", profileType: "Both", registrationDate: "2023-05-10", status: "Active" },
  { id: 4, companyName: "Wayne Enterprises", email: "bruce@wayne.com", profileType: "Buyer", registrationDate: "2023-08-05", status: "Active" },
  { id: 5, companyName: "Daily Bugle", email: "jj@bugle.com", profileType: "Supplier", registrationDate: "2023-11-12", status: "Active" },
  { id: 6, companyName: "Oscorp", email: "norman@oscorp.com", profileType: "Both", registrationDate: "2024-01-02", status: "Suspended" },
]

// Custom hook for debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function Users() {
  const [data, setData] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [accountTypeFilter, setAccountTypeFilter] = useState("All")

  // Sheet State
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Alert Dialog State
  const [userToToggleStatus, setUserToToggleStatus] = useState(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchesSearch =
        user.companyName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

      const matchesType = accountTypeFilter === "All" || user.profileType === accountTypeFilter

      return matchesSearch && matchesType
    })
  }, [data, debouncedSearchQuery, accountTypeFilter])

  const handleViewProfile = (user) => {
    setSelectedUser(user)
    setIsSheetOpen(true)
  }

  const handleToggleStatusPrompt = (user) => {
    setUserToToggleStatus(user)
    setIsAlertOpen(true)
  }

  const handleConfirmToggleStatus = () => {
    if (userToToggleStatus) {
      const newStatus = userToToggleStatus.status === 'Active' ? 'Suspended' : 'Active'

      // Simulate API call
      setData(prevData => prevData.map(u =>
        u.id === userToToggleStatus.id ? { ...u, status: newStatus } : u
      ))

      toast.success(`Cuenta ${newStatus === 'Active' ? 'reactivada' : 'suspendida'} exitosamente.`)
      setIsAlertOpen(false)
      setUserToToggleStatus(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">
          Administra todas las cuentas de la plataforma Bitobbu.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre o email..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:max-w-[200px]">
          <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Cuenta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todos</SelectItem>
              <SelectItem value="Buyer">Comprador</SelectItem>
              <SelectItem value="Supplier">Proveedor</SelectItem>
              <SelectItem value="Both">Ambos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre / Razón Social</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.companyName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.profileType}</TableCell>
                  <TableCell>{new Date(user.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                          Ver Perfil Completo
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleStatusPrompt(user)}>
                          {user.status === 'Active' ? 'Suspender Cuenta' : 'Reactivar Cuenta'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Profile Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Perfil de Usuario</SheetTitle>
            <SheetDescription>
              Detalles exhaustivos de la empresa y contactos.
            </SheetDescription>
          </SheetHeader>

          {selectedUser && (
            <div className="py-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Información de la Empresa</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Razón Social</span>
                    <span className="font-medium">{selectedUser.companyName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Perfil</span>
                    <span className="font-medium">{selectedUser.profileType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Estado</span>
                    <Badge variant={selectedUser.status === 'Active' ? 'default' : 'destructive'} className="mt-1">
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Fecha de Registro</span>
                    <span className="font-medium">{new Date(selectedUser.registrationDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Contacto Principal</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Email</span>
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Teléfono</span>
                    <span className="font-medium">+1 234 567 8900</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Ubicaciones Registradas</h3>
                <div className="space-y-2 text-sm border p-3 rounded-md">
                  <span className="font-medium block">Sede Principal</span>
                  <span className="text-muted-foreground">123 Tech Avenue, Silicon Valley, CA, USA</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Preferencias de Pago</h3>
                <div className="text-sm">
                  <span className="text-muted-foreground block">Método Principal</span>
                  <span className="font-medium">Transferencia Bancaria (Wire)</span>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggleStatus?.status === 'Active'
                ? "Esta acción suspenderá la cuenta del usuario. No podrá acceder a la plataforma hasta que sea reactivada."
                : "Esta acción reactivará la cuenta del usuario. Recuperará su acceso normal a la plataforma."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggleStatus} className={userToToggleStatus?.status === 'Active' ? "bg-red-600 hover:bg-red-700" : ""}>
              {userToToggleStatus?.status === 'Active' ? "Suspender" : "Reactivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
