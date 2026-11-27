import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/AuthContext';
import {
  useSystemSettings,
  useUpdateSystemSettings,
  useTestSystemSettings,
} from './hooks/useSystemSettingsData';

const GROUP_LABELS = {
  email: 'Correo (Mailgun)',
  telegram: 'Alertas (Telegram)',
  storage: 'Almacenamiento (S3/R2)',
  app: 'Aplicacion',
  limits: 'Limites',
  features: 'Funcionalidades',
  plans: 'Planes',
  payments: 'Pagos (pago movil)',
  marketing: 'Marketing y Analítica (Meta CAPI)',
};

const TESTABLE_GROUPS = ['email', 'telegram', 'marketing'];

function toDisplay(setting) {
  if (setting.value === null || setting.value === undefined) return '';
  return setting.type === 'json' ? JSON.stringify(setting.value) : String(setting.value);
}

function parseValue(setting, raw) {
  if (setting.type === 'boolean') return raw;
  if (setting.type === 'number') return raw === '' ? raw : Number(raw);
  if (setting.type === 'json') {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

/** One field of the group form. Values live in the page-level draft until "Guardar cambios". */
function SettingField({ setting, draft, onChange }) {
  const changed = draft !== undefined;
  const [replacing, setReplacing] = useState(false);

  return (
    <div className="flex flex-col gap-2 border-b py-3 last:border-b-0 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 md:w-1/2">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="font-mono text-xs">{setting.key}</Label>
          {setting.is_secret && <Badge variant="secondary">secreto</Badge>}
          {setting.source !== 'db' && <Badge variant="outline">valor por defecto</Badge>}
          {changed && <Badge>modificado</Badge>}
        </div>
        {setting.description && (
          <p className="text-xs text-muted-foreground">{setting.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 md:w-1/2 md:justify-end">
        {setting.type === 'boolean' ? (
          <Switch
            checked={changed ? draft : setting.value === true}
            onCheckedChange={(checked) => onChange(checked === (setting.value === true) ? undefined : checked)}
          />
        ) : setting.is_secret && !replacing && !changed ? (
          <>
            <span className="font-mono text-sm text-muted-foreground">{setting.value ?? 'sin definir'}</span>
            <Button size="sm" variant="outline" onClick={() => setReplacing(true)}>
              Reemplazar
            </Button>
          </>
        ) : (
          <>
            <Input
              className="max-w-sm"
              type={setting.is_secret ? 'password' : setting.type === 'number' ? 'number' : 'text'}
              autoComplete="off"
              placeholder={setting.is_secret ? 'Nuevo valor' : undefined}
              value={changed ? draft : setting.is_secret ? '' : toDisplay(setting)}
              onChange={(e) => {
                const raw = e.target.value;
                // Back to the saved value (or an empty secret) means "no change".
                onChange(raw === (setting.is_secret ? '' : toDisplay(setting)) ? undefined : raw);
              }}
            />
            {setting.is_secret && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplacing(false);
                  onChange(undefined);
                }}
              >
                Cancelar
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TestPanel({ group, disabled }) {
  const test = useTestSystemSettings();
  const [to, setTo] = useState('');

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
      <span className="text-sm text-muted-foreground">
        {disabled ? 'Guarda los cambios para probar con los nuevos valores.' : 'Probar con los valores guardados:'}
      </span>
      {group === 'email' && (
        <Input
          className="max-w-xs"
          placeholder="correo@destino.com"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      )}
      <Button
        size="sm"
        variant="outline"
        disabled={disabled || test.isPending || (group === 'email' && !to)}
        onClick={() => test.mutate({ group, payload: group === 'email' ? { to } : {} })}
      >
        Enviar prueba
      </Button>
    </div>
  );
}

export default function SystemSettingsPage() {
  const { admin } = useAuth();
  const isSuperadmin = admin?.role === 'superadmin';
  const { data = [], isLoading, isError } = useSystemSettings(isSuperadmin);
  const update = useUpdateSystemSettings();
  const [group, setGroup] = useState('email');
  // key -> pending raw value; only keys the admin touched are present.
  const [drafts, setDrafts] = useState({});
  // Remounts the fields after save/discard so "Reemplazar" states reset.
  const [formVersion, setFormVersion] = useState(0);

  if (!isSuperadmin) {
    return (
      <p className="text-sm text-muted-foreground">
        Solo un superadmin puede ver la configuracion del sistema.
      </p>
    );
  }

  const groups = Object.keys(GROUP_LABELS).filter((g) => data.some((s) => s.group === g));
  const current = groups.includes(group) ? group : groups[0];
  const items = data.filter((s) => s.group === current);
  const dirtyKeys = Object.keys(drafts);
  const dirtyInGroup = items.filter((s) => s.key in drafts).length;
  const dirtyByGroup = (g) => data.filter((s) => s.group === g && s.key in drafts).length;

  const setDraft = (key, value) =>
    setDrafts((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[key];
      else next[key] = value;
      return next;
    });

  const discard = () => {
    setDrafts({});
    setFormVersion((v) => v + 1);
  };

  const save = () => {
    const byKey = Object.fromEntries(data.map((s) => [s.key, s]));
    const values = Object.fromEntries(dirtyKeys.map((key) => [key, parseValue(byKey[key], drafts[key])]));
    update.mutate(values, { onSuccess: discard });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Configuracion del sistema</h1>
        <p className="text-sm text-muted-foreground">
          Los cambios se aplican sin reiniciar el servidor. Las variables de arranque (base de
          datos, Redis, claves JWT) siguen en el entorno.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
      {isError && <p className="text-sm text-destructive">No se pudo cargar la configuracion.</p>}

      {!isLoading && !isError && (
        <>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  g === current
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {GROUP_LABELS[g]}
                {dirtyByGroup(g) > 0 && ` (${dirtyByGroup(g)})`}
              </button>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{GROUP_LABELS[current]}</CardTitle>
              <CardDescription>
                Edita los campos que necesites y guarda todo junto. Los secretos se muestran
                enmascarados; para cambiarlos usa Reemplazar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {TESTABLE_GROUPS.includes(current) && <TestPanel group={current} disabled={dirtyInGroup > 0} />}
              {items.map((setting) => (
                <SettingField
                  key={`${setting.key}-${formVersion}`}
                  setting={setting}
                  draft={drafts[setting.key]}
                  onChange={(value) => setDraft(setting.key, value)}
                />
              ))}
            </CardContent>
          </Card>

          <div className="sticky bottom-0 flex flex-col gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted-foreground">
              {dirtyKeys.length
                ? `${dirtyKeys.length} cambio(s) sin guardar${dirtyKeys.length > dirtyInGroup ? ' (incluye otras pestañas)' : ''}`
                : 'Sin cambios pendientes'}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={discard} disabled={!dirtyKeys.length || update.isPending}>
                Descartar
              </Button>
              <Button onClick={save} disabled={!dirtyKeys.length || update.isPending}>
                {update.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
