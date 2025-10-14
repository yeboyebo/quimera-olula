# Navegación por Teclado - Calendario

## Introducción

El componente Calendario incluye un sistema completo de navegación por teclado diseñado especialmente para usuarios de habla hispana en aplicaciones de gestión empresarial. Esta funcionalidad mejora significativamente la accesibilidad y la eficiencia de uso.

## Características Principales

### ✨ Atajos en Español
- **H** - Ir a **Hoy** (fecha actual)
- **M** - Cambiar a **Modo Mes** 
- **A** - Cambiar a **Modo Año**

### 🔄 Navegación con Flechas

**Modo Mes:**
- **←/→** - Navegar mes anterior/siguiente
- **↑/↓** - Scroll vertical; al llegar arriba/abajo cambia de año

**Modo Año:**
- **←/→** - Navegar año anterior/siguiente  
- **↑/↓** - Solo scroll vertical

### ⚙️ Configuración Flexible
- Atajos completamente personalizables
- Habilitación/deshabilitación selectiva
- Acciones personalizadas configurables
- Detección automática de dispositivos móviles

## Configuración

### Configuración Básica
```tsx
<Calendario
  datos={eventos}
  config={{
    teclado: {
      habilitado: true // Por defecto: true
    }
  }}
/>
```

### Configuración Avanzada
```tsx
<Calendario
  datos={eventos}
  config={{
    teclado: {
      habilitado: true,
      atajos: {
        hoy: 'h',        // Personalizable
        modoMes: 'm',    // Personalizable
        modoAño: 'a',    // Personalizable
        recargar: 'r',   // Atajo personalizado
        buscar: 'b'      // Otro atajo personalizado
      },
      onAccion: (accion, contexto) => {
        console.log('Acción:', accion);
        console.log('Contexto:', contexto.fechaActual, contexto.modoAnio);
        
        if (accion === 'recargar') {
          // Lógica personalizada para recargar datos
        }
        if (accion === 'buscar') {
          // Lógica personalizada para buscar
        }
      }
    }
  }}
/>
```

## Interfaz TypeScript

```tsx
interface ConfigTeclado {
  habilitado?: boolean; // default: true
  atajos?: {
    hoy?: string;      // default: 'h'
    modoMes?: string;  // default: 'm'  
    modoAño?: string;  // default: 'a'
    [key: string]: string | undefined; // Atajos personalizados
  };
  onAccion?: (accion: string, contexto: {
    fechaActual: Date;
    modoAnio: boolean;
  }) => void;
}
```

## Comportamiento Inteligente

### 🎯 Detección de Contexto
- **No interfiere** con campos de formulario activos (input, textarea, contentEditable)
- **Se desactiva automáticamente** en dispositivos móviles para evitar conflictos con gestos táctiles
- **Mantiene foco** en el calendario para una experiencia fluida

### 🗓️ Navegación Inteligente de Fechas
- **Transición fluida entre meses**: navegar días automáticamente cambia al mes siguiente/anterior cuando es necesario
- **Navegación de semanas**: moverse verticalmente navega por semanas completas (7 días)
- **Consistencia temporal**: mantiene la fecha seleccionada al cambiar entre modos

### 🔧 Integración con Estados
- **Compatible con calendarios controlados y no controlados**
- **Actualización automática** de estado interno
- **Sincronización** con props externos

## Casos de Uso Empresariales

### 📋 Aplicaciones de Gestión
```tsx
// Ejemplo: Sistema de citas médicas
<Calendario
  datos={citas}
  config={{
    teclado: {
      atajos: {
        hoy: 'h',
        modoMes: 'm',
        modoAño: 'a',
        nueva: 'n',      // Nueva cita
        urgente: 'u'     // Ver citas urgentes
      },
      onAccion: (accion) => {
        switch(accion) {
          case 'nueva':
            abrirDialogoNuevaCita();
            break;
          case 'urgente':
            filtrarCitasUrgentes();
            break;
        }
      }
    }
  }}
/>
```

### 📊 Paneles de Control
```tsx
// Ejemplo: Dashboard financiero
<Calendario
  datos={transacciones}
  config={{
    teclado: {
      atajos: {
        hoy: 'h',
        modoMes: 'm', 
        modoAño: 'a',
        reporte: 'r',    // Generar reporte
        exportar: 'e'    // Exportar datos
      },
      onAccion: (accion, contexto) => {
        if (accion === 'reporte') {
          generarReporte(contexto.fechaActual);
        }
        if (accion === 'exportar') {
          exportarTransacciones(contexto.fechaActual);
        }
      }
    }
  }}
/>
```

## Beneficios para Usuarios Empresariales

### 🚀 Productividad Mejorada
- **Navegación rápida** sin necesidad del ratón
- **Atajos mnémónicos** en español fáciles de recordar  
- **Flujo de trabajo** continuo y eficiente

### ♿ Accesibilidad
- **Compatible con lectores de pantalla**
- **Navegación por teclado completa** 
- **Cumple estándares WCAG**

### 🎨 Experiencia de Usuario
- **Intuitivo** para usuarios hispanohablantes
- **Configuración flexible** según necesidades del negocio
- **Respuesta inmediata** a las acciones del usuario

## Soporte Técnico

### 🔧 Depuración
```tsx
// Activar logs para debug
config={{
  teclado: {
    onAccion: (accion, contexto) => {
      console.log('Debug - Acción de teclado:', {
        accion,
        fecha: contexto.fechaActual,
        modoAnio: contexto.modoAnio
      });
    }
  }
}}
```

### 🧪 Testing
```tsx
// Ejemplo de test
import { fireEvent } from '@testing-library/react';

test('navegación con teclado funciona correctamente', () => {
  render(<Calendario datos={[]} />);
  
  // Simular presionar 'H' para ir a hoy
  fireEvent.keyDown(document, { key: 'h' });
  
  // Verificar que la fecha cambió
  expect(/* fecha actual */).toBe(/* hoy */);
});
```

### 🐛 Solución de Problemas Comunes
- **Los atajos no funcionan**: Verificar que no hay inputs con foco activo
- **No funciona en móvil**: Comportamiento esperado, usar gestos táctiles
- **Conflictos con otros atajos**: Personalizar la configuración de `atajos`

## Roadmap

### 🎯 Próximas Mejoras
- [ ] Atajos para selección múltiple de fechas
- [ ] Navegación por trimestres/semestres
- [ ] Integración con calendarios locales del sistema
- [ ] Soporte para múltiples idiomas automático
