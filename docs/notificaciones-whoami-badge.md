# Actualizacion del badge de notificaciones con whoami

## Contexto actual

El flujo actual refresca `whoami` de forma periodica desde auth:

1. `useTimerRefresco` ejecuta `comprobarToken()` cada cierto tiempo.
2. Si toca refrescar token, `refrescarToken()` vuelve a llamar a `whoAmI()`.
3. La respuesta se persiste con `whoAmIStorage.actualizar(datosWhoAmI)`.

El problema es que escribir en `localStorage` no provoca por si solo un rerender en React dentro de la misma pestaña. Por eso un componente que hace solo esto:

```tsx
const totalNoLeidas = obtenerNotificacionesSinLeer();
```

no se actualiza automaticamente cuando `whoami` cambia, salvo que ocurra otro rerender por casualidad.

## Opcion 1: evento comun al actualizar whoami

### Idea

Usar `whoAmIStorage.actualizar()` como punto comun para emitir una senal global cada vez que cambia `whoami`.

### Flujo

1. `whoAmIStorage.actualizar(whoAmI)` guarda el JSON en `localStorage`.
2. Justo despues emite un evento, por ejemplo `window.dispatchEvent(new CustomEvent("whoami-actualizado", { detail: whoAmI }))`.
3. Un hook comun o el propio componente de cabecera escucha ese evento.
4. Cuando llega, actualiza su estado React con `notificaciones_sin_leer`.

### Ventajas

1. Cambio pequeno y muy localizado.
2. No hace falta polling en la UI.
3. Se engancha exactamente al momento en que ya se actualiza `whoami`.
4. Sirve para cualquier cliente, no solo Sanhigia.

### Inconvenientes

1. Introduce un canal global basado en nombres de evento string.
2. Si varios componentes empiezan a escuchar muchos eventos globales, el patron puede dispersarse.
3. Hay que acordar bien quien emite y quien escucha para no duplicar logica.

### Cuando la elegiria

Cuando queremos una solucion minima, transversal y con poco impacto en la arquitectura actual.

## Opcion 2: store o hook comun reactivo para whoami

### Idea

Crear una capa comun reactiva, por ejemplo `useWhoAmI()` o `useNotificacionesSinLeer()`, para que los componentes lean estado React en vez de leer directamente `localStorage`.

### Flujo

1. Existe un store comun en memoria con el ultimo `whoami`.
2. `whoAmIStorage.actualizar()` actualiza `localStorage` y ademas sincroniza ese store.
3. Los componentes usan un hook comun que se suscribe al store.
4. Cuando cambia `whoami`, React rerenderiza automaticamente donde corresponda.

### Ventajas

1. Es la opcion mas limpia a medio plazo.
2. Evita que los componentes lean `localStorage` directamente.
3. Deja una base reutilizable para mas datos de sesion: usuario, permisos, plugins, badge, etc.
4. Hace mas predecible la actualizacion de UI.

### Inconvenientes

1. Requiere mas trabajo inicial.
2. Obliga a decidir donde vive ese store comun.
3. Si solo se necesita el badge, puede parecer demasiado para el problema actual.

### Cuando la elegiria

Cuando vemos que `whoami` va a tener mas consumidores reactivos aparte del badge, o cuando queremos dejar bien resuelta la sesion en frontend.

## Recomendacion

Para este caso concreto, empezaria por la opcion 1.

Motivos:

1. El dato ya nace y se actualiza en un punto comun claro.
2. La necesidad inmediata es solo que el badge se refresque bien.
3. El cambio encaja con la arquitectura actual sin meter una abstraccion grande todavia.

Si mas adelante aparecen otros consumidores reactivos de `whoami`, entonces tiene sentido evolucionar a la opcion 2 y dejar la sesion expuesta mediante un hook/store comun.

## Nota importante

El evento nativo `storage` no resuelve este caso por si solo, porque no se dispara en la misma pestana que hace `localStorage.setItem(...)`. Solo ayuda entre pestanas distintas.