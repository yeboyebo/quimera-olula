# Migración de permisos legacy sanhigia → `puede()`

## Contexto

- `ACL.can(regla)` en legacy resuelve alias funcionales definidos en `index.ts` (capa de `rules`) y los traduce a permisos técnicos de backend mediante `check(token)`.
- `puede(regla)` en `@olula/lib/dominio.ts` lee directamente `whoami.permisos` del `localStorage` y evalúa por `id_regla` con herencia por jerarquía de puntos.
- El endpoint `whoami` de sanhigia ya devuelve `permisos: Permiso[]` con la estructura correcta.
- `ACL.can` en `legacy/libs/core/lib/ACL.js` ya apunta a `puede` desde este cambio.

---

## Tabla de mapeo de reglas (formato legacy → nuevo)

| Token legacy (check) | Nueva regla (`puede`) |
|---|---|
| `ss_tratos` | `crm.trato` |
| `ss_tratos/borrar_trato` | `crm.trato.borrar` |
| `ss_tratos/delete` | `crm.trato.borrar` |
| `ss_tratos/get` | `crm.trato.leer` |
| `ss_tratos/patch` | `crm.trato.cambiar` |
| `ss_tratos/post` | `crm.trato.crear` |
| `ss_tratos/supervisor_ss` | `crm.trato.supervisor` |
| `sh_informes` | `crm.informes` |
| `sh_informes/marketing` | `crm.informe.marketing` |
| `sh_informes/todos_los_agentes` | `crm.informe.todos` |
| `sh_preparaciondepedidos` | `almacen.preparacion_salida` |
| `contactos/revisar_contacto` | `crm.contacto.cambiar` |
| `contactos` / `crm_contactos` | `crm.contacto` |
| `crm_contactos/post` | `crm.contacto.crear` |
| `crm_contactos/delete` | `crm.contacto.borrar` |
| `crm_contactos/patch` | `crm.contacto.cambiar` |
| `clientes/acceso_clientes` | `ventas.cliente.leer` |
| `clientes/get` | `ventas.cliente.leer` |
| `clientes/post` | `ventas.cliente.crear` |
| `clientes/patch` | `ventas.cliente.cambiar` |
| `clientes/delete` | `ventas.cliente.borrar` |
| `clientes` | `ventas.cliente` |
| `ss_campanias` | `crm.campana` |
| `ss_campanias/post` | `crm.campana.crear` |
| `ss_campanias/patch` | `crm.campana.cambiar` |
| `ss_campanias/delete` | `crm.campana.borrar` |
| `ss_campanias/lead_pacientes` | `crm.campana_lead_pacientes` |
| `ss_recomendaciones` | `crm.recomendacion` |
| `ss_recomendaciones/todos_los_clientes` | `crm.recomendacion.todos_los_clientes` |
| `ss_tareas` | `crm.tarea` |
| `ss_tareas/get` | `crm.tarea.leer` |
| `ss_tareas/post` | `crm.tarea.crear` |
| `ss_tareas/patch` | `crm.tarea.cambiar` |
| `ss_tareas/delete` | `crm.tarea.borrar` |
| `ss_tipostrato` | `crm.tipotrato` |
| `ss_tipostrato/get` | `crm.tipotrato.leer` |
| `articulos` | `almacen.articulo` |
| `articulos/post` | `almacen.articulo.crear` |
| `articulos/patch` | `almacen.articulo.cambiar` |
| `articulos/delete` | `almacen.articulo.borrar` |
| `articulos/acceso_caducidad` | `almacen.articulo.leer_caducidad` |
| `stocks` | `almacen.stock` |
| `stocks/get` | `almacen.stock.leer` |
| `inventarios` | `almacen.inventario` |
| `inventarios/post` | `almacen.inventario.crear` |
| `inventarios/patch` | `almacen.inventario.cambiar` |
| `inventarios/delete` | `almacen.inventario.borrar` |
| `pedidoscli` | `ventas.pedido` |
| `pedidoscli/post` | `ventas.pedido.crear` |
| `pedidoscli/patch` | `ventas.pedido.cambiar` |
| `pedidoscli/delete` | `ventas.pedido.borrar` |
| `albaranescli` | `ventas.albaran` |
| `facturascli` | `ventas.factura` |
| `presupuestoscli` | `ventas.presupuesto` |
| `general` | `general` |
| `crm.curso.asociar_contacto` | `crm.curso.asociar_contacto` |

---

### Archivos UI — sin cambios

Los UI files conservan sus llamadas `ACL.can(...)` intactas. Al haber cambiado `ACL.can = puede` en `ACL.js`, ya delegan automáticamente en `puede` sin necesidad de tocarlos.

---

## Pendientes — no sustituidos

### Motivo: regla sin sustitución definida

| Archivo | Rule |
|---|---|
| `smartsales/static/appmenu.js` | `TratosFarma:visit` |
| `smartsales/static/appmenu.js` | `OnlyAdmin:visit` |
| `devol_pedidos/static/appmenu.js` | `OnlyAdmin:visit` |

### Motivo: `farma/acceso_tratos` sin mapeo en la tabla

| Archivo | Llamada |
|---|---|
| `smartsales/comps/EstadoTratoComp.jsx` L79 | `ACL.can("TratosFarma:visit")` |
| `smartsales/views/EstadoTrato/EstadoTrato.ctrl.js` L492 | `ACL.can("TratosFarma:visit")` |
| `smartsales/static/schemas.js` L167, L256, L325, L395 | `ACL.can("TratosFarma:visit")` |
| `index.ts` alias `TratosFarma:visit` | `check("farma/acceso_tratos")` — sin mapeo |

### Motivo: regla dinámica, no mapeable estáticamente

| Archivo | Llamada |
|---|---|
| `smartsales/views/Container/Container.ui.jsx` L19 | `` ACL.can(`${value.view}:visit`) `` |

### Reglas comentadas (no activas)

Estas reglas aparecen comentadas en `appmenu.js`, por lo que no afectan en runtime mientras sigan comentadas:

| Archivo | Rule comentada |
|---|---|
| `smartsales/static/appmenu.js` | `incidencias:acceso` |
| `almacen/static/appmenu.js` | `articulos:acceso_caducidad` |
| `devol_pedidos/static/appmenu.js` | `ss_informes:visit`, `articulos:acceso_caducidad` |

---

## Notas de comportamiento

- Las reglas sin datos en `whoami.permisos` (ej. `farma/acceso_tratos`) devuelven `true` por defecto en `puede()`, igual que el comportamiento anterior de `dynamicCan`.
- El componente `<Can rule="...">` del core legacy sigue usando `ACL.can` internamente, que ahora delega en `puede`. Las reglas pasadas como prop deben ser reglas técnicas directas (no aliases como `Dashboard:visit`), o bien existir en `whoami.permisos`.
