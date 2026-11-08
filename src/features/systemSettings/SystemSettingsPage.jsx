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
  useUpdateSystemSetting,
  useTestSystemSettings,
} from './hooks/useSystemSettingsData';

const GROUP_LABELS = {
  email: 'Correo (Mailgun)',
  telegram: 'Alertas (Telegram)',
  storage: 'Almacenamiento (S3/R2)',
  app: 'Aplicacion',
  limits: 'Limites',
  features: 'Funcionalidades',
};

const TESTABLE_GROUPS = ['email', 'telegram'];

function toDisplay(setting) {
  if (setting.value === null || setting.value === undefined) return '';
  return setting.type === 'json' ? JSON.stringify(setting.value) : String(setting.value);
}

function parseValue(setting, text) {
  if (setting.type === 'number') return Number(text);
  if (setting.type === 'json') {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
}

function SettingRow({ setting }) {
  const update = useUpdateSystemSetting();
  const [draft, setDraft] = useState(null);
  const [replacing, setReplacing] = useState(false);

  const editing = draft !== null;
  const reset = () => {
    setDraft(null);
    setReplacing(false);
  };
  const save = () => {
    update.mutate(
      { key: setting.key, value: parseValue(setting, draft) },
      { onSuccess: reset }
    );
  };

  return (
    <div className="flex flex-col gap-2 border-b py-3 last:border-b-0 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 md:w-1/2">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="font-mono text-xs">{setting.key}</Label>
          {setting.is_secret && <Badge variant="secondary">secreto</Badge>}
          {setting.source !== 'db' && <Badge variant="outline">valor por defecto</Badge>}
        </div>
        {setting.description && (
          <p className="text-xs text-muted-foreground">{setting.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 md:w-1/2 md:justify-end">
        {setting.type === 'boolean' ? (
          <Switch
            checked={setting.value === true}
            disabled={update.isPending}
            onCheckedChange={(checked) => update.mutate({ key: setting.key, value: checked })}
          />
        ) : setting.is_secret && !replacing ? (
          <>
            <span className="font-mono text-sm text-muted-foreground">
              {setting.value ?? 'sin definir'}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setReplacing(true);
                setDraft('');
              }}
            >
              Reemplazar
            </Button>
          </>
        ) : (
          <>
            <Input
              className="max-w-sm"
              type={setting.is_secret ? 'password' : setting.type === 'number' ? 'number' : 'text'}
              autoComplete="off"
              value={editing ? draft : toDisplay(setting)}
              onChange={(e) => setDraft(e.target.value)}
            />
            {editing && (
              <>
                <Button
                  size="sm"
                  onClick={save}
                  disabled={update.isPending || (setting.is_secret && !draft)}
                >
                  Guardar
                </Button>
                <Button size="sm" variant="ghost" onClick={reset}>
                  Cancelar
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TestPanel({ group }) {
  const test = useTestSystemSettings();
  const [to, setTo] = useState('');

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
      <span className="text-sm text-muted-foreground">Probar con los valores guardados:</span>
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
        disabled={test.isPending || (group === 'email' && !to)}
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
  const [group, setGroup] = useState('email');

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
              </button>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{GROUP_LABELS[current]}</CardTitle>
              <CardDescription>
                Los secretos se muestran enmascarados; para cambiarlos usa Reemplazar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {TESTABLE_GROUPS.includes(current) && <TestPanel group={current} />}
              {items.map((setting) => (
                <SettingRow key={setting.key} setting={setting} />
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
