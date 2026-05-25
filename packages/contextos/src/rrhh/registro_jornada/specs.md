# Registro de jornada

## Specs

### Jornada

#### Crear

<!-- [jornada-crear-01] [x] -->
La hora fin de la jornada no puede ser anterior a la hora de inicio

#### Cambiar

<!-- [jornada-cambiar-01] [x] -->
La hora fin de la jornada no puede ser anterior al mayor valor de hora entre la hora de inicio de la jornada y las horas de inicio y/o fin de las pausas

#### Aprobar

<!-- [jornada-aprobar-01] [x] -->
Una jornada puede aprobarse si está en Borrador y Cerrada (con hora de fin)

### Listado maestro de jornadas

```mermaid
stateDiagram-v2
    [*] --> INICIAL
    INICIAL --> CREANDO_JORNADA : creacion_de_jornada_solicitada
    CREANDO_JORNADA --> INICIAL : jornada_creada / jornadaCreada (recarga lista)
    CREANDO_JORNADA --> INICIAL : creacion_de_jornada_cancelada
    INICIAL --> APROBANDO_JORNADAS : aprobacion_multiple_solicitada
    APROBANDO_JORNADAS --> INICIAL : jornadas_aprobadas / aprobarJornadas (aprueba + recarga)
    APROBANDO_JORNADAS --> INICIAL : aprobacion_multiple_cancelada
```

<!-- [maestro-01] [x] -->
El listado incluye el dato de minutos_jornada de la API en formato hh:mm

<!-- [maestro-02] [x] -->
El listado permite aprobar varias jornadas si todas pueden ser aprobadas (estado Borrador y Cerrada con hora fin)

<!-- [maestro-03] [x] -->
[APROBANDO_JORNADAS] jornadas_aprobadas → INICIAL (el diálogo de confirmación se cierra tras aprobar)

### Detalle de jornada

<!-- [detalle-01] [x] -->
El detalle incluye el dato de minutos_jornada de la API en formato hh:mm, posicionado junto a los datos de hora inicio y hora fin
