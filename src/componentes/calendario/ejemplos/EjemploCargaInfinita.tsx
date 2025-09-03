import { useCallback, useEffect, useRef, useState } from 'react';
import { Calendario } from '../calendario';

/**
 * Ejemplo de carga infinita en el calendario
 * Demuestra cómo cargar datos dinámicamente cuando el usuario navega
 * hacia fechas anteriores o posteriores
 */

interface EjemploTarea {
  id: string;
  fecha: Date;
  titulo: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_progreso' | 'completada';
  equipo: string;
  estimacion?: string;
}

interface RangoDatos {
  inicio: Date;
  fin: Date;
  cargado: boolean;
}

export const EjemploCargaInfinita = () => {
  const [tareas, setTareas] = useState<EjemploTarea[]>([]);
  const [cargando, setCargando] = useState(false);
  const [rangosCargados, setRangosCargados] = useState<RangoDatos[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    totalCargadas: 0,
    ultimaCarga: '',
    rangoActual: '',
    peticionesCarga: 0
  });
  
  // ✅ CORRECCIÓN: Usar number en lugar de NodeJS.Timeout y inicializar con null
  const timeoutRef = useRef<number | null>(null);

  // ✅ Funciones helper movidas arriba para poder ser usadas en useCallback
  const generarTituloTarea = useCallback((equipo: string, prioridad: EjemploTarea['prioridad']): string => {
    const bases = {
      Frontend: ['Implementar componente', 'Refactor página', 'Fix responsive', 'Optimizar renders'],
      Backend: ['API endpoints', 'Migration BD', 'Optimizar queries', 'Setup microservicio'],
      DevOps: ['Deploy pipeline', 'Config monitoring', 'Setup CI/CD', 'Scaling infra'],
      QA: ['Test suite', 'Bug fixes', 'Automation tests', 'Load testing'],
      Design: ['UI mockups', 'UX research', 'Design system', 'Prototype'],
      Product: ['Feature specs', 'User stories', 'Analytics setup', 'A/B testing']
    };
    
    const sufijos = {
      alta: ['URGENTE', 'CRÍTICO', 'HOTFIX'],
      media: ['Sprint goal', 'Mejora', 'Feature'],
      baja: ['Refactor', 'Docs', 'Tech debt']
    };
    
    const base = bases[equipo as keyof typeof bases][Math.floor(Math.random() * 4)];
    const sufijo = sufijos[prioridad][Math.floor(Math.random() * 3)];
    
    return `${base} - ${sufijo}`;
  }, []);

  const generarEstimacion = useCallback((): string => {
    const estimaciones = ['1h', '2h', '4h', '1d', '2d', '3d', '1w'];
    return estimaciones[Math.floor(Math.random() * estimaciones.length)];
  }, []);

  // Generar tareas para un rango de fechas
  const generarTareasParaRango = useCallback((inicio: Date, fin: Date): EjemploTarea[] => {
    const tareas: EjemploTarea[] = [];
    const equipos = ['Frontend', 'Backend', 'DevOps', 'QA', 'Design', 'Product'];
    const prioridades: EjemploTarea['prioridad'][] = ['alta', 'media', 'baja'];
    const estados: EjemploTarea['estado'][] = ['pendiente', 'en_progreso', 'completada'];
    
    const fechaActual = new Date(inicio);
    
    while (fechaActual <= fin) {
      // Probabilidad de tener tareas en un día (70%)
      if (Math.random() > 0.3) {
        const numTareas = Math.floor(Math.random() * 4) + 1; // 1-4 tareas por día
        
        for (let i = 0; i < numTareas; i++) {
          const equipo = equipos[Math.floor(Math.random() * equipos.length)];
          const prioridad = prioridades[Math.floor(Math.random() * prioridades.length)];
          const estado = estados[Math.floor(Math.random() * estados.length)];
          
          tareas.push({
            id: `tarea-${fechaActual.getTime()}-${i}`,
            fecha: new Date(fechaActual),
            titulo: generarTituloTarea(equipo, prioridad),
            prioridad,
            estado,
            equipo,
            estimacion: generarEstimacion()
          });
        }
      }
      
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    
    return tareas;
  }, [generarTituloTarea, generarEstimacion]);

  // Verificar si un rango ya está cargado
  const rangoYaCargado = useCallback((inicio: Date, fin: Date): boolean => {
    return rangosCargados.some(rango => 
      rango.cargado && 
      inicio >= rango.inicio && 
      fin <= rango.fin
    );
  }, [rangosCargados]);

  // Simular carga inicial al montar el componente
  const cargarDatosIniciales = useCallback(async () => {
    setCargando(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));

      const hoy = new Date();
      const anioActual = hoy.getFullYear();
      let todasLasTareas: EjemploTarea[] = [];
      let rangosPorMes = [];

      for (let mes = 0; mes < 12; mes++) {
        const inicioMes = new Date(anioActual, mes, 1);
        const finMes = new Date(anioActual, mes + 1, 0);
        const tareasMes = generarTareasParaRango(inicioMes, finMes);

        todasLasTareas = todasLasTareas.concat(tareasMes);
        rangosPorMes.push({
          inicio: inicioMes,
          fin: finMes,
          cargado: true
        });
      }

      setTareas(todasLasTareas);
      setRangosCargados(rangosPorMes);

      setEstadisticas(prev => ({
        ...prev,
        totalCargadas: todasLasTareas.length,
        ultimaCarga: `Inicial: ${new Date(anioActual, 0, 1).toLocaleDateString('es-ES')} - ${new Date(anioActual, 11, 31).toLocaleDateString('es-ES')}`,
        peticionesCarga: prev.peticionesCarga + 1
      }));

    } finally {
      setCargando(false);
    }
  }, [generarTareasParaRango]);

  // Manejar carga de datos anteriores
  const manejarCargaAnterior = useCallback(async (fechaActual: Date) => {
    const inicioRango = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 2, 1);
    const finRango = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0);
    
    if (rangoYaCargado(inicioRango, finRango) || cargando) {
      console.log('📅 Rango ya cargado o carga en progreso, omitiendo...');
      return;
    }

    console.log('⬅️ Cargando datos anteriores:', inicioRango.toLocaleDateString('es-ES'), '-', finRango.toLocaleDateString('es-ES'));
    
    // ✅ CORRECCIÓN: Verificar que existe antes de hacer clearTimeout
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    
    // ✅ CORRECCIÓN: Usar window.setTimeout y almacenar el ID
    timeoutRef.current = window.setTimeout(async () => {
      setCargando(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const nuevasTareas = generarTareasParaRango(inicioRango, finRango);
        
        setTareas(prev => [...nuevasTareas, ...prev]);
        setRangosCargados(prev => [...prev, {
          inicio: inicioRango,
          fin: finRango,
          cargado: true
        }]);
        
        setEstadisticas(prev => ({
          ...prev,
          totalCargadas: prev.totalCargadas + nuevasTareas.length,
          ultimaCarga: `Anterior: ${inicioRango.toLocaleDateString('es-ES')} - ${finRango.toLocaleDateString('es-ES')}`,
          peticionesCarga: prev.peticionesCarga + 1
        }));
        
      } finally {
        setCargando(false);
      }
    }, 300);
  }, [rangoYaCargado, cargando, generarTareasParaRango]);

  // Manejar carga de datos posteriores
  const manejarCargaPosterior = useCallback(async (fechaActual: Date) => {
    const inicioRango = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1);
    const finRango = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 3, 0);
    
    if (rangoYaCargado(inicioRango, finRango) || cargando) {
      console.log('📅 Rango ya cargado o carga en progreso, omitiendo...');
      return;
    }

    console.log('➡️ Cargando datos posteriores:', inicioRango.toLocaleDateString('es-ES'), '-', finRango.toLocaleDateString('es-ES'));
    
    // ✅ CORRECCIÓN: Mismo patrón que arriba
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(async () => {
      setCargando(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const nuevasTareas = generarTareasParaRango(inicioRango, finRango);
        
        setTareas(prev => [...prev, ...nuevasTareas]);
        setRangosCargados(prev => [...prev, {
          inicio: inicioRango,
          fin: finRango,
          cargado: true
        }]);
        
        setEstadisticas(prev => ({
          ...prev,
          totalCargadas: prev.totalCargadas + nuevasTareas.length,
          ultimaCarga: `Posterior: ${inicioRango.toLocaleDateString('es-ES')} - ${finRango.toLocaleDateString('es-ES')}`,
          peticionesCarga: prev.peticionesCarga + 1
        }));
        
      } finally {
        setCargando(false);
      }
    }, 300);
  }, [rangoYaCargado, cargando, generarTareasParaRango]);

  // ✅ CORRECCIÓN: Cleanup del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // ✅ CORRECTO - Usar useEffect para inicialización
  useEffect(() => {
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  const colorPorPrioridad = {
    alta: '#e74c3c',
    media: '#f39c12', 
    baja: '#27ae60'
  };

  const iconoPorEstado = {
    pendiente: '⏳',
    en_progreso: '🔄',
    completada: '✅'
  };

  const colorPorEquipo = {
    Frontend: '#3498db',
    Backend: '#9b59b6',
    DevOps: '#e67e22',
    QA: '#1abc9c',
    Design: '#e91e63',
    Product: '#607d8b'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* ...resto del JSX sin cambios hasta el renderDato... */}
      
      <Calendario
        calendarioId="calendario-ejemplo-carga-infinita"
        datos={tareas}
        cargando={cargando}
        config={{
          cabecera: {
            mostrarCambioModo: true,
            mostrarControlesNavegacion: true,
            mostrarBotonHoy: true,
            // modos: ['mes', 'semana'],
          },
          teclado: {
            habilitado: true,
          },
          maxDatosVisibles: 3,
          onNecesitaDatosAnteriores: manejarCargaAnterior,
          onNecesitaDatosPosteriores: manejarCargaPosterior,
        }}
        renderDato={(tarea) => (
          <div style={{ 
            backgroundColor: colorPorPrioridad[tarea.prioridad],
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px',
            fontSize: '0.75rem',
            margin: '2px 0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '3px',
              height: '100%',
              backgroundColor: colorPorEquipo[tarea.equipo as keyof typeof colorPorEquipo]
            }} />
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '4px',
              paddingLeft: '6px'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {tarea.titulo}
                </div>
                <div style={{ 
                  fontSize: '0.65rem', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '2px'
                }}>
                  <span>{iconoPorEstado[tarea.estado]}</span>
                  <span>{tarea.equipo}</span>
                  {/* ✅ CORRECTO - Span cerrado correctamente */}
                  {tarea.estimacion && <span>⏱️{tarea.estimacion}</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      />

<div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>📖 Guía: Implementación de Carga Infinita</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', marginTop: '20px' }}>
          <div>
            <h5>⚡ Características Implementadas</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Carga bajo demanda:</strong> Los datos se cargan solo cuando son necesarios</li>
              <li><strong>Debounce de peticiones:</strong> Evita múltiples cargas simultáneas</li>
              <li><strong>Cache inteligente:</strong> Los rangos ya cargados no se vuelven a cargar</li>
              <li><strong>Estados de carga:</strong> Indicadores visuales del estado de las peticiones</li>
              <li><strong>Carga bidireccional:</strong> Datos anteriores y posteriores</li>
            </ul>
          </div>

          <div>
            <h5>🏗️ Implementación Técnica</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>onNecesitaDatosAnteriores:</strong> Callback para cargar datos del pasado</li>
              <li><strong>onNecesitaDatosPosteriores:</strong> Callback para cargar datos del futuro</li>
              <li><strong>Control de rangos:</strong> Seguimiento de qué datos están cargados</li>
              <li><strong>Gestión de estado:</strong> Loading states y error handling</li>
              <li><strong>Performance:</strong> Timeouts para evitar spam de requests</li>
            </ul>
          </div>

          <div>
            <h5>🎯 Casos de Uso Empresariales</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Calendarios grandes:</strong> Miles de eventos distribuidos en el tiempo</li>
              <li><strong>APIs lentas:</strong> Cuando la carga completa es impráctica</li>
              <li><strong>Memoria limitada:</strong> Dispositivos con recursos restringidos</li>
              <li><strong>UX progresiva:</strong> Mostrar contenido inmediatamente</li>
              <li><strong>Costos de API:</strong> Minimizar llamadas innecesarias</li>
            </ul>
          </div>

          <div>
            <h5>⚠️ Consideraciones Importantes</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Gestión de memoria:</strong> Limpiar datos antiguos si es necesario</li>
              <li><strong>Manejo de errores:</strong> Reintentos y fallbacks</li>
              <li><strong>Indicadores de carga:</strong> Feedback claro al usuario</li>
              <li><strong>Sincronización:</strong> Datos actualizados en tiempo real</li>
              <li><strong>Navegación rápida:</strong> Pre-carga inteligente</li>
            </ul>
          </div>
        </div>

        {/* Código de ejemplo */}
        <div style={{ marginTop: '25px' }}>
          <h5>💻 Código de Ejemplo</h5>
          <div style={{ 
            backgroundColor: '#f1f3f4', 
            padding: '15px', 
            borderRadius: '6px', 
            fontFamily: 'monospace', 
            fontSize: '0.85rem',
            overflowX: 'auto'
          }}>
            <div style={{ color: '#0066cc', marginBottom: '10px' }}>// Configuración del calendario con carga infinita</div>
            <div>{`<Calendario`}</div>
            <div>{`  datos={tareas}`}</div>
            <div>{`  cargando={cargando}`}</div>
            <div>{`  config={{`}</div>
            <div>{`    onNecesitaDatosAnteriores: manejarCargaAnterior,`}</div>
            <div>{`    onNecesitaDatosPosteriores: manejarCargaPosterior,`}</div>
            <div>{`    maxDatosVisibles: 3`}</div>
            <div>{`  }}`}</div>
            <div>{`/>`}</div>
          </div>
        </div>

        {/* Métricas en tiempo real */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '6px' }}>
          <h5>📈 Métricas en Tiempo Real</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                {estadisticas.totalCargadas}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Tareas Cargadas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                {rangosCargados.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Rangos en Cache</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c' }}>
                {estadisticas.peticionesCarga}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Peticiones API</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: cargando ? '#f39c12' : '#95a5a6' }}>
                {cargando ? '⏳' : '💤'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Estado</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d1ecf1', borderRadius: '4px', fontSize: '0.9rem' }}>
          <strong>💡 Tip de Performance:</strong> Navega rápidamente usando las flechas ←→ o las teclas H (hoy), 
          M (mes) para ver cómo se cargan los datos dinámicamente. Los rangos ya visitados se mantienen en cache 
          para navegación instantánea.
        </div>
      </div>
    </div>
  );
};