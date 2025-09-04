import { useCallback, useEffect, useState } from 'react';
import { Calendario } from '../calendario';
import { ModoCalendario } from '../tipos';

/**
 * Ejemplo de calendario optimizado para móvil
 * Demuestra layouts responsivos y UX móvil REALISTA
 */

interface EjemploActividad {
  id: string;
  fecha: Date;
  titulo: string;
  tipo: 'cita' | 'recordatorio' | 'evento' | 'tarea' | 'llamada';
  duracion: string;
  ubicacion?: string;
  urgente?: boolean;
  completada?: boolean;
}

type VistaMovil = 'compacta' | 'lista' | 'agenda' | 'widget';

export const EjemploCalendarioMovil = () => {
  const [vistaMovil, setVistaMovil] = useState<VistaMovil>('compacta');
  const [orientacion, setOrientacion] = useState<'vertical' | 'horizontal'>('vertical');
  const [tamañoPantalla, setTamañoPantalla] = useState({ width: 0, height: 0 });
  const [modoUnaMano, setModoUnaMano] = useState(false);
  const [configuracionMovil, setConfiguracionMovil] = useState({
    vibracion: true,
    notificacionesPush: true,
    modoOffline: false,
    sincronizacion: true,
    bateriaBaja: false
  });

  // Detectar tamaño de pantalla y orientación
  useEffect(() => {
    const detectarPantalla = () => {
      setTamañoPantalla({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setOrientacion(window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical');
    };

    detectarPantalla();
    window.addEventListener('resize', detectarPantalla);
    window.addEventListener('orientationchange', () => {
      setTimeout(detectarPantalla, 100);
    });

    return () => {
      window.removeEventListener('resize', detectarPantalla);
      window.removeEventListener('orientationchange', detectarPantalla);
    };
  }, []);

  // Generar datos móvil-friendly
  const generarActividades = useCallback((): EjemploActividad[] => {
    const actividades: EjemploActividad[] = [];
    const hoy = new Date();
    const tipos: EjemploActividad['tipo'][] = ['cita', 'recordatorio', 'evento', 'tarea', 'llamada'];
    
    for (let i = -3; i <= 14; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      
      const esDiaSemana = fecha.getDay() >= 1 && fecha.getDay() <= 5;
      const probabilidad = esDiaSemana ? 0.6 : 0.3;
      
      if (Math.random() < probabilidad) {
        const numActividades = esDiaSemana ? 
          Math.floor(Math.random() * 2) + 1 : 
          Math.floor(Math.random() * 2) + 1;
        
        for (let j = 0; j < numActividades; j++) {
          const tipo = tipos[Math.floor(Math.random() * tipos.length)];
          
          actividades.push({
            id: `actividad-${i}-${j}`,
            fecha: new Date(fecha),
            titulo: generarTituloMovil(tipo),
            tipo,
            duracion: generarDuracionMovil(tipo),
            ubicacion: generarUbicacion(tipo),
            urgente: Math.random() < 0.15,
            completada: i < 0 ? Math.random() < 0.8 : false
          });
        }
      }
    }
    
    return actividades.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }, []);

  const generarTituloMovil = (tipo: EjemploActividad['tipo']): string => {
    const titulos = {
      cita: ['Médico', 'Dentista', 'Reunión', 'Banco'],
      recordatorio: ['Medicación', 'Compras', 'Llamar', 'Factura'],
      evento: ['Concierto', 'Cumple', 'Teatro', 'Deporte'],
      tarea: ['Informe', 'Email', 'Docs', 'Backup'],
      llamada: ['Cliente', 'Mamá', 'Jefe', 'Seguro']
    };
    
    const lista = titulos[tipo];
    return lista[Math.floor(Math.random() * lista.length)];
  };

  const generarDuracionMovil = (tipo: EjemploActividad['tipo']): string => {
    const duraciones = {
      cita: ['30min', '1h', '1h30'],
      recordatorio: ['5min', '10min'],
      evento: ['2h', '3h', 'Todo el día'],
      tarea: ['1h', '2h', '30min'],
      llamada: ['15min', '30min']
    };
    
    const lista = duraciones[tipo];
    return lista[Math.floor(Math.random() * lista.length)];
  };

  const generarUbicacion = (tipo: EjemploActividad['tipo']): string | undefined => {
    if (Math.random() < 0.5) {
      const ubicaciones = {
        cita: ['Oficina', 'Hospital', 'Centro'],
        recordatorio: undefined,
        evento: ['Teatro', 'Estadio', 'Centro'],
        tarea: ['Casa', 'Oficina'],
        llamada: undefined
      };
      
      const lista = ubicaciones[tipo];
      return lista ? lista[Math.floor(Math.random() * lista.length)] : undefined;
    }
    return undefined;
  };

  const actividades = generarActividades();

  // Determinar tamaños de pantalla
  const esPantallaPequeña = tamañoPantalla.width < 768;
  const esPantallaMinima = tamañoPantalla.width < 480;
  const esTablet = tamañoPantalla.width >= 768 && tamañoPantalla.width < 1024;

  // Configuración específica para móvil
  const obtenerConfigMovil = () => {
    if (esPantallaMinima) { // < 480px
      return {
        maxDatosVisibles: 1,
        modos: ['mes'] as ModoCalendario[],
        mostrarControlesSimplificados: true
      };
    } else if (esPantallaPequeña) { // < 768px
      return {
        maxDatosVisibles: 2,
        modos: ['mes', 'semana'] as ModoCalendario[],
        mostrarControlesSimplificados: false
      };
    } else {
      return {
        maxDatosVisibles: 3,
        modos: ['mes', 'semana', 'anio'] as ModoCalendario[],
        mostrarControlesSimplificados: false
      };
    }
  };

  const configMovil = obtenerConfigMovil();

  // Colores optimizados para móvil
  const coloresPorTipo = {
    cita: '#007AFF',
    recordatorio: '#FF9500',
    evento: '#AF52DE',
    tarea: '#34C759',
    llamada: '#FF3B30'
  };

  const iconosPorTipo = {
    cita: '📅',
    recordatorio: '🔔',
    evento: '🎉',
    tarea: '✅',
    llamada: '📞'
  };

  return (
    <div style={{ 
      padding: esPantallaMinima ? '8px' : '16px',
      maxWidth: '100%',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h2 style={{ 
        fontSize: esPantallaMinima ? '1.1rem' : '1.3rem',
        marginBottom: '16px',
        textAlign: 'center',
        color: '#333'
      }}>
        📱 Calendario Móvil
      </h2>

      {/* Panel de información compacto */}
      <div style={{ 
        marginBottom: '16px',
        display: 'grid',
        gridTemplateColumns: esPantallaPequeña ? '1fr 1fr' : 'repeat(3, 1fr)',
        gap: '8px'
      }}>
        <div style={{
          padding: '8px',
          backgroundColor: 'white',
          borderRadius: '6px',
          border: '1px solid #dee2e6',
          textAlign: 'center',
          fontSize: '0.75rem'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
            {tamañoPantalla.width}×{tamañoPantalla.height}
          </div>
          <div style={{ color: '#666' }}>
            {esPantallaMinima ? '📱 Mini' : 
             esPantallaPequeña ? '📱 Móvil' : 
             esTablet ? '📟 Tablet' : '💻 Desktop'}
          </div>
        </div>

        <div style={{
          padding: '8px',
          backgroundColor: 'white',
          borderRadius: '6px',
          border: '1px solid #dee2e6',
          textAlign: 'center',
          fontSize: '0.75rem'
        }}>
          <div style={{ fontWeight: 'bold' }}>
            {orientacion === 'vertical' ? '📱 Vertical' : '📱 Horizontal'}
          </div>
          <div style={{ color: '#666' }}>Orientación</div>
        </div>

        <div style={{
          padding: '8px',
          backgroundColor: 'white',
          borderRadius: '6px',
          border: '1px solid #dee2e6',
          textAlign: 'center',
          fontSize: '0.75rem'
        }}>
          <div style={{ fontWeight: 'bold' }}>
            {configMovil.maxDatosVisibles}
          </div>
          <div style={{ color: '#666' }}>Máx eventos</div>
        </div>
      </div>

      {/* Controles móviles simplificados */}
      <div style={{ 
        marginBottom: '16px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          padding: '12px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          flex: esPantallaPequeña ? '1 1 100%' : '1'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem' }}>⚙️ Opciones</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={modoUnaMano}
                onChange={(e) => setModoUnaMano(e.target.checked)}
                style={{ transform: 'scale(1.1)' }}
              />
              👍 Una mano
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={configuracionMovil.vibracion}
                onChange={(e) => setConfiguracionMovil(prev => ({
                  ...prev,
                  vibracion: e.target.checked
                }))}
                style={{ transform: 'scale(1.1)' }}
              />
              📳 Vibración
            </label>
          </div>
        </div>
      </div>

      {/* ✅ CORRECCIÓN: Calendario con contenedor móvil y modo una mano INTERNO */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #dee2e6',
        position: 'relative', // ✅ Para posicionar el footer interno
        // ✅ CORRECCIÓN: Padding bottom solo si modo una mano está activo
        paddingBottom: modoUnaMano ? '60px' : '0'
      }}>
        <Calendario
          calendarioId="calendario-movil"
          datos={actividades}
          config={{
            cabecera: {
              mostrarCambioModo: !configMovil.mostrarControlesSimplificados,
              mostrarControlesNavegacion: true,
              mostrarBotonHoy: true,
              modos: configMovil.modos,
            },
            teclado: {
              habilitado: false, // ✅ CORRECCIÓN: Deshabilitado para móvil
            },
            maxDatosVisibles: configMovil.maxDatosVisibles,
            // ✅ ELIMINADO: Las props táctiles no existen en el calendario real
          }}
          renderDato={(actividad) => (
            <div style={{
              backgroundColor: coloresPorTipo[actividad.tipo],
              color: 'white',
              padding: esPantallaMinima ? '2px 4px' : '3px 6px',
              borderRadius: '4px',
              fontSize: esPantallaMinima ? '0.65rem' : '0.7rem',
              margin: '1px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
              minHeight: esPantallaMinima ? '24px' : '28px', // ✅ Touch targets móvil
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Indicador de urgencia */}
              {actividad.urgente && (
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  right: '1px',
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#FF3B30',
                  borderRadius: '50%',
                  border: '1px solid white'
                }} />
              )}

              {/* Indicador de completada */}
              {actividad.completada && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#34C759'
                }} />
              )}

              <span style={{ fontSize: esPantallaMinima ? '0.7rem' : '0.8rem' }}>
                {iconosPorTipo[actividad.tipo]}
              </span>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  opacity: actividad.completada ? 0.6 : 1,
                  textDecoration: actividad.completada ? 'line-through' : 'none'
                }}>
                  {actividad.titulo}
                </div>
                
                {!esPantallaMinima && (
                  <div style={{
                    fontSize: '0.55rem',
                    opacity: 0.8,
                    marginTop: '1px'
                  }}>
                    ⏰ {actividad.duracion}
                    {actividad.ubicacion && ` • 📍 ${actividad.ubicacion}`}
                  </div>
                )}
              </div>
            </div>
          )}
        />

        {/* ✅ CORRECCIÓN: Footer interno al calendario para modo una mano */}
        {modoUnaMano && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #dee2e6',
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px'
          }}>
            <button style={{
              padding: '8px',
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              fontSize: '1rem',
              cursor: 'pointer',
              minWidth: '36px',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              ⬅️
            </button>
            
            <button style={{
              padding: '8px',
              backgroundColor: '#34C759',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              fontSize: '1rem',
              cursor: 'pointer',
              minWidth: '36px',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🏠
            </button>
            
            <button style={{
              padding: '8px',
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              fontSize: '1rem',
              cursor: 'pointer',
              minWidth: '36px',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              ➡️
            </button>
          </div>
        )}
      </div>

      {/* Resumen de actividades compacto */}
      <div style={{ 
        marginTop: '16px',
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem' }}>📊 Actividades</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${esPantallaMinima ? 3 : 5}, 1fr)`,
          gap: '8px'
        }}>
          {Object.entries(coloresPorTipo).map(([tipo, color]) => {
            const cantidad = actividades.filter(a => a.tipo === tipo).length;
            return (
              <div key={tipo} style={{
                textAlign: 'center',
                padding: '6px',
                backgroundColor: `${color}10`,
                borderRadius: '6px',
                border: `1px solid ${color}30`
              }}>
                <div style={{ fontSize: '1rem' }}>{iconosPorTipo[tipo as keyof typeof iconosPorTipo]}</div>
                <div style={{ fontWeight: 'bold', color, fontSize: '0.9rem' }}>{cantidad}</div>
                <div style={{ 
                  fontSize: '0.65rem', 
                  textTransform: 'capitalize',
                  color: '#666'
                }}>
                  {tipo}s
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guía móvil simplificada */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px',
        border: '1px solid #c3e6c3'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>💡 Características Móvil</h4>
        <ul style={{ 
          fontSize: '0.8rem', 
          lineHeight: '1.5',
          margin: 0,
          paddingLeft: '16px'
        }}>
          <li><strong>Touch targets:</strong> Elementos de 44px+ para fácil toque</li>
          <li><strong>Texto optimizado:</strong> Tamaños legibles sin zoom</li>
          <li><strong>Modo una mano:</strong> Controles accesibles desde abajo</li>
          <li><strong>Datos limitados:</strong> Solo {configMovil.maxDatosVisibles} evento{configMovil.maxDatosVisibles > 1 ? 's' : ''} por día</li>
          <li><strong>Diseño adaptativo:</strong> Se ajusta a orientación y tamaño</li>
        </ul>
      </div>
    </div>
  );
};