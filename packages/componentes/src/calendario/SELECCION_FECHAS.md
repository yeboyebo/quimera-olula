# 📅 Selección de Fechas en Calendario

## 🎯 Funcionalidad Implementada

Se ha agregado funcionalidad de **selección de fechas** al componente `Calendario` de forma genérica para aplicaciones empresariales.

## 🚀 Características

### Tipos de Selección
- **Simple**: Seleccionar un solo día
- **Múltiple**: Seleccionar varios días no consecutivos  
- **Rango**: Seleccionar un período entre dos fechas

### Configuración Avanzada
- ✅ Fechas deshabilitadas
- ✅ Límites mín/máx de días
- ✅ Validación personalizada
- ✅ Mensajes de error customizables
- ✅ Estilos visuales automáticos

## 📖 Uso Básico

```tsx
import { Calendario, EstadoSeleccion } from './componentes/calendario';

function MiAplicacion() {
  const [seleccion, setSeleccion] = useState<EstadoSeleccion | null>(null);

  return (
    <Calendario
      datos={misDatos}
      config={{
        seleccion: {
          tipo: 'rango', // 'simple' | 'multiple' | 'rango'
          minDias: 2,
          maxDias: 30,
          fechasDeshabilitadas: fechasDeshabilitadas,
        }
      }}
      onSeleccionCambio={(nuevaSeleccion) => {
        setSeleccion(nuevaSeleccion);
        console.log('Fechas seleccionadas:', nuevaSeleccion.fechas);
      }}
    />
  );
}
```

## 💼 Casos de Uso Empresariales

| Tipo | Ejemplos de Uso |
|------|----------------|
| **Simple** | Citas, reuniones, eventos puntuales |
| **Múltiple** | Días de formación, turnos específicos, fechas de entrega |
| **Rango** | Vacaciones, campañas, análisis temporal, reservas |

## 🔧 API Completa

### ConfiguracionSeleccion
```tsx
interface ConfiguracionSeleccion {
  tipo: 'simple' | 'multiple' | 'rango';
  minDias?: number;
  maxDias?: number;
  fechasDeshabilitadas?: Date[];
  validador?: (fechas: Date[]) => boolean;
  mensajeError?: string;
}
```

### EstadoSeleccion
```tsx
interface EstadoSeleccion {
  tipo: TipoSeleccion;
  fechas: Date[];
  fechaInicio?: Date;
  fechaFin?: Date;
  esValida: boolean;
  error?: string;
}
```

## 🎨 Estilos CSS

Clases automáticas agregadas:
- `.seleccionable` - Días que se pueden seleccionar
- `.seleccionada` - Días actualmente seleccionados
- Efectos hover y estados visuales

## 📱 Compatibilidad

- ✅ Móvil y desktop
- ✅ Todos los modos de vista (año, mes, semana)
- ✅ Accesibilidad con teclado
- ✅ No rompe API existente (totalmente opcional)

## 🔍 Ejemplo Demo

Ver `EjemploSeleccionCalendario.tsx` para una demostración completa con todos los tipos de selección.

## 🚀 Extensibilidad

El sistema está diseñado para ser extendido fácilmente:
- Agregar nuevos tipos de selección
- Validadores personalizados complejos
- Estilos visuales específicos por aplicación
- Integración con diferentes backends
