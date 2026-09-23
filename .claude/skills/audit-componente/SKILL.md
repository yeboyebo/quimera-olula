---
name: audit-componente
description: |
  Audita componentes UI en las tres capas del monorepo: comunes y transversales
  (packages/componentes/src/), propios de un contexto (packages/contextos/src/<contexto>/**/componentes/)
  y específicos de una aplicación (apps/<app>/src/**/componentes/). Verifica cuatro dimensiones:
  ubicación en la capa correcta, consistencia estructural y de nomenclatura, UI/UX y accesibilidad,
  y calidad de código general.
  Detecta la categoría del componente (átomo, molécula, feature/dominio complejo, componente de
  contexto, componente de app) y aplica las verificaciones correspondientes.
  Produce un informe con desviaciones y recomienda: alinear el componente, reubicarlo,
  actualizar la convención, o aceptar como extensión de dominio.

  <example>
  user: "/audit-componente packages/componentes/src/arbol_documentos packages/componentes/src/gestor_documentos packages/componentes/src/lista_documentos"
  assistant: Determina que los tres son componentes de feature/dominio complejos, lee sus ficheros, ejecuta las dimensiones de verificación y genera un informe consolidado por componente y agregado.
  </example>

  <example>
  user: "audita el átomo qselect"
  assistant: Detecta que es un átomo (packages/componentes/src/atomos/qselect.tsx), aplica las verificaciones de átomos/moléculas y genera el informe.
  </example>

  <example>
  user: "/audit-componente packages/contextos/src/ventas/comun/componentes/factura.tsx"
  assistant: Detecta que es un componente de contexto (selector de entidad de ventas), lo compara con la plantilla AutocompletarIdDescripcion y con sus hermanos del mismo contexto, y comprueba que su ubicación en el contexto es la correcta.
  </example>

  <example>
  user: "audita apps/sanhigia/src/componentes"
  assistant: Detecta componentes de app, verifica para cada uno si debe seguir siendo específico de sanhigia o promocionarse a un contexto, y aplica la tabla de componentes de app.
  </example>
---

# Audit Componente — Quimera Olula

Auditas componentes UI del monorepo en cuatro dimensiones: **ubicación**, consistencia estructural
y de nomenclatura, UI/UX y accesibilidad, y calidad de código general.
Acepta una o más rutas como argumento (fichero o carpeta); cada una se audita de forma independiente
y el informe final las consolida.

## Las tres capas de componentes

No todos los componentes aspiran a ser generales, y colocar uno en la capa equivocada es una
desviación tan real como un `any`. Hay tres capas legítimas:

| Capa | Dónde vive | Qué es | Ejemplos |
|---|---|---|---|
| **Común / transversal** | `packages/componentes/src/` | No sabe nada de ningún dominio: sirve igual en ventas que en almacén que en RRHH. Se consume vía `@olula/componentes` | `qboton`, `qinput`, `qautocompletar`, `arbol_documentos` |
| **De contexto** | `packages/contextos/src/<contexto>/comun/componentes/` (o `<contexto>/<feature>/componentes/`) | Tiene una relación directa y casi exclusiva con un contexto: consume su `infraestructura.ts`, sus tipos de `diseño.ts` o sus `valores/`. Reutilizable por cualquier app, pero solo dentro de ese contexto | `ventas/comun/componentes/factura.tsx`, `almacen/comun/componentes/Articulo.tsx`, `crm/comun/componentes/lead.tsx` |
| **De app** | `apps/<app>/src/componentes/` (o `apps/<app>/src/contextos/**/componentes/`) | Solo tiene sentido en una aplicación: personalización de marca, un slot de factory, o una variante que ningún otro producto quiere | `CabeceraSanhigia.tsx`, `EstadoIncidenciaSanhigia.tsx`, `FacturaSelectorDevoluciones.tsx` |

Que un componente esté en la capa de contexto **no es una desviación a corregir**: un selector de
facturas depende de `ventas/factura/infraestructura.ts` y no tiene sitio en `packages/componentes`,
que no debe conocer dominios. Lo mismo para un componente de marca de una app. Lo que sí se audita
es la coherencia: que la capa elegida corresponda a las dependencias y al uso reales (ver Paso 0.b).

