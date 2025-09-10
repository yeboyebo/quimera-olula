import { useState } from 'react';
import { Calendario } from '../calendario';
import { ModoCalendario } from '../tipos';

/**
 * Ejemplo de uso del calendario con múltiples modos de vista
 * Demuestra las vistas mes, semana y año con datos dinámicos
 */

interface EjemploEvento {
  id: string;
  fecha: Date;
  titulo: string;
  categoria: 'trabajo' | 'personal' | 'importante' | 'reunion';
  duracion?: string;
}

export const EjemploModosMúltiples = () => {
  const [modoActual, setModoActual] = useState<ModoCalendario>('mes');
  const [estadísticas, setEstadísticas] = useState({
    eventosVisibles: 0,
    rangoActual: '',
    últimoCambio: ''
  });

  // Generar datos de ejemplo más ricos
  const generarEventos = (): EjemploEvento[] => {
    const eventos: EjemploEvento[] = [];
    const hoy = new Date();
    const categorias: EjemploEvento['categoria'][] = ['trabajo', 'personal', 'importante', 'reunion'];
    
    // Eventos del mes actual
    for (let i = 1; i <= 30; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), i);
      const numEventos = Math.floor(Math.random() * 4); // 0-3 eventos por día
      
      for (let j = 0; j < numEventos; j++) {
        eventos.push({
          id: `evento-${i}-${j}`,
          fecha: fecha,
          titulo: obtenerTítuloEvento(categorias[j % categorias.length], i),
          categoria: categorias[j % categorias.length],
          duracion: obtenerDuración(categorias[j % categorias.length])
        });
      }
    }
    
    // Agregar eventos del mes siguiente y anterior para mejor demo
    [-1, 1].forEach(offset => {
      for (let i = 1; i <= 15; i++) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + offset, i);
        if (Math.random() > 0.7) { // Menos eventos en meses adyacentes
          eventos.push({
            id: `evento-${offset}-${i}`,
            fecha: fecha,
            titulo: obtenerTítuloEvento(categorias[i % categorias.length], i),
            categoria: categorias[i % categorias.length],
            duracion: obtenerDuración(categorias[i % categorias.length])
          });
        }
      }
    });

    return eventos;
  };

  const obtenerTítuloEvento = (categoria: EjemploEvento['categoria'], día: number): string => {
    const títulos = {
      trabajo: [`Presentación Q${Math.ceil(día/10)}`, `Reunión proyecto ${día}`, `Entrega fase ${día}`, `Review semanal`],
      personal: [`Cita médica`, `Cumpleaños familia`, `Actividad deportiva`, `Planes fin semana`],
      importante: [`Deadline proyecto`, `Reunión directorio`, `Presentación cliente`, `Audit compliance`],
      reunion: [`Standup diario`, `Weekly review`, `All hands`, `1:1 con manager`]
    };
    return títulos[categoria][día % títulos[categoria].length];
  };

  const obtenerDuración = (categoria: EjemploEvento['categoria']): string => {
    const duraciones = {
      trabajo: ['2h', '1h', '30min', '45min'],
      personal: ['1h', '2h', '3h', 'Todo el día'],
      importante: ['1h 30min', '2h', '45min', '3h'],
      reunion: ['30min', '1h', '15min', '45min']
    };
    return duraciones[categoria][Math.floor(Math.random() * duraciones[categoria].length)];
  };

  const eventos = generarEventos();

  const manejarCambioModo = (nuevoModo: ModoCalendario, contexto: { fechaActual: Date }) => {
    const modoAnterior = modoActual;
    setModoActual(nuevoModo);
    setEstadísticas(prev => ({
      ...prev,
      últimoCambio: `${modoAnterior || 'inicial'} → ${nuevoModo} (${new Date().toLocaleTimeString('es-ES')})`,
      rangoActual: obtenerRangoTexto(nuevoModo, contexto.fechaActual)
    }));
  };

  const obtenerRangoTexto = (modo: ModoCalendario, fecha: Date): string => {
    switch (modo) {
      case 'mes':
        return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      case 'semana': {
        const inicioSemana = new Date(fecha);
        inicioSemana.setDate(fecha.getDate() - fecha.getDay() + 1);
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);
        return `${inicioSemana.toLocaleDateString('es-ES')} - ${finSemana.toLocaleDateString('es-ES')}`;
      }
      case 'anio':
        return `Año ${fecha.getFullYear()}`;
      default:
        return 'Rango no disponible';
    }
  };

  const colorPorCategoría = {
    trabajo: '#3498db',
    personal: '#e74c3c',
    importante: '#f39c12',
    reunion: '#9b59b6'
  };

  const iconoPorCategoría = {
    trabajo: '💼',
    personal: '🏠',
    importante: '⭐',
    reunion: '👥'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2>🔄 Ejemplo: Múltiples Modos de Vista</h2>
      
      {/* Panel de control y estadísticas */}
      <div style={{ 
        marginBottom: '25px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px'
      }}>
        {/* Modo actual */}
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          border: '1px solid #c3e6c3'
        }}>
          <h4>📅 Modo Actual</h4>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>
            {modoActual.charAt(0).toUpperCase() + modoActual.slice(1)}
          </div>
          <div style={{ fontSize: '0.9rem', marginTop: '5px', color: '#666' }}>
            {estadísticas.rangoActual}
          </div>
        </div>

        {/* Estadísticas de eventos */}
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <h4>📊 Estadísticas</h4>
          <div>Total de eventos: <strong>{eventos.length}</strong></div>
          <div style={{ fontSize: '0.9rem', marginTop: '5px', color: '#666' }}>
            Por categoría:
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
              {Object.keys(colorPorCategoría).map(cat => (
                <span key={cat} style={{ fontSize: '0.8rem' }}>
                  {iconoPorCategoría[cat as keyof typeof iconoPorCategoría]} {eventos.filter(e => e.categoria === cat).length}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Último cambio */}
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4>🕐 Último Cambio</h4>
          <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>
            {estadísticas.últimoCambio || 'Sin cambios aún...'}
          </div>
        </div>
      </div>

      {/* Leyenda de categorías */}
      <div style={{ marginBottom: '20px' }}>
        <h4>🏷️ Categorías de Eventos</h4>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {Object.entries(colorPorCategoría).map(([categoria, color]) => (
            <div key={categoria} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: color, 
                borderRadius: '50%' 
              }} />
              <span style={{ fontSize: '0.9rem' }}>
                {iconoPorCategoría[categoria as keyof typeof iconoPorCategoría]} {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendario con múltiples modos */}
      <Calendario
        calendarioId="calendario-ejemplo-modos-múltiples"
        datos={eventos}
        config={{
          cabecera: {
            mostrarCambioModo: true,
            mostrarControlesNavegacion: true,
            mostrarBotonHoy: true,
            modos: ['mes', 'semana', 'anio'],
          },
          teclado: {
            habilitado: true,
            onAccion: (accion, contexto) => {
              if (['modoMes', 'modoSemana', 'modoAño'].includes(accion)) {
                const nuevoModo = accion.replace('modo', '').toLowerCase() as ModoCalendario;
                manejarCambioModo(nuevoModo === 'anio' ? 'anio' : nuevoModo, contexto);
              }
            }
          },
          maxDatosVisibles: 4, // Mostrar hasta 4 eventos por día
        }}
        renderDato={(evento) => (
          <div style={{ 
            backgroundColor: colorPorCategoría[evento.categoria],
            color: 'white', 
            padding: '4px 6px', 
            borderRadius: '4px',
            fontSize: '0.75rem',
            margin: '1px 0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              fontWeight: '500' 
            }}>
              <span>{iconoPorCategoría[evento.categoria]}</span>
              <span>{evento.titulo}</span>
            </div>
            {evento.duracion && (
              <div style={{ 
                fontSize: '0.65rem', 
                opacity: 0.9,
                marginTop: '1px'
              }}>
                ⏱️ {evento.duracion}
              </div>
            )}
          </div>
        )}
      />

      {/* Guía de uso */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>📖 Guía de Modos de Vista</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '15px' }}>
          <div>
            <h5>📅 Modo Mes</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Vista:</strong> Mes completo en cuadrícula</li>
              <li><strong>Ideal para:</strong> Planificación mensual, vista general</li>
              <li><strong>Navegación:</strong> ←→ cambia meses</li>
              <li><strong>Eventos:</strong> Número máximo visible por día configurable</li>
            </ul>
          </div>
          
          <div>
            <h5>📆 Modo Semana</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Vista:</strong> 7 días en detalle</li>
              <li><strong>Ideal para:</strong> Planificación semanal, agenda detallada</li>
              <li><strong>Navegación:</strong> ←→ cambia semanas</li>
              <li><strong>Eventos:</strong> Todos los eventos visibles</li>
            </ul>
          </div>
          
          <div>
            <h5>📊 Modo Año</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Vista:</strong> 12 meses en miniatura</li>
              <li><strong>Ideal para:</strong> Visión anual, planificación estratégica</li>
              <li><strong>Navegación:</strong> ←→ cambia años</li>
              <li><strong>Eventos:</strong> Indicadores de densidad</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d1ecf1', borderRadius: '4px', fontSize: '0.9rem' }}>
          <strong>💡 Consejo:</strong> Usa las teclas <kbd>M</kbd>, <kbd>S</kbd> y <kbd>A</kbd> para cambiar rápidamente entre modos, 
          o haz clic en los botones de la cabecera del calendario.
        </div>
      </div>
    </div>
  );
};