import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/** Confirmation before deactivating: shows how many companies use the subcategory. */
export default function DeactivateSubcategoryDialog({ subcategory, onOpenChange, onConfirm, isSaving }) {
  const companies = subcategory?.company_count ?? 0;

  return (
    <AlertDialog open={!!subcategory} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desactivar “{subcategory?.name_es}”?</AlertDialogTitle>
          <AlertDialogDescription>
            {companies > 0
              ? `${companies} ${companies === 1 ? 'empresa la tiene' : 'empresas la tienen'} seleccionada. `
              : 'Ninguna empresa la tiene seleccionada. '}
            Dejará de mostrarse en la app, pero no se elimina ni se pierde el vínculo con las empresas:
            si la vuelves a activar, reaparecerá en sus perfiles.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSaving}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Desactivar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
