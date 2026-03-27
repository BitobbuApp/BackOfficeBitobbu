# BITOBBU — Panel Superadministrador
## Alcance de Fase 1 (MVP)

**Fecha:** Marzo 2026
**Preparado por:** Equipo de Desarrollo
**Dirigido a:** Equipo directivo y stakeholders no técnicos

---

## 1. Resumen Ejecutivo

Se revisó el documento completo de especificaciones del Superadministrador (12 secciones, más de 60 funcionalidades). Tras un análisis de prioridad operativa real, se determinó que **9 bloques funcionales son necesarios para operar la primera versión**, incluyendo el sistema de chat en tiempo real (WebSocket) y la gestión de planes y suscripciones.

El resto se construirá en fases posteriores, cuando exista volumen de usuarios que justifique herramientas de moderación y análisis avanzado.

**Tiempo estimado de desarrollo: aproximadamente 48 horas.**

---

## 2. ¿Qué incluye la Fase 1?

### 2.1 Panel de indicadores

Un dashboard con 4 números clave que permiten ver el estado de la plataforma de un vistazo:

| Indicador | ¿Para qué sirve? |
|---|---|
| Usuarios registrados | Saber cuántas empresas hay y qué rol tienen (comprador, proveedor o ambos) |
| Solicitudes de cotización esta semana | Medir la demanda activa — ¿los compradores están usando la plataforma? |
| Cotizaciones enviadas esta semana | Medir la oferta activa — ¿los proveedores están respondiendo? |
| Proveedores pendientes de verificación | Cola de trabajo del admin — ¿hay proveedores esperando aprobación? |

### 2.2 Gestión de usuarios

Poder ver, buscar y administrar las cuentas registradas:

- **Listado de usuarios** con filtros por tipo (comprador/proveedor/ambos) y estado (activo/suspendido)
- **Buscador** por nombre o correo electrónico
- **Ver perfil completo** de cualquier usuario: datos de empresa, tipo, fecha de registro
- **Suspender una cuenta** cuando sea necesario (con motivo)
- **Reactivar una cuenta** suspendida

### 2.3 Verificación de proveedores

El proceso de otorgar el sello "Bitobbu Verificado":

- **Ver la cola** de proveedores que solicitaron verificación, ordenados por fecha
- **Aprobar** un proveedor tras revisar su documentación
- **Rechazar** con motivo obligatorio (el proveedor puede corregir y volver a solicitar)

### 2.4 Chat en tiempo real

Sistema de mensajería entre compradores y proveedores, esencial para la negociación:

- **Conversaciones en tiempo real** mediante tecnología WebSocket (los mensajes llegan instantáneamente sin recargar la página)
- **Historial de conversaciones** con búsqueda
- **Envío de archivos adjuntos** (cuando el servicio de almacenamiento esté disponible)
- **Indicador de mensajes no leídos** en la navegación

### 2.5 Gestión de planes y suscripciones

Herramientas para administrar los planes de los usuarios:

- **Ver el plan actual** de cualquier usuario (tipo de plan, fecha de inicio, fecha de vencimiento)
- **Cambiar plan manualmente** — útil para cortesías comerciales, soporte o correcciones
- **Extender vencimiento** — agregar días adicionales sin cambiar el tipo de plan
- **Historial de cambios** — registro de todos los cambios con fecha y responsable

### 2.6 Acceso de administrador

- **Login exclusivo** para el equipo interno, separado del login de usuarios
- Un solo nivel de acceso por ahora (administrador con acceso completo)

---

## 3. ¿Qué NO incluye la Fase 1 y por qué?

| Funcionalidad | Razón para diferir |
|---|---|
| Eliminar cuentas | Acción irreversible. Requiere primero un sistema de auditoría que registre quién lo hizo |
| Entrar como un usuario (impersonación) | Funcionalidad sensible. Necesita log de auditoría obligatorio |
| Moderación de chats desde el admin | El admin podrá leer chats en modo lectura en una fase posterior |
| Reportes y denuncias entre usuarios | Sin volumen de usuarios no hay reportes que gestionar |
| Análisis avanzado (Looker Studio) | Se necesitan datos históricos primero |
| Gestión dinámica de categorías y ciudades | Actualmente se manejan desde configuración técnica, no requieren panel |
| Emails transaccionales | No hay sistema de emails implementado |
| Métricas avanzadas de proveedores | Se activa cuando haya suficientes transacciones |

---

## 4. Fases futuras

### Fase 2 — Cuando haya primeros usuarios activos
- Log de auditoría (registro de todas las acciones del admin)
- Sistema de reportes y denuncias
- Moderación de contenido (solicitudes, cotizaciones)
- Impersonación (con registro obligatorio)
- Eliminación de cuentas

### Fase 3 — Cuando haya escala
- Configuración dinámica de la plataforma (categorías, ciudades, feature flags)
- Integración con herramientas de análisis (Looker Studio)
- Exportación de datos
- Emails transaccionales configurables

---

## 5. Cronograma estimado

| Componente | Tiempo estimado |
|---|---|
| Login de administrador | 4 horas |
| Panel de indicadores (4 métricas) | 6 horas |
| Listado de usuarios con búsqueda y filtros | 6 horas |
| Vista de perfil de usuario | 3 horas |
| Suspender / Reactivar cuentas | 2 horas |
| Cola de verificación de proveedores | 5 horas |
| Aprobar / Rechazar verificación | 2 horas |
| Chat en tiempo real (WebSocket server + frontend) | 14 horas |
| Gestión de planes y suscripciones | 6 horas |
| **Total** | **~48 horas** |

---

*Bitobbu © 2026 — Documento interno*