No existe un `README.md`/`STYLEGUIDE.md` en `packages/componentes/`: las convenciones de la capa
común son implícitas en el código ya existente, y este skill trata los componentes de referencia
citados abajo como la "plantilla viva". La capa de contexto sí tiene plantilla física
(`packages/contextos/src/_plantilla/comun/componentes/AutocompletarIdDescripcion.tsx`), igual que
`audit-modulo` compara contra `_plantilla/modulo/`.

## Paso 0.a — Determinar categoría de cada componente objetivo

Para cada ruta recibida, según **dónde está hoy** (la idoneidad de esa ubicación se juzga en 0.b):

1. Bajo `packages/componentes/src/atomos/` → categoría **átomo**.
2. Bajo `packages/componentes/src/moleculas/` → categoría **molécula**.
3. Otro sitio de `packages/componentes/src/` (carpeta propia por feature, ej. `arbol_documentos/`,
   `gestor_documentos/`, `lista_documentos/`, `calendario/`, `menu/`, `detalle/`, `maestro/`,
   `vista/`, `slot/`) → categoría **feature/dominio complejo**. Confírmalo mirando si la carpeta
   tiene `diseño.ts`/`dominio.ts`/`maquina.ts` (patrón DDD completo) o solo uno o pocos `.tsx`/
   `.css` (componente de presentación agrupado por dominio, sin máquina propia — aplica solo la
   parte de 3.2 que sea pertinente).
4. Bajo `packages/contextos/src/<contexto>/**/componentes/` → categoría **componente de contexto**.
   Anota de qué contexto se trata (`ventas`, `crm`, `almacen`, `comun`…): la referencia de
   consistencia serán sus hermanos de ese mismo contexto.
5. Bajo `apps/<app>/src/**/componentes/` → categoría **componente de app**. Anota la app.
6. Si la ruta es una carpeta con varios ficheros dentro, audita el componente principal (el que
   da nombre a la carpeta, p.ej. `QGestorDocumentos.tsx`) junto con sus subcomponentes internos
   como una sola unidad. Si es una carpeta de *colección* (`apps/sanhigia/src/componentes/`,
   `ventas/comun/componentes/`), audita cada componente por separado y consolida.
7. No mezcles las tablas de categorías distintas para un mismo componente — la categoría determina
   cuál aplicar: átomo/molécula → 3.1, feature complejo → 3.2, contexto → 3.3, app → 3.4.

## Paso 0.b — Verificar la ubicación (¿está en la capa correcta?)

Esta comprobación es previa a todo lo demás y se hace **siempre**, para cualquier categoría.
Determina las dependencias reales del componente (`grep` de sus imports) y sus consumidores reales
(`grep` del nombre exportado en todo el monorepo, excluyendo el propio fichero):

| Señal | Diagnóstico |
|---|---|
| Importa de `packages/contextos/src/<ctx>/...` (`infraestructura.ts`, `diseño.ts`, `valores/`) **y está en `packages/componentes/`** | ⇄ **Reubicar** → bajar a `packages/contextos/src/<ctx>/comun/componentes/`. La capa común no debe conocer dominios |
| No importa nada de dominio, es puro control de UI, **y está en un contexto o en una app** | ⇄ **Reubicar** → subir a `packages/componentes/src/atomos\|moleculas/` (con su `*.historias.ts`) |
| Está en `apps/<app>/` y lo consumen **dos o más apps**, o duplica un componente de contexto existente | ⇄ **Reubicar** → promocionar al contexto correspondiente, o consumir el que ya existe |
| Está en `apps/<app>/`, solo lo usa esa app, y depende de su marca, de su factory o de una decisión de producto suya | ✓ **Correcto**: componente de app |
| Está en un contexto, depende de ese contexto, y lo consumen una o varias apps | ✓ **Correcto**: componente de contexto |
| Está en un contexto pero importa de **otro** contexto distinto al suyo | ⚠ Señalar: o el componente pertenece al otro contexto, o la dependencia debe pasar por `comun/` |

