# SSE + Toasts: diseno tecnico (propuesta)

## Objetivo
Definir una capa de notificaciones tipo toast que reutilice el SSE global ya existente, sin acoplar logica de dominio en componentes de presentacion.

## Alcance
- Entrada de eventos: stream SSE global de sesion.
- Salida UI: toasts temporales en cliente.
- Sin cambios de backend para la primera fase.
- Prioridad inicial: eventos de comunicacion.

## No objetivo
- Reemplazar el centro de notificaciones.
- Persistir historial de toasts.
- Garantizar entrega exacta (exactly-once).

## Arquitectura propuesta
1. Fuente: ServerSentEventsSession (ya existente).
2. Adaptador: EventToToastAdapter.
   - Traduce eventos SSE a mensajes de UI.
   - Filtra por permisos, plugin y estado de sesion.
3. Capa de estado UI: ToastStore (en memoria).
   - Cola limitada.
   - Deduplicacion temporal.
4. Presentacion: ToastHost global en Plantilla.
   - Render de toasts y animaciones de entrada/salida.

## Contratos de evento (fase 1)
Evento SSE esperado:
- event: comun.comunicacion.creada
- data JSON:
  - comunicacion_id: string | number (obligatorio)
  - usuario_destino_id: string | number (obligatorio)
  - timestamp: string | number (obligatorio)
  - titulo: string (opcional)
  - resumen: string (opcional)

Fallback si faltan campos opcionales:
- titulo: "Nueva comunicacion"
- resumen: "Tienes una nueva comunicacion"

## Reglas de presentacion
1. Mostrar toast solo si:
- Usuario autenticado.
- Plugin eventos_sse activo.
- Permiso de comunicacion activo.

2. Severidad por defecto:
- info para comunicacion nueva.
- warning/error reservado para fases futuras.

3. Duracion:
- 4 a 6 segundos por defecto.
- Pausar temporizador al hover.

4. Accion principal:
- Click en toast navega a /comun/comunicacion.

5. Maximo visible:
- 3 toasts simultaneos.
- Nuevos toasts desplazan los mas antiguos.

## Reglas de anti-ruido
1. Deduplicacion por clave:
- key = eventType + comunicacion_id

2. Ventana de deduplicacion:
- Ignorar repetidos durante 30 segundos.

3. Rate limit:
- Maximo 5 toasts por 10 segundos.
- Si se supera, agrupar en un toast resumen:
  - "Tienes N nuevas notificaciones"

4. Reconexion SSE:
- No reemitir toasts antiguos por reconexion sin evento nuevo.

## Estado de sesion y seguridad
- Si no hay token o hay logout: cerrar stream y vaciar cola de toasts.
- En 401/403 SSE: detener reintentos y no mostrar toasts.
- No renderizar contenido sensible en toast si no hay permiso.

## Observabilidad recomendada
Metricas cliente:
- sse_events_received_total por tipo.
- toasts_shown_total por tipo.
- toasts_deduplicated_total.
- toasts_rate_limited_total.

Logs de diagnostico (solo dev):
- Evento recibido.
- Motivo de descarte (permiso, dedupe, rate-limit, sesion).

## Plan incremental
Fase 1 (quick win):
- Toast para comun.comunicacion.creada.
- Navegacion a listado de comunicaciones.
- Dedupe + rate limit basicos.

Fase 2:
- Soporte multi-evento (pedido, factura, cobro, stock).
- Plantillas de mensaje por tipo.
- Preferencias por usuario (silenciar categorias).

Fase 3:
- Agrupacion avanzada y prioridades.
- Integracion con centro de notificaciones.

## Criterios de aceptacion (fase 1)
1. Al recibir comun.comunicacion.creada valido, aparece un toast.
2. Sin login o sin permiso, no aparece toast.
3. Eventos duplicados no generan spam.
4. En reconexion SSE no se repiten toasts antiguos.
5. El click del toast abre comunicaciones.
