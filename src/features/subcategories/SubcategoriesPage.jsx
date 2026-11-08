import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SubcategoriesTable from './components/SubcategoriesTable';
import SubcategoryFormDialog from './components/SubcategoryFormDialog';
import DeactivateSubcategoryDialog from './components/DeactivateSubcategoryDialog';
import {
  useCategoriesOptions,
  useCreateSubcategory,
  useSubcategoriesList,
  useUpdateSubcategory,
  useUpdateSubcategoryStatus,
} from './hooks/useSubcategoriesData';

/** Subcategories of each category: create, edit, activate / deactivate (never delete). */
export default function SubcategoriesPage() {
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesOptions();
  const [categoryId, setCategoryId] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  // Select the first category once they load
  useEffect(() => {
    if (!categoryId && categories.length > 0) setCategoryId(String(categories[0].id));
  }, [categories, categoryId]);

  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === categoryId) ?? null,
    [categories, categoryId]
  );

  const { data: subcategories = [], isLoading, isError } = useSubcategoriesList(categoryId ? Number(categoryId) : null);
  const createMutation = useCreateSubcategory();
  const updateMutation = useUpdateSubcategory();
  const statusMutation = useUpdateSubcategoryStatus();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (subcategory) => {
    setEditing(subcategory);
    setEditorOpen(true);
  };

  const handleSubmit = (data) => {
    const options = { onSuccess: () => setEditorOpen(false) };
    if (editing) updateMutation.mutate({ id: editing.id, data }, options);
    else createMutation.mutate(data, options);
  };

  // Deactivating asks for confirmation (companies may use it); activating is immediate
  const handleToggleStatus = (subcategory) => {
    if (subcategory.is_active) setDeactivateTarget(subcategory);
    else statusMutation.mutate({ id: subcategory.id, is_active: true });
  };

  const confirmDeactivate = () => {
    statusMutation.mutate(
      { id: deactivateTarget.id, is_active: false },
      { onSuccess: () => setDeactivateTarget(null) }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Subcategorías</h1>
          <p className="text-sm text-muted-foreground">
            Segundo nivel de las categorías. Las empresas eligen con cuáles trabajan. No se eliminan: se desactivan.
          </p>
        </div>
        <Button onClick={openCreate} disabled={!selectedCategory}>Nueva subcategoría</Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Label className="whitespace-nowrap">Categoría:</Label>
        <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoadingCategories}>
          <SelectTrigger className="w-full sm:w-72">
            <SelectValue placeholder={isLoadingCategories ? 'Cargando...' : 'Selecciona una categoría'} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.label}{category.is_active === false ? ' (inactiva)' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error al cargar las subcategorías.
        </div>
      ) : (
        <SubcategoriesTable
          subcategories={subcategories}
          isLoading={isLoading}
          hasCategory={!!selectedCategory}
          onEdit={openEdit}
          onToggleStatus={handleToggleStatus}
          isUpdatingStatus={statusMutation.isPending}
        />
      )}

      <SubcategoryFormDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        category={selectedCategory}
        subcategory={editing}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />

      <DeactivateSubcategoryDialog
        subcategory={deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        onConfirm={confirmDeactivate}
        isSaving={statusMutation.isPending}
      />
    </div>
  );
}