Si el componente está donde toca, decláralo explícitamente en el informe ("Ubicación: ✓ correcta,
componente de contexto `ventas`") — el skill no debe empujar hacia `packages/componentes` por
defecto.

## Paso 1 — Cargar referencias

Carga solo las referencias de las categorías presentes entre los objetivos.

**Átomos y moléculas:**
- `packages/componentes/src/atomos/qboton.tsx` + `qboton.css` + `qboton.historias.ts`
- `packages/componentes/src/atomos/qinput.tsx` + `qinput.historias.ts`
- `packages/componentes/src/historias/listado-historias.ts` (registro del catálogo)
- `packages/componentes/src/tema/tema.css` y `packages/componentes/src/tema/tokens/`

**Feature/dominio complejo:**
- `packages/contextos/src/_plantilla/modulo/diseño.ts` (patrón `Estado`/`Contexto` de
  `@olula/lib/diseño.ts`)
- Los componentes hermanos en la misma carpeta padre si existen (p.ej. si se audita
  `arbol_documentos/`, compáralo con `gestor_documentos/`/`lista_documentos/` y viceversa) —
  sirven de referencia cruzada de consistencia entre hermanos
- Los módulos de `@olula/lib` que el componente consuma, para comprobar si ya existen helpers
  reutilizables antes de señalar duplicación

**Componentes de contexto:**
- `packages/contextos/src/_plantilla/comun/componentes/AutocompletarIdDescripcion.tsx` — plantilla
  canónica del selector de entidad: forma de las props, `obtenerOpciones`, `descripcionOpcion`,
  `datos`, y bloque `// INFRAESTRUCTURA` al pie cuando la consulta no vive en el módulo
- `packages/componentes/src/moleculas/qautocompletar.tsx` y `atomos/qselect.tsx` — el contrato que
  el componente envuelve (`valor`/`descripcion`/`obtenerOpciones`/`opciones`/`onChange`)
- **Todos los hermanos del mismo contexto** (`packages/contextos/src/<ctx>/comun/componentes/*.tsx`):
  son la referencia de consistencia principal, por encima de otros contextos
- El `infraestructura.ts`/`diseño.ts` del módulo que consulta, y `<ctx>/comun/valores/` si existe

**Componentes de app:**
- `apps/<app>/src/factory.ts` (y los `contextos/**/factory.ts` de esa app) — para ver si el
  componente está registrado como slot o se importa directamente
- El componente equivalente del contexto, si existe (p.ej. `EstadoIncidenciaSanhigia.tsx` frente a
  `crm/comun/componentes/EstadoIncidencia.tsx`), para medir duplicación
- Los componentes hermanos de `apps/<app>/src/componentes/`
- Si el componente debería inyectarse en una vista compartida en vez de importarse a mano,
  consulta el skill `inject-factory` antes de recomendar el cambio

**Para la dimensión UI/UX y accesibilidad (siempre), lee:**
- `.claude/agents/designer.md` — hereda su clasificación de hallazgos (Crítico/Advertencia/
  Sugerencia) y su conocimiento de selectores CSS de `QModal` (custom elements, atributo
  `nombre`, no `className`)
- Invoca el tool `Skill` con `skill: web-design-guidelines` para traer al contexto las
  directrices (Vercel Web Interface Guidelines) actualizadas

Todo esto lo aplicas tú directamente en este mismo hilo — no delegues la auditoría en el agente
`designer` ni en ningún subagente; solo reutilizas su contenido como referencia, igual que
`audit-modulo` reutiliza la plantilla de `_plantilla/modulo/` sin subagentes.

## Paso 2 — Leer los componentes objetivo

Para cada ruta objetivo, lee:
- Todos los ficheros `.tsx`/`.ts` del componente, incluidos subcomponentes internos y los hermanos
  de texto/helpers (`*_texto.ts`, `*_helpers.ts`) si existen
- El `.css` homónimo
- `diseño.ts`, `dominio.ts`, `maquina.ts`, `index.ts` si existen
- El fichero `*.historias.ts` si existe
- Los tipos de otros paquetes que consuma o exponga (`@olula/lib`, `@olula/ctx`), para
  comprobar consistencia de tipos/naming en los límites del componente
- Sus consumidores reales (`grep` del export por el monorepo): hacen falta para 0.b y para detectar
  props muertas

## Paso 3 — Verificaciones

### 3.1 Consistencia estructural y de nomenclatura — Átomos y Moléculas

Aplica esta tabla solo a componentes de categoría átomo o molécula.

| Verificación | Cómo comprobar |
|---|---|
| **Fichero en minúsculas con prefijo `q`** | `qxxx.tsx` (no `QXxx.tsx`, no sin prefijo) |
| **Export nombrado en PascalCase** | `export const QXxx = (...)` coincide con el nombre del fichero capitalizado |
| **Tipo de props con sufijo `Props`** | `QXxxProps` definido y usado como tipo de las props |
| **Valores por defecto en desestructuración** | Los props opcionales con default (`tamaño = "mediano"`) se resuelven al desestructurar, no con `??`/`||` dentro del cuerpo |
| **Naming de props en español** | Props como `deshabilitado`, `tamaño`, `texto`, `variante` — no anglicismos (`disabled`, `size`, `label`, `variant`) salvo excepciones ya asentadas (`onClick`, `children`) |
| **Wrapper de custom element** | El JSX envuelve el elemento nativo en `<quimera-xxx {...attrs}>`, coherente con el nombre del fichero |
| **Atributos booleanos/enum como atributos HTML** | Se pasan como `attrs` al custom element (`destructivo`, `tamaño="pequeño"`), no como clases condicionales de React |
| **CSS ataca atributos del custom element** | Selectores tipo `&[destructivo]`, `&[tamaño="pequeño"]` con anidamiento CSS nativo — no BEM ni clases `.qxxx--destructivo` |
| **CSS usa variables de tema** | Colores/espaciados vía `var(--color-primario)`, `var(--espaciado-s)`, etc. — no valores hardcodeados (hex, px sueltos) salvo casos justificados |
| **`deshabilitado` propagado como atributo** | Si el átomo es interactivo, `deshabilitado?: boolean` se propaga al custom element |
| **Fichero `*.historias.ts` presente** | Existe el hermano de catálogo con `grupo`, `titulo`, `Componente`, y al menos una variante (`Base`) |
| **Registrado en `listado-historias.ts`** | El import y la entrada en el array `listadoHistorias` existen |
| **Sin dependencias de dominio** | Ningún import de `@olula/ctx`/`packages/contextos`. Si lo hay, es un hallazgo de ubicación (0.b), no de estilo |
| **Uso de `React.forwardRef`** | Ninguno de los átomos de referencia lo usa; si el componente objetivo lo hace, señálalo como observación a evaluar caso a caso, no como fallo automático |

### 3.2 Consistencia estructural y de nomenclatura — Feature/dominio complejo

Aplica esta tabla solo a componentes de categoría feature/dominio complejo.

| Verificación | Cómo comprobar |
|---|---|
| **Carpeta en snake_case** | `arbol_documentos/`, no `ArbolDocumentos/` ni `arbolDocumentos/` |
| **Patrón DDD de 4 ficheros si aplica** | `diseño.ts` (Estado + Contexto), `dominio.ts` (transiciones puras), `maquina.ts` (`Maquina<Estado,Contexto>`), `index.ts` |
| **`diseño.ts`: Estado como unión de strings** | `type Estado = "inicial" \| "cargando" \| ...` |
| **`diseño.ts`: Contexto extends `Contexto<Estado>`** | Importado de `@olula/lib/diseño.ts`, igual que en `packages/contextos` |
| **`diseño.ts` en camelCase** | Todos los campos de `Contexto`/`Configuracion...` en camelCase, nunca snake_case (`vinculoTipo`, no `vinculo_tipo`) |
| **Props/estado del `.tsx` en camelCase** | Mismo chequeo dentro del propio componente React: props, `useState`, desestructuración — el campo no debe reaparecer en snake_case en el componente aunque `diseño.ts` ya esté corregido |
| **Componente principal sin wrapper de custom element** | Usa clases CSS normales (`className`), no el patrón `<quimera-xxx>` de átomos — esto es correcto para esta categoría, no una desviación |
| **Subcomponentes internos en PascalCase sin prefijo `q`** | `NodoArbolItem.tsx`, `AnadirDocumento.tsx` — correcto; señala como desviación si un subcomponente interno lleva prefijo `q` (se confundiría con un átomo/molécula reutilizable) |
| **Sin lógica de dominio duplicada entre componentes hermanos** | Compara `dominio.ts`/lógica de cálculo entre el componente objetivo y sus hermanos de la misma carpeta padre; si hay funciones equivalentes (p.ej. una normalización de filtro repetida), debe existir un helper compartido en `@olula/lib` en vez de reimplementarlo en cada sitio |
| **`index.ts` exporta solo la superficie pública** | No expone detalles internos que ningún consumidor externo necesite |
| **Naming del fichero principal** | `Q<Feature>.tsx` en PascalCase con prefijo `Q` (ej. `QArbolDocumentos.tsx`), a diferencia de los subcomponentes internos sin prefijo |

### 3.3 Consistencia estructural y de nomenclatura — Componentes de contexto

Aplica esta tabla a componentes bajo `packages/contextos/src/<ctx>/**/componentes/`. La mayoría
son **selectores de entidad** (envuelven `QAutocompletar`) o **selectores de valor cerrado**
(envuelven `QSelect`); algunos son tarjetas o bloques de formulario, en cuyo caso aplica solo lo
pertinente.

| Verificación | Cómo comprobar |
|---|---|
| **Vive en `comun/componentes/` del contexto** | Si solo lo usa un módulo del contexto, `<ctx>/<modulo>/componentes/` también vale; si lo usan varios módulos, debe estar en `<ctx>/comun/componentes/` |
| **Export en PascalCase con el nombre de la entidad** | `export const Factura`, `export const Articulo` — sin prefijo `Q` (ese prefijo es de la capa común) |
| **Nombre de fichero coherente con sus hermanos** | El monorepo mezcla hoy `PascalCase.tsx` y `minuscula.tsx` dentro de la misma carpeta (ventas: 7 y 7; crm: 4 y 12). **No lo marques como desviación global**: exige solo coherencia con los hermanos del mismo contexto y anótalo como convención pendiente de decidir (← actualizar convención) |
| **Tipo de props con sufijo `Props`** | `FacturaProps`, declarado como `interface` junto al componente |
| **Contrato de props estándar** | `valor: string`, `descripcion?: string`, `nombre?: string`, `label?: string`, `deshabilitado?: boolean`, `onChange`, `ref?` — con defaults en la desestructuración y `...props` reenviado al átomo/molécula envuelto, como en la plantilla |
| **Forma de la opción** | `onChange` recibe `{ valor, descripcion }` como mínimo. Datos adicionales van en campos propios (`codigo`, `datos`, la entidad entera), nunca embutidos en `descripcion` con separadores que el consumidor tenga que parsear |
| **`descripcionOpcion` para el texto largo** | Si el texto del desplegable difiere del que se guarda, usa `descripcionOpcion` (lo soporta `QAutocompletar`) en vez de deformar `descripcion` |
| **`obtenerOpciones(texto, id)` resuelve también por id** | `QAutocompletar` llama con `id` cuando hay `valor` sin `descripcion`; si la función ignora el segundo parámetro, el campo se queda en blanco al abrir una ficha ya guardada |
| **Filtros y orden explícitos** | `filtro`/`orden`/`paginacion` construidos con los tipos de `@olula/lib/diseño.ts` (`ClausulaFiltro`, `Filtro`, `Criteria`), sin `as unknown as` evitable |
| **Prop de filtrado opcional cuando el dominio lo admite** | Un selector acotado por otra entidad (`clienteId`) debe poder usarse también sin acotar: prop opcional, y ausencia = sin filtro. Si obliga a pasarla, señálalo si hay consumidores que no la tienen |
| **Personalización del texto de la opción** | Si hay más de una forma legítima de describir la entidad, debe existir una prop tipo `renderOpcion?: (entidad) => string` en vez de duplicar el componente por cada variante |
| **Consulta a través del módulo** | Usa el `infraestructura.ts` del módulo del contexto. El bloque `// INFRAESTRUCTURA` al pie del fichero (`RestAPI` + `ApiUrls`, como en la plantilla) solo se acepta cuando la entidad no tiene módulo propio |
| **Valores cerrados desde `valores/`** | Los selectores de enum toman sus opciones de `<ctx>/comun/valores/*.ts` (`opcionesTipoAccion`), no de un array literal repetido en cada componente |
| **Sin dependencias de otro contexto** | Solo imports de su propio contexto, de `comun/`, de `@olula/componentes` y de `@olula/lib` |
| **Sin lógica de negocio** | Formatea y consulta; no calcula importes, estados ni reglas — eso vive en el `dominio.ts` del módulo |
| **Duplicación entre contextos** | Si otro contexto tiene un componente equivalente (`compras/comun/componentes/factura.tsx` frente a `ventas/...`), comprueba que la duplicación es real (entidades distintas) y no copia-pega |

### 3.4 Consistencia estructural y de nomenclatura — Componentes de app

Aplica esta tabla a componentes bajo `apps/<app>/src/**/componentes/`.

| Verificación | Cómo comprobar |
|---|---|
| **Justificación de ser específico** | El componente depende de la marca de la app, de su factory, o de una decisión de producto que ningún otro producto comparte. Si no, es candidato a promocionar (0.b) |
| **Fichero y export en PascalCase** | `CabeceraSanhigia.tsx` → `export const CabeceraSanhigia`; los ficheros en minúscula de estas carpetas son la excepción, no la norma |
| **Sufijo de app cuando sustituye a uno compartido** | Si existe un homónimo en un contexto o en `packages/componentes`, el de la app lleva el nombre de la app (`EstadoIncidenciaSanhigia`, `MenuUsuarioSanhigia`) para que no se confundan al leer un import |
| **Registrado como slot si sustituye una pieza compartida** | Si reemplaza algo que una vista compartida pinta (cabecera, menú, pie), debe estar en el `FactoryComponentes<App>` de `apps/<app>/src/factory.ts`, no importado a mano dentro de código compartido. Para el refactor, consulta `inject-factory` |
| **Envoltorio fino sobre el componente de contexto** | Si la app solo cambia etiquetas, filtros o defaults de un componente que ya existe en un contexto, debe envolverlo, no reimplementar la consulta ni el `obtenerOpciones` |
| **Contrato de props alineado con el componente que envuelve** | Reexpone los mismos nombres de props (`valor`, `descripcion`, `label`, `onChange`) y el mismo tipo de opción, para que sustituirlo sea trivial |
| **Sin lógica de dominio del contexto** | Reglas de negocio del contexto no se reimplementan en la app; si hacen falta, van al módulo del contexto |
| **Ubicación dentro de la app** | Componentes transversales de la app en `apps/<app>/src/componentes/`; los atados a un contexto concreto de la app, en `apps/<app>/src/contextos/<ctx>/**/` junto a sus vistas |

### 3.5 UI/UX y accesibilidad

Aplica, sobre los componentes objetivo, las directrices cargadas en el Paso 1
(`web-design-guidelines` + `designer.md`), organizando los hallazgos en **Crítico / Advertencia /
Sugerencia** — la misma clasificación que usa el agente `designer`.

Añade además estas 4 comprobaciones propias de Quimera Olula, que las guías genéricas de
accesibilidad web no cubren porque asumen HTML nativo y aquí los componentes suelen envolver
custom elements (`<quimera-xxx>`) sin semántica implícita:

| Verificación | Cómo comprobar |
|---|---|
| **Roles/ARIA explícitos en interacciones custom** | Si el componente representa un control interactivo no nativo (árbol, lista seleccionable, acordeón...), ¿tiene los roles ARIA que un elemento HTML nativo tendría implícitos (`role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-selected`, `aria-label`...)? No lo des por bueno solo porque el resto de átomos tampoco los tengan — señala la ausencia como hallazgo. |
| **Foco visible y navegación por teclado** | Para cada interacción de usuario (clic en nodo, abrir/cerrar, seleccionar fila, arrastrar y soltar...) ¿existe equivalente accesible por teclado (Tab/Enter/Espacio/flechas) y un estado de foco visible (`:focus-visible`), o solo funciona con ratón? |
| **Soporte de dark mode vía tema** | El CSS del componente ¿usa exclusivamente variables de tema (`var(--color-...)` de `packages/componentes/src/tema/tema.css`), o hay colores hardcodeados que romperían en dark mode? |
| **Mensajes de validación y estado vacío** | En selectores (3.3/3.4): cuando la búsqueda no puede ejecutarse (falta una entidad previa) o no devuelve nada, ¿lo dice con `erroneo`/`textoValidacion` en lugar de fallar en silencio devolviendo `[]`? |

### 3.6 Calidad de código general

| Verificación | Cómo comprobar |
|---|---|
| **Sin código muerto / props no usadas** | Props declaradas en `XxxProps` que no se leen en el cuerpo del componente; imports no usados; funciones exportadas que ningún consumidor referencia (`grep` en el resto del monorepo) |
| **Tipado estricto, sin `any`** | Busca `any` y `as unknown as` en los ficheros objetivo; cada uso debe estar justificado (interoperabilidad con librería externa) o señalado como desviación |
| **Sin duplicación de lógica interna** | Funciones equivalentes repetidas dentro del propio componente o entre sus subcomponentes (más allá del chequeo entre hermanos de 3.2/3.3) |
| **Naming consistente de handlers** | Props de callback `onXxx` (`onClick`, `onNodoSeleccionado`); funciones internas que los implementan `handleXxx` — sin mezclar convenciones distintas en el mismo fichero |
| **Tamaño/complejidad del componente** | Componentes `.tsx` de más de ~200-300 líneas o con anidamiento condicional profundo son candidatos a extraer subcomponentes o hooks; señala si concentra lógica de dominio que debería vivir en `dominio.ts` |
| **Nombres descriptivos** | Sin variables/parámetros de una sola letra o abreviados sin contexto (fuera de índices de bucle triviales) |
| **Exports no-componente en un `.tsx`** | ESLint avisa con `react-refresh/only-export-components` cuando un `.tsx` exporta algo que no es un componente. Extraer esos helpers a un hermano `*_texto.ts`/`*_helpers.ts` (como `ventas/comun/componentes/linea_venta_texto.ts`) **solo si son reutilizables fuera del componente**; si son detalle interno, no los exportes. Si no se da ninguno de los dos casos, el aviso es aceptable: hoy conviven decenas en el repo. Esto es **Sugerencia**, nunca "→ alinear" |
| **`lint` sin errores y sin avisos nuevos** | Ejecuta el `lint` del paquete al que pertenece la ruta auditada (ver tabla de paquetes abajo) y compara **el conjunto** de avisos de los ficheros objetivo, no el total del paquete |
| **`type-check` sin errores** | Igual, con el `type-check` del paquete correspondiente |

**Paquete según la ruta auditada:**

| Ruta | Comando |
|---|---|
| `packages/componentes/**` | `pnpm --filter @olula/componentes run lint` / `run type-check` |
| `packages/contextos/**` | `pnpm --filter @olula/ctx run lint` / `run type-check` |
| `packages/lib/**` | `pnpm --filter @olula/lib run lint` / `run type-check` |
| `apps/<app>/**` | `pnpm --filter @olula/<app> run lint` / `run type-check` (p.ej. `@olula/sanhigia`) |

La configuración de ESLint (`eslint.config.js` en la raíz) trata `react-refresh/only-export-components`
y `react-hooks/exhaustive-deps` como **avisos**, y `@typescript-eslint/no-unused-vars` como **error**.
Por eso "sin errores" y "sin avisos nuevos" son dos cosas distintas: hay una línea base de avisos
preexistentes que no es objeto de esta auditoría. Como orientación, el 2026-09-21 era de 14 avisos /
0 errores en `@olula/componentes` y 31 / 0 en `@olula/ctx`; vuelve a medirla antes de atribuir nada
al componente auditado.

> Esta dimensión se inspira en las categorías del skill `code-review` (correctness, reuse,
> simplificación, eficiencia), pero no lo invoca: `code-review` está orientado a diffs de cambios
> pendientes, y aquí se audita código ya existente y potencialmente mergeado hace tiempo, sin un
> diff de referencia.

## Paso 4 — Generar informe

Un bloque por componente auditado y, si se auditó más de uno, un resumen agregado al principio:

```markdown
# Auditoría de componente(s): {lista_de_componentes}

## Resumen agregado (si son varios componentes)
- Componentes auditados: {N} ({n_comun} comunes, {n_ctx} de contexto, {n_app} de app)
- Alineamiento medio: {porcentaje}%
- Desviaciones totales: {N} ({n1} → alinear, {n2} ⇄ reubicar, {n3} ← actualizar convención, {n4} ⊘ extensión)

---

## {nombre_componente} ({ruta})

### Resumen
- Categoría: átomo | molécula | feature/dominio complejo | componente de contexto ({ctx}) | componente de app ({app})
- Ubicación: ✓ correcta | ⇄ debería vivir en {ruta_propuesta} ({motivo})
- Consumidores: {lista o recuento}
- Alineamiento: {porcentaje}%
- Desviaciones: {N} ({n1} → alinear componente, {n2} ⇄ reubicar, {n3} ← actualizar convención, {n4} ⊘ extensión)

### 1. Consistencia estructural y de nomenclatura
{lista de ✓ y ✗ con categoría, según la tabla 3.1, 3.2, 3.3 o 3.4 aplicada}

### 2. UI/UX y accesibilidad
{hallazgos Crítico / Advertencia / Sugerencia, incluyendo las 4 comprobaciones propias de Quimera}

### 3. Calidad de código general
{lista de ✓ y ✗ con categoría según la tabla 3.6, incluyendo resultado de lint / type-check del paquete correcto}

### Recomendaciones
#### → Alinear componente
{cambios concretos, incluyendo hallazgos Crítico/Advertencia de la sección 2 atribuibles al componente}

#### ⇄ Reubicar
{cambios de capa, con la ruta destino y qué consumidores habría que tocar}

#### ← Actualizar convención
{patrones que el componente resuelve mejor que sus pares y que deberían generalizarse o documentarse}

#### ⊘ Extensiones de dominio (no requieren acción)
{diferencias específicas del dominio/feature que no son un fallo}

---
{repetir por cada componente}
```

## Criterios para el diagnóstico

### → Alinear componente
El resto del ecosistema (átomos hermanos, componentes hermanos del mismo contexto o de la misma
app, la plantilla `AutocompletarIdDescripcion`, o el patrón DDD de `packages/contextos`) tiene el
patrón correcto y el componente objetivo se desvía sin justificación:
- Naming en snake_case en `diseño.ts` o en el propio `.tsx` cuando el resto usa camelCase
- Carpeta en PascalCase en vez de snake_case (capa común)
- Lógica duplicada con un componente hermano en vez de un helper compartido
- Ausencia de fichero `*.historias.ts` en un átomo/molécula que debería tener catálogo
- Selector que no resuelve por `id` en `obtenerOpciones`, o que embute datos en `descripcion`
- Componente de app que reimplementa la consulta de un componente de contexto en vez de envolverlo
- Hallazgos **Crítico** o **Advertencia** de la sección UI/UX sobre el propio componente (ARIA
  ausente en interacción custom clave, sin foco visible, colores hardcodeados que rompen dark
  mode)
- `any` sin justificar, código muerto, props no usadas
- Errores de `lint` / `type-check`

### ⇄ Reubicar componente
La capa en la que vive no corresponde a sus dependencias ni a su uso real (Paso 0.b):
- Componente en `packages/componentes/` que importa de un contexto → bajar al contexto
- Componente de contexto o de app sin ninguna dependencia de dominio y reutilizable en cualquier
  parte → subir a `atomos/`/`moleculas/` con su `*.historias.ts`
- Componente de app consumido por dos o más apps, o que duplica uno de contexto → promocionar
- Componente en `<ctx>/<modulo>/componentes/` usado por varios módulos del contexto → subir a
  `<ctx>/comun/componentes/`

Recuerda: un componente atado a un contexto **está bien** en el contexto, y uno atado a una app
**está bien** en la app. Reubicar solo cuando dependencias y consumidores contradicen la capa.

### ← Actualizar convención
El componente objetivo tiene un patrón más completo o mejor resuelto que el resto de sus pares, y
debería generalizarse o documentarse (no hay `STYLEGUIDE.md` hoy — esto puede ser la motivación
para crear uno):
- Un enfoque de composición, tipado, o separación `diseño.ts`/`dominio.ts` más limpio que el de
  sus hermanos
- Una solución de accesibilidad (roles ARIA, manejo de foco) que debería replicarse en otros
  componentes con interacciones custom similares
- Un helper reutilizable que debería promoverse a `@olula/lib` para que otros componentes lo
  adopten
- Una convención que hoy no está decidida en el monorepo (p.ej. mayúscula/minúscula en los ficheros
  de `comun/componentes/`): propón una y anota que afecta a todos los hermanos, en vez de marcar
  el componente auditado como desviado

### ⊘ Extensión de dominio
La diferencia es funcionalidad o estructura específica del dominio/feature/app, no un fallo:
- Subcomponentes internos propios de la feature (`NodoArbolItem.tsx`, `AnadirDocumento.tsx`)
- Ausencia de wrapper de custom element en componentes de feature complejo, de contexto o de app
  (correcto para esas categorías, no para átomos/moléculas)
- Dependencia de un componente de contexto respecto del `infraestructura.ts` de su contexto
- Personalización de marca o de producto en un componente de app
- Avisos de `react-refresh/only-export-components` sobre helpers que no se reutilizan fuera
- Hallazgos de tipo **Sugerencia** que dependen de una decisión de producto fuera del alcance de
  esta auditoría
