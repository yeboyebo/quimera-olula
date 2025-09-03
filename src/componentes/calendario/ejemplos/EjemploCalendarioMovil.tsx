import { useCallback, useEffect, useState } from 'react';
import { Calendario } from '../calendario';
import { ModoCalendario } from '../tipos';

/**
 * Ejemplo de calendario optimizado para móvil
 * Demuestra gestos táctiles, layouts responsivos y UX móvil
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
  const [gestosHabilitados, setGestosHabilitados] = useState(true);
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
      setTimeout(detectarPantalla, 100); // Delay para orientación
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
    
    // Generar actividades para las próximas 2 semanas (enfoque móvil)
    for (let i = -3; i <= 14; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      
      // Más actividades en días de semana
      const esDiaSemana = fecha.getDay() >= 1 && fecha.getDay() <= 5;
      const probabilidad = esDiaSemana ? 0.7 : 0.4;
      
      if (Math.random() < probabilidad) {
        const numActividades = esDiaSemana ? 
          Math.floor(Math.random() * 4) + 2 : // 2-5 actividades días laborales
          Math.floor(Math.random() * 2) + 1;  // 1-2 actividades fines de semana
        
        for (let j = 0; j < numActividades; j++) {
          const tipo = tipos[Math.floor(Math.random() * tipos.length)];
          
          actividades.push({
            id: `actividad-${i}-${j}`,
            fecha: new Date(fecha),
            titulo: generarTituloMovil(tipo, esDiaSemana),
            tipo,
            duracion: generarDuracionMovil(tipo),
            ubicacion: generarUbicacion(tipo),
            urgente: Math.random() < 0.15, // 15% urgentes
            completada: i < 0 ? Math.random() < 0.8 : false // Pasadas mayormente completadas
          });
        }
      }
    }
    
    return actividades.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }, []);

  const generarTituloMovil = (tipo: EjemploActividad['tipo'], esDiaSemana: boolean): string => {
    const titulos = {
      cita: esDiaSemana ? 
        ['Reunión cliente', 'Cita médica', 'Entrevista trabajo', 'Reunión equipo', 'Cita banco'] :
        ['Cita peluquería', 'Visita familia', 'Cita dentista', 'Reunión social'],
      recordatorio: [
        'Tomar medicación', 'Llamar mamá', 'Comprar leche', 'Pagar factura luz', 
        'Revisar email', 'Sacar basura', 'Regar plantas'
      ],
      evento: esDiaSemana ?
        ['Conferencia tech', 'Seminario', 'Workshop', 'Presentación'] :
        ['Concierto', 'Fiesta cumple', 'Obra teatro', 'Evento deportivo'],
      tarea: [
        'Enviar informe', 'Revisar documentos', 'Preparar presentación', 
        'Actualizar portfolio', 'Hacer backup', 'Limpiar escritorio'
      ],
      llamada: [
        'Llamar cliente', 'Contactar proveedor', 'Hablar con jefe', 
        'Llamar seguro', 'Confirmar cita', 'Seguimiento proyecto'
      ]
    };
    
    const lista = titulos[tipo];
    return lista[Math.floor(Math.random() * lista.length)];
  };

  const generarDuracionMovil = (tipo: EjemploActividad['tipo']): string => {
    const duraciones = {
      cita: ['30min', '1h', '1h 30min', '2h'],
      recordatorio: ['5min', '10min', '15min'],
      evento: ['1h', '2h', '3h', 'Todo el día'],
      tarea: ['30min', '1h', '2h', '4h'],
      llamada: ['10min', '15min', '30min', '45min']
    };
    
    const lista = duraciones[tipo];
    return lista[Math.floor(Math.random() * lista.length)];
  };

  const generarUbicacion = (tipo: EjemploActividad['tipo']): string | undefined => {
    if (Math.random() < 0.6) { // 60% tienen ubicación
      const ubicaciones = {
        cita: ['Oficina central', 'Hospital General', 'Café Starbucks', 'Sala de juntas'],
        recordatorio: undefined, // Los recordatorios no suelen tener ubicación
        evento: ['Centro de convenciones', 'Teatro Principal', 'Estadio Municipal', 'Auditorio'],
        tarea: ['Casa', 'Oficina', 'Coworking', 'Biblioteca'],
        llamada: undefined // Las llamadas no tienen ubicación física
      };
      
      const lista = ubicaciones[tipo];
      return lista ? lista[Math.floor(Math.random() * lista.length)] : undefined;
    }
    return undefined;
  };

  const actividades = generarActividades();

  // Determinar si estamos en móvil real
  const esPantallaPequeña = tamañoPantalla.width < 768;
  const esPantallaMinima = tamañoPantalla.width < 480;
  const esTablet = tamañoPantalla.width >= 768 && tamañoPantalla.width < 1024;

  // Configuración específica para móvil
  const obtenerConfigMovil = () => {
    if (esPantallaMinima) {
      return {
        maxDatosVisibles: 2,
        modos: ['mes'] as ModoCalendario[], // Solo mes en pantallas muy pequeñas
        mostrarControlesSimplificados: true
      };
    } else if (esPantallaPequeña) {
      return {
        maxDatosVisibles: 3,
        modos: ['mes', 'semana'] as ModoCalendario[],
        mostrarControlesSimplificados: false
      };
    } else {
      return {
        maxDatosVisibles: 4,
        modos: ['mes', 'semana', 'anio'] as ModoCalendario[],
        mostrarControlesSimplificados: false
      };
    }
  };

  const configMovil = obtenerConfigMovil();

  // Manejar gestos táctiles
  const manejarGestoTactil = useCallback((gesto: string, datos: any) => {
    if (!gestosHabilitados) return;

    // Feedback háptico si está disponible
    if (configuracionMovil.vibracion && 'vibrate' in navigator) {
      navigator.vibrate(50); // Vibración corta
    }

    console.log(`📱 Gesto táctil: ${gesto}`, datos);
    
    switch (gesto) {
      case 'swipeLeft':
        // Navegar al mes/semana siguiente
        break;
      case 'swipeRight':
        // Navegar al mes/semana anterior
        break;
      case 'pinchZoom':
        // Cambiar entre modos de vista
        break;
      case 'longPress':
        // Mostrar opciones contextuales
        break;
    }
  }, [gestosHabilitados, configuracionMovil.vibracion]);

  // Colores optimizados para móvil (mayor contraste)
  const coloresPorTipo = {
    cita: '#007AFF',      // Azul iOS
    recordatorio: '#FF9500', // Naranja iOS
    evento: '#AF52DE',    // Púrpura iOS
    tarea: '#34C759',     // Verde iOS
    llamada: '#FF3B30'    // Rojo iOS
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
      padding: esPantallaMinima ? '10px' : '20px',
      maxWidth: '100%',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h2 style={{ 
        fontSize: esPantallaMinima ? '1.2rem' : '1.5rem',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        📱 Ejemplo: Calendario Móvil
      </h2>

      {/* Panel de información de dispositivo */}
      <div style={{ 
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: esPantallaPequeña ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px'
      }}>
        <div style={{
          padding: '10px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Pantalla</div>
          <div style={{ fontWeight: 'bold' }}>
            {tamañoPantalla.width}x{tamañoPantalla.height}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>
            {esPantallaMinima ? '📱 Móvil Mini' : 
             esPantallaPequeña ? '📱 Móvil' : 
             esTablet ? '📟 Tablet' : '💻 Desktop'}
          </div>
        </div>

        <div style={{
          padding: '10px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Orientación</div>
          <div style={{ fontWeight: 'bold' }}>
            {orientacion === 'vertical' ? '📱 Vertical' : '📱 Horizontal'}
          </div>
        </div>

        <div style={{
          padding: '10px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Vista</div>
          <div style={{ fontWeight: 'bold' }}>
            {configMovil.modos.length} modo{configMovil.modos.length > 1 ? 's' : ''}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>
            Máx {configMovil.maxDatosVisibles} eventos
          </div>
        </div>
      </div>

      {/* Controles móviles */}
      <div style={{ 
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: esPantallaPequeña ? '1fr' : '1fr 1fr',
        gap: '15px'
      }}>
        {/* Vista móvil */}
        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '10px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>📱 Modo Vista</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['compacta', 'lista', 'agenda', 'widget'] as VistaMovil[]).map((vista) => (
              <button
                key={vista}
                onClick={() => setVistaMovil(vista)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: vista === vistaMovil ? '#007AFF' : 'transparent',
                  color: vista === vistaMovil ? 'white' : '#333',
                  border: '1px solid #007AFF',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  minHeight: '36px' // Mejores touch targets
                }}
              >
                {vista}
              </button>
            ))}
          </div>
        </div>

        {/* Configuración móvil */}
        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '10px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>⚙️ Opciones</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.85rem',
              minHeight: '32px' // Touch target
            }}>
              <input
                type="checkbox"
                checked={gestosHabilitados}
                onChange={(e) => setGestosHabilitados(e.target.checked)}
                style={{ transform: 'scale(1.2)' }} // Checkboxes más grandes
              />
              🤏 Gestos táctiles
            </label>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.85rem',
              minHeight: '32px'
            }}>
              <input
                type="checkbox"
                checked={modoUnaMano}
                onChange={(e) => setModoUnaMano(e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              👍 Modo una mano
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.85rem',
              minHeight: '32px'
            }}>
              <input
                type="checkbox"
                checked={configuracionMovil.vibracion}
                onChange={(e) => setConfiguracionMovil(prev => ({
                  ...prev,
                  vibracion: e.target.checked
                }))}
                style={{ transform: 'scale(1.2)' }}
              />
              📳 Vibración
            </label>
          </div>
        </div>
      </div>

      {/* Estadísticas de actividades */}
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem' }}>📊 Resumen de Actividades</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${esPantallaMinima ? 2 : 5}, 1fr)`,
          gap: '10px'
        }}>
          {Object.entries(coloresPorTipo).map(([tipo, color]) => {
            const cantidad = actividades.filter(a => a.tipo === tipo).length;
            return (
              <div key={tipo} style={{
                textAlign: 'center',
                padding: '8px',
                backgroundColor: `${color}15`,
                borderRadius: '8px',
                border: `1px solid ${color}30`
              }}>
                <div style={{ fontSize: '1.2rem' }}>{iconosPorTipo[tipo as keyof typeof iconosPorTipo]}</div>
                <div style={{ fontWeight: 'bold', color }}>{cantidad}</div>
                <div style={{ 
                  fontSize: '0.7rem', 
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

      {/* Calendario móvil */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #dee2e6',
        marginBottom: modoUnaMano ? '80px' : '20px' // Espacio extra para modo una mano
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
              habilitado: false, // Deshabilitado en móvil
            },
            maxDatosVisibles: configMovil.maxDatosVisibles,
            // Configuraciones específicas móvil
            // tactil: {
            //   habilitado: gestosHabilitados,
            //   onSwipe: manejarGestoTactil,
            //   onLongPress: manejarGestoTactil,
            //   onPinch: manejarGestoTactil
            // }
          }}
          renderDato={(actividad) => (
            <div style={{
              backgroundColor: coloresPorTipo[actividad.tipo],
              color: 'white',
              padding: esPantallaMinima ? '3px 6px' : '4px 8px',
              borderRadius: '6px',
              fontSize: esPantallaMinima ? '0.7rem' : '0.75rem',
              margin: '1px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              // Optimizaciones táctiles
              minHeight: esPantallaMinima ? '28px' : '32px', // Mejores touch targets
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Indicador de urgencia */}
              {actividad.urgente && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '8px',
                  height: '8px',
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

              <span style={{ fontSize: esPantallaMinima ? '0.8rem' : '0.9rem' }}>
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
                    fontSize: '0.6rem',
                    opacity: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '2px'
                  }}>
                    <span>⏰ {actividad.duracion}</span>
                    {actividad.ubicacion && (
                      <span>📍 {actividad.ubicacion}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        />
      </div>

      {/* Guía de UX móvil */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        border: '1px solid #dee2e6'
      }}>
        <h4>📖 Guía: Optimización para Móvil</h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: esPantallaPequeña ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div>
            <h5>📱 Diseño Responsivo</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Touch targets:</strong> Mínimo 44px (iOS) / 48px (Android)</li>
              <li><strong>Texto legible:</strong> Mínimo 16px para evitar zoom</li>
              <li><strong>Espaciado:</strong> Suficiente para dedos grandes</li>
              <li><strong>Contraste:</strong> WCAG AA para exteriores</li>
            </ul>
          </div>

          <div>
            <h5>🤏 Gestos Táctiles</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Swipe horizontal:</strong> Navegar meses/semanas</li>
              <li><strong>Pinch zoom:</strong> Cambiar vista (mes/semana/día)</li>
              <li><strong>Long press:</strong> Menú contextual</li>
              <li><strong>Double tap:</strong> Zoom a día específico</li>
            </ul>
          </div>

          <div>
            <h5>⚡ Rendimiento</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Lazy loading:</strong> Cargar datos según vista</li>
              <li><strong>Virtualización:</strong> Solo elementos visibles</li>
              <li><strong>Debounce:</strong> Evitar renders excesivos</li>
              <li><strong>Cache local:</strong> Offline-first approach</li>
            </ul>
          </div>

          <div>
            <h5>🔋 Consideraciones Móvil</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Batería:</strong> Reducir animaciones si está baja</li>
              <li><strong>Conexión:</strong> Modo offline cuando no hay red</li>
              <li><strong>Orientación:</strong> Adaptar layout automáticamente</li>
              <li><strong>Notificaciones:</strong> Push con vibración</li>
            </ul>
          </div>
        </div>

        {/* Métricas en tiempo real */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px'
        }}>
          <h5>📊 Métricas del Dispositivo</h5>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${esPantallaPequeña ? 2 : 4}, 1fr)`,
            gap: '15px',
            marginTop: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {tamañoPantalla.width}px
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Ancho</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {tamañoPantalla.height}px
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Alto</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {Math.round((tamañoPantalla.width / tamañoPantalla.height) * 10) / 10}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Ratio</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {window.devicePixelRatio || 1}x
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>DPR</div>
            </div>
          </div>

          {/* Estadísticas de rendimiento móvil */}
          <div style={{
            marginTop: '15px',
            fontSize: '0.85rem',
            color: '#555'
          }}>
            <div><strong>Conexión:</strong> {(navigator as any).connection?.effectiveType || 'Desconocida'}</div>
            <div><strong>User Agent:</strong> {navigator.userAgent.includes('Mobile') ? '📱 Móvil' : '💻 Desktop'}</div>
            <div><strong>Touch:</strong> {'ontouchstart' in window ? '✅ Disponible' : '❌ No disponible'}</div>
          </div>
        </div>
      </div>

      {/* Footer de navegación fija para modo una mano */}
      {modoUnaMano && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #dee2e6',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <button style={{
            padding: '12px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '1.2rem',
            cursor: 'pointer',
            minWidth: '44px',
            minHeight: '44px'
          }}>
            ⬅️
          </button>
          
          <button style={{
            padding: '12px',
            backgroundColor: '#34C759',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '1.2rem',
            cursor: 'pointer',
            minWidth: '44px',
            minHeight: '44px'
          }}>
            🏠
          </button>
          
          <button style={{
            padding: '12px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '1.2rem',
            cursor: 'pointer',
            minWidth: '44px',
            minHeight: '44px'
          }}>
            ➡️
          </button>
        </div>
      )}
    </div>
  );
};