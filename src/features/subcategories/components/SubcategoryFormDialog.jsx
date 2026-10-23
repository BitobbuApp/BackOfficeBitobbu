import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/** Same rule as the backend: `<category-slug>-<name>` without accents. */
function previewSlug(categorySlug, nameEs) {
  const name = nameEs
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return categorySlug && name ? `${categorySlug}-${name}` : '';
}

/**
 * Create / edit a subcategory. Category and slug are fixed once created
 * (changing them would break what companies already selected).
 */
export default function SubcategoryFormDialog({ open, onOpenChange, category, subcategory, onSubmit, isSaving }) {
  const isEditing = !!subcategory;
  const [nameEs, setNameEs] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  useEffect(() => {
    if (!open) return;
    setNameEs(subcategory?.name_es ?? '');
    setNameEn(subcategory?.name_en ?? '');
    setSortOrder(String(subcategory?.sort_order ?? 0));
  }, [open, subcategory]);

  const slug = isEditing ? subcategory.slug : previewSlug(category?.code, nameEs);

  const handleSubmit = () => {
    const name = nameEs.trim();
    if (name.length < 2) {
      toast.error('El nombre en español es requerido (mínimo 2 caracteres)');
      return;
    }
    const order = Number(sortOrder);
    if (!Number.isInteger(order) || order < 0) {
      toast.error('El orden debe ser un número entero mayor o igual a 0');
      return;
    }

    const data = { name_es: name, name_en: nameEn.trim() || name, sort_order: order };
    onSubmit(isEditing ? data : { ...data, category_id: category.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar subcategoría' : 'Nueva subcategoría'}</DialogTitle>
          <DialogDescription>
            Categoría: <span className="font-medium text-foreground">{category?.label ?? '—'}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="subcategory-name-es">Nombre (ES) *</Label>
            <Input
              id="subcategory-name-es"
              value={nameEs}
              onChange={(event) => setNameEs(event.target.value)}
              maxLength={100}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="subcategory-name-en">Nombre (EN)</Label>
            <Input
              id="subcategory-name-en"
              value={nameEn}
              onChange={(event) => setNameEn(event.target.value)}
              placeholder="Si se deja vacío se usa el nombre en español"
              maxLength={100}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="subcategory-order">Orden</Label>
            <Input
              id="subcategory-order"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-1">
            <Label>Slug</Label>
            <p className="rounded-md border bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
              {slug || 'Se genera a partir del nombre'}
            </p>
            {isEditing && (
              <p className="text-xs text-muted-foreground">La categoría y el slug no se pueden cambiar.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
