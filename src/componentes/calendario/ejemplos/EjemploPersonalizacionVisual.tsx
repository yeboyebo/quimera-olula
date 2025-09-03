import { useCallback, useState } from 'react';
import { Calendario } from '../calendario';

/**
 * Ejemplo de personalización visual del calendario
 * Demuestra temas, colores, tipografías y layouts personalizados
 */

interface EjemploEvento {
  id: string;
  fecha: Date;
  titulo: string;
  tipo: 'meeting' | 'task' | 'deadline' | 'holiday' | 'personal';
  prioridad: 'low' | 'medium' | 'high' | 'critical';
  departamento: 'engineering' | 'design' | 'marketing' | 'sales' | 'hr';
  duracion?: string;
  participantes?: number;
}

type TemaVisual = 'corporate' | 'creative' | 'minimal' | 'dark' | 'colorful';

export const EjemploPersonalizacionVisual = () => {
  const [temaActivo, setTemaActivo] = useState<TemaVisual>('corporate');
  const [mostrarLeyenda, setMostrarLeyenda] = useState(true);
  const [densidadDatos, setDensidadDatos] = useState<'baja' | 'media' | 'alta'>('media');
  const [efectosVisuales, setEfectosVisuales] = useState({
    sombras: true,
    animaciones: true,
    gradientes: false,
    bordesRedondeados: true
  });

  // Generar datos de ejemplo con variedad visual
  const generarEventos = useCallback((): EjemploEvento[] => {
    const eventos: EjemploEvento[] = [];
    const hoy = new Date();
    const tipos: EjemploEvento['tipo'][] = ['meeting', 'task', 'deadline', 'holiday', 'personal'];
    const prioridades: EjemploEvento['prioridad'][] = ['low', 'medium', 'high', 'critical'];
    const departamentos: EjemploEvento['departamento'][] = ['engineering', 'design', 'marketing', 'sales', 'hr'];
    
    const multiplicadorDensidad = densidadDatos === 'baja' ? 0.5 : densidadDatos === 'alta' ? 2 : 1;
    
    // Generar eventos para el mes actual y siguiente
    for (let i = -15; i <= 45; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      
      // Probabilidad de eventos según densidad
      const probabilidad = 0.4 * multiplicadorDensidad;
      if (Math.random() < probabilidad) {
        const numEventos = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < numEventos; j++) {
          const tipo = tipos[Math.floor(Math.random() * tipos.length)];
          const prioridad = prioridades[Math.floor(Math.random() * prioridades.length)];
          const departamento = departamentos[Math.floor(Math.random() * departamentos.length)];
          
          eventos.push({
            id: `evento-${i}-${j}`,
            fecha: new Date(fecha),
            titulo: generarTituloEvento(tipo, departamento),
            tipo,
            prioridad,
            departamento,
            duracion: generarDuracion(tipo),
            participantes: tipo === 'meeting' ? Math.floor(Math.random() * 8) + 2 : undefined
          });
        }
      }
    }
    
    return eventos;
  }, [densidadDatos]);

  const generarTituloEvento = (tipo: EjemploEvento['tipo'], departamento: EjemploEvento['departamento']): string => {
    const titulos = {
      meeting: {
        engineering: ['Code Review', 'Sprint Planning', 'Tech Talk', 'Architecture Review'],
        design: ['Design Review', 'User Research', 'Prototype Demo', 'Brand Guidelines'],
        marketing: ['Campaign Review', 'Content Strategy', 'SEO Planning', 'Social Media'],
        sales: ['Pipeline Review', 'Client Presentation', 'Deal Strategy', 'Team Standup'],
        hr: ['Team Building', 'Performance Review', 'Hiring Interview', 'Policy Update']
      },
      task: {
        engineering: ['Bug Fix', 'Feature Development', 'Code Refactor', 'Testing'],
        design: ['Mockup Creation', 'Asset Design', 'User Flow', 'Prototype'],
        marketing: ['Content Creation', 'Campaign Setup', 'Analytics Review', 'Lead Gen'],
        sales: ['Follow-up Call', 'Proposal Draft', 'CRM Update', 'Demo Prep'],
        hr: ['Document Review', 'Policy Update', 'Training Prep', 'Evaluation']
      },
      deadline: {
        engineering: ['Release Deadline', 'Code Freeze', 'Testing Complete', 'Deploy Ready'],
        design: ['Design Handoff', 'Asset Delivery', 'Review Due', 'Mockup Final'],
        marketing: ['Campaign Launch', 'Content Due', 'Report Submit', 'Budget Review'],
        sales: ['Proposal Due', 'Quote Submit', 'Contract Sign', 'Target Meet'],
        hr: ['Report Due', 'Review Complete', 'Training End', 'Policy Live']
      },
      holiday: {
        engineering: ['Team Offsite', 'Hackathon', 'Conference', 'Workshop'],
        design: ['Design Sprint', 'Creative Workshop', 'Portfolio Review', 'Inspiration Day'],
        marketing: ['Conference', 'Trade Show', 'Workshop', 'Networking Event'],
        sales: ['Sales Kickoff', 'Customer Event', 'Training', 'Team Retreat'],
        hr: ['Company Event', 'Team Building', 'Training Day', 'Wellness Day']
      },
      personal: {
        engineering: ['Learning Time', 'Side Project', 'Certification', 'Personal Dev'],
        design: ['Portfolio Work', 'Skill Building', 'Creative Time', 'Inspiration'],
        marketing: ['Course Study', 'Trend Research', 'Skill Dev', 'Networking'],
        sales: ['Training', 'Skill Practice', 'Goal Planning', 'Personal Dev'],
        hr: ['Professional Dev', 'Certification', 'Training', 'Skill Building']
      }
    };
    
    const opciones = titulos[tipo][departamento];
    return opciones[Math.floor(Math.random() * opciones.length)];
  };

  const generarDuracion = (tipo: EjemploEvento['tipo']): string => {
    const duraciones = {
      meeting: ['30min', '1h', '1.5h', '2h'],
      task: ['2h', '4h', '1d', '2d'],
      deadline: ['EOD', 'EOW', 'EOM'],
      holiday: ['1d', '2d', '1w'],
      personal: ['1h', '2h', '4h']
    };
    
    const opciones = duraciones[tipo];
    return opciones[Math.floor(Math.random() * opciones.length)];
  };

  const eventos = generarEventos();

  // Configuraciones de temas visuales
  const temasVisuales = {
    corporate: {
      nombre: '🏢 Corporativo',
      colores: {
        meeting: '#2c3e50',
        task: '#3498db', 
        deadline: '#e74c3c',
        holiday: '#95a5a6',
        personal: '#9b59b6'
      },
      prioridades: {
        low: '#27ae60',
        medium: '#f39c12',
        high: '#e67e22', 
        critical: '#c0392b'
      },
      departamentos: {
        engineering: '#34495e',
        design: '#8e44ad',
        marketing: '#16a085',
        sales: '#d35400',
        hr: '#7f8c8d'
      },
      fondo: '#ffffff',
      bordes: '#ecf0f1',
      texto: '#2c3e50'
    },
    creative: {
      nombre: '🎨 Creativo', 
      colores: {
        meeting: '#ff6b6b',
        task: '#4ecdc4',
        deadline: '#45b7d1', 
        holiday: '#f9ca24',
        personal: '#6c5ce7'
      },
      prioridades: {
        low: '#00b894',
        medium: '#fdcb6e',
        high: '#fd79a8',
        critical: '#d63031'
      },
      departamentos: {
        engineering: '#0984e3',
        design: '#a29bfe',
        marketing: '#fd79a8',
        sales: '#fdcb6e',
        hr: '#6c5ce7'
      },
      fondo: '#ffeaa7',
      bordes: '#fab1a0',
      texto: '#2d3436'
    },
    minimal: {
      nombre: '⚪ Minimalista',
      colores: {
        meeting: '#495057',
        task: '#6c757d',
        deadline: '#343a40',
        holiday: '#adb5bd',
        personal: '#868e96'
      },
      prioridades: {
        low: '#6c757d',
        medium: '#495057',
        high: '#343a40',
        critical: '#212529'
      },
      departamentos: {
        engineering: '#495057',
        design: '#6c757d',
        marketing: '#868e96',
        sales: '#adb5bd',
        hr: '#ced4da'
      },
      fondo: '#ffffff',
      bordes: '#dee2e6',
      texto: '#212529'
    },
    dark: {
      nombre: '🌙 Oscuro',
      colores: {
        meeting: '#7209b7',
        task: '#0077b6',
        deadline: '#d62828',
        holiday: '#f77f00',
        personal: '#fcbf49'
      },
      prioridades: {
        low: '#06ffa5',
        medium: '#ffb3ba',
        high: '#ffdfba', 
        critical: '#ff9aa2'
      },
      departamentos: {
        engineering: '#264653',
        design: '#2a9d8f',
        marketing: '#e9c46a',
        sales: '#f4a261',
        hr: '#e76f51'
      },
      fondo: '#1a1a1a',
      bordes: '#333333',
      texto: '#ffffff'
    },
    colorful: {
      nombre: '🌈 Colorido',
      colores: {
        meeting: '#ff0080',
        task: '#00ff80',
        deadline: '#8000ff',
        holiday: '#ff8000', 
        personal: '#0080ff'
      },
      prioridades: {
        low: '#00ff00',
        medium: '#ffff00',
        high: '#ff8000',
        critical: '#ff0000'
      },
      departamentos: {
        engineering: '#ff1744',
        design: '#e91e63',
        marketing: '#9c27b0',
        sales: '#673ab7',
        hr: '#3f51b5'
      },
      fondo: '#f3e5f5',
      bordes: '#ce93d8',
      texto: '#4a148c'
    }
  };

  const temaActual = temasVisuales[temaActivo];

  // Función para obtener el estilo de un evento
  const obtenerEstiloEvento = (evento: EjemploEvento) => {
    const colorBase = temaActual.colores[evento.tipo];
    const colorPrioridad = temaActual.prioridades[evento.prioridad];
    const colorDepartamento = temaActual.departamentos[evento.departamento];
    
    return {
      backgroundColor: colorBase,
      borderLeft: `4px solid ${colorPrioridad}`,
      borderBottom: `2px solid ${colorDepartamento}`,
      color: 'white',
      padding: '4px 8px',
      margin: '2px 0',
      borderRadius: efectosVisuales.bordesRedondeados ? '6px' : '2px',
      fontSize: '0.75rem',
      boxShadow: efectosVisuales.sombras ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
      background: efectosVisuales.gradientes 
        ? `linear-gradient(135deg, ${colorBase}, ${colorBase}dd)`
        : colorBase,
      transition: efectosVisuales.animaciones ? 'all 0.2s ease' : 'none',
      cursor: 'pointer',
      position: 'relative' as const,
      overflow: 'hidden' as const
    };
  };

  const iconosPorTipo = {
    meeting: '👥',
    task: '📋', 
    deadline: '⚡',
    holiday: '🎉',
    personal: '👤'
  };

  const iconosPorPrioridad = {
    low: '🟢',
    medium: '🟡', 
    high: '🟠',
    critical: '🔴'
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: temaActual.fondo,
      color: temaActual.texto,
      minHeight: '100vh',
      transition: efectosVisuales.animaciones ? 'all 0.3s ease' : 'none'
    }}>
      <h2 style={{ color: temaActual.texto }}>🎨 Ejemplo: Personalización Visual</h2>

      {/* Panel de controles de personalización */}
      <div style={{ 
        marginBottom: '25px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {/* Selector de temas */}
        <div style={{ 
          padding: '15px',
          backgroundColor: temaActual.fondo,
          border: `1px solid ${temaActual.bordes}`,
          borderRadius: '8px'
        }}>
          <h4>🎨 Tema Visual</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.entries(temasVisuales).map(([key, tema]) => (
              <button
                key={key}
                onClick={() => setTemaActivo(key as TemaVisual)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: key === temaActivo ? tema.colores.meeting : 'transparent',
                  color: key === temaActivo ? 'white' : temaActual.texto,
                  border: `1px solid ${temaActual.bordes}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: efectosVisuales.animaciones ? 'all 0.2s ease' : 'none'
                }}
              >
                {tema.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Densidad de datos */}
        <div style={{ 
          padding: '15px',
          backgroundColor: temaActual.fondo,
          border: `1px solid ${temaActual.bordes}`,
          borderRadius: '8px'
        }}>
          <h4>📊 Densidad de Datos</h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['baja', 'media', 'alta'].map((densidad) => (
              <button
                key={densidad}
                onClick={() => setDensidadDatos(densidad as any)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: densidad === densidadDatos ? temaActual.colores.task : 'transparent',
                  color: densidad === densidadDatos ? 'white' : temaActual.texto,
                  border: `1px solid ${temaActual.bordes}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  textTransform: 'capitalize'
                }}
              >
                {densidad}
              </button>
            ))}
          </div>
        </div>

        {/* Efectos visuales */}
        <div style={{ 
          padding: '15px',
          backgroundColor: temaActual.fondo,
          border: `1px solid ${temaActual.bordes}`,
          borderRadius: '8px'
        }}>
          <h4>✨ Efectos Visuales</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {Object.entries(efectosVisuales).map(([efecto, activo]) => (
              <label key={efecto} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setEfectosVisuales(prev => ({
                    ...prev,
                    [efecto]: e.target.checked
                  }))}
                  style={{ accentColor: temaActual.colores.meeting }}
                />
                <span style={{ textTransform: 'capitalize' }}>
                  {efecto.replace(/([A-Z])/g, ' $1')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Toggle de leyenda */}
        <div style={{ 
          padding: '15px',
          backgroundColor: temaActual.fondo,
          border: `1px solid ${temaActual.bordes}`,
          borderRadius: '8px'
        }}>
          <h4>🗂️ Opciones de Vista</h4>
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}>
            <input
              type="checkbox"
              checked={mostrarLeyenda}
              onChange={(e) => setMostrarLeyenda(e.target.checked)}
              style={{ accentColor: temaActual.colores.meeting }}
            />
            <span>Mostrar Leyenda Visual</span>
          </label>
        </div>
      </div>

      {/* Leyenda visual de colores */}
      {mostrarLeyenda && (
        <div style={{ 
          marginBottom: '25px',
          padding: '20px',
          backgroundColor: temaActual.fondo,
          border: `1px solid ${temaActual.bordes}`,
          borderRadius: '8px'
        }}>
          <h4>🎯 Leyenda Visual</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            {/* Tipos de eventos */}
            <div>
              <h5>📋 Tipos de Eventos</h5>
              <div style={{ display: 'grid', gap: '8px' }}>
                {Object.entries(temaActual.colores).map(([tipo, color]) => (
                  <div key={tipo} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      backgroundColor: color, 
                      borderRadius: efectosVisuales.bordesRedondeados ? '4px' : '2px',
                      boxShadow: efectosVisuales.sombras ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
                    }} />
                    <span style={{ fontSize: '0.85rem' }}>
                      {iconosPorTipo[tipo as keyof typeof iconosPorTipo]} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioridades */}
            <div>
              <h5>🚨 Prioridades</h5>
              <div style={{ display: 'grid', gap: '8px' }}>
                {Object.entries(temaActual.prioridades).map(([prioridad, color]) => (
                  <div key={prioridad} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '4px', 
                      height: '20px', 
                      backgroundColor: color, 
                      borderRadius: efectosVisuales.bordesRedondeados ? '2px' : '0px'
                    }} />
                    <span style={{ fontSize: '0.85rem' }}>
                      {iconosPorPrioridad[prioridad as keyof typeof iconosPorPrioridad]} {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Departamentos */}
            <div>
              <h5>🏢 Departamentos</h5>
              <div style={{ display: 'grid', gap: '8px' }}>
                {Object.entries(temaActual.departamentos).map(([depto, color]) => (
                  <div key={depto} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '4px', 
                      backgroundColor: color, 
                      borderRadius: efectosVisuales.bordesRedondeados ? '2px' : '0px'
                    }} />
                    <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>
                      {depto}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendario con personalización visual */}
      <Calendario
        calendarioId="calendario-ejemplo-personalizacion-visual"
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
          },
          maxDatosVisibles: densidadDatos === 'baja' ? 2 : densidadDatos === 'alta' ? 5 : 3,
        }}
        renderDato={(evento) => {
          const estilo = obtenerEstiloEvento(evento);
          
          return (
            <div 
              style={estilo}
              onMouseEnter={efectosVisuales.animaciones ? (e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.zIndex = '10';
              } : undefined}
              onMouseLeave={efectosVisuales.animaciones ? (e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.zIndex = 'auto';
              } : undefined}
            >
              {/* Indicador de tipo con icono */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2px'
              }}>
                <span style={{ fontSize: '0.9rem' }}>
                  {iconosPorTipo[evento.tipo]}
                </span>
                <span style={{ fontSize: '0.7rem' }}>
                  {iconosPorPrioridad[evento.prioridad]}
                </span>
              </div>

              {/* Título del evento */}
              <div style={{ 
                fontWeight: '500',
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: '2px'
              }}>
                {evento.titulo}
              </div>

              {/* Información adicional */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.6rem',
                opacity: 0.9
              }}>
                <span>{evento.duracion}</span>
                {evento.participantes && (
                  <span>👥 {evento.participantes}</span>
                )}
              </div>

              {/* Efecto de gradiente si está activado */}
              {efectosVisuales.gradientes && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '30%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))',
                  pointerEvents: 'none'
                }} />
              )}
            </div>
          );
        }}
      />

      {/* Guía de implementación */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: temaActual.fondo,
        border: `1px solid ${temaActual.bordes}`,
        borderRadius: '8px'
      }}>
        <h4>📚 Guía de Personalización Visual</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', marginTop: '20px' }}>
          
          <div>
            <h5>🎨 Sistema de Temas</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Corporativo:</strong> Colores profesionales y elegantes</li>
              <li><strong>Creativo:</strong> Paleta vibrante y moderna</li>
              <li><strong>Minimalista:</strong> Escala de grises y simplicidad</li>
              <li><strong>Oscuro:</strong> Tema dark con acentos brillantes</li>
              <li><strong>Colorido:</strong> Colores saturados y energéticos</li>
            </ul>
          </div>

          <div>
            <h5>🔧 Efectos Visuales</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Sombras:</strong> Profundidad visual con box-shadow</li>
              <li><strong>Animaciones:</strong> Transiciones suaves y hover effects</li>
              <li><strong>Gradientes:</strong> Fondos degradados para modernidad</li>
              <li><strong>Bordes:</strong> Radio de borde personalizable</li>
            </ul>
          </div>

          <div>
            <h5>📊 Sistema de Codificación</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Color principal:</strong> Tipo de evento</li>
              <li><strong>Borde izquierdo:</strong> Nivel de prioridad</li>
              <li><strong>Borde inferior:</strong> Departamento responsable</li>
              <li><strong>Iconos:</strong> Identificación rápida visual</li>
            </ul>
          </div>

          <div>
            <h5>⚡ Performance y UX</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Densidad adaptable:</strong> Control de cantidad de datos</li>
              <li><strong>Efectos opcionales:</strong> Rendimiento optimizable</li>
              <li><strong>Leyenda toggleable:</strong> Información contextual</li>
              <li><strong>Hover feedback:</strong> Interacciones responsivas</li>
            </ul>
          </div>
        </div>

        {/* Código de ejemplo */}
        <div style={{ marginTop: '25px' }}>
          <h5>💻 Implementación de Temas</h5>
          <div style={{ 
            backgroundColor: temaActivo === 'dark' ? '#333' : '#f8f9fa', 
            padding: '15px', 
            borderRadius: '6px', 
            fontFamily: 'monospace', 
            fontSize: '0.8rem',
            overflowX: 'auto',
            color: temaActivo === 'dark' ? '#fff' : '#333'
          }}>
            <div style={{ color: '#0066cc', marginBottom: '10px' }}>// Personalización de colores por evento</div>
            <div>{`const obtenerEstiloEvento = (evento) => ({`}</div>
            <div>{`  backgroundColor: tema.colores[evento.tipo],`}</div>
            <div>{`  borderLeft: \`4px solid \${tema.prioridades[evento.prioridad]}\`,`}</div>
            <div>{`  borderBottom: \`2px solid \${tema.departamentos[evento.departamento]}\`,`}</div>
            <div>{`  borderRadius: efectos.bordesRedondeados ? '6px' : '2px',`}</div>
            <div>{`  boxShadow: efectos.sombras ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',`}</div>
            <div>{`  transition: efectos.animaciones ? 'all 0.2s ease' : 'none'`}</div>
            <div>{`});`}</div>
          </div>
        </div>

        {/* Estadísticas del tema actual */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: temaActivo === 'dark' ? '#333' : '#f1f3f4', borderRadius: '6px' }}>
          <h5>📈 Estadísticas del Tema Actual: {temaActual.nombre}</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px', marginTop: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: temaActual.colores.meeting }}>
                {eventos.length}
              </div>
              <div style={{ fontSize: '0.7rem', color: temaActual.texto, opacity: 0.8 }}>Total Eventos</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: temaActual.colores.task }}>
                {Object.keys(temaActual.colores).length}
              </div>
              <div style={{ fontSize: '0.7rem', color: temaActual.texto, opacity: 0.8 }}>Tipos</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: temaActual.colores.deadline }}>
                {Object.keys(temaActual.prioridades).length}
              </div>
              <div style={{ fontSize: '0.7rem', color: temaActual.texto, opacity: 0.8 }}>Prioridades</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: temaActual.colores.holiday }}>
                {Object.keys(efectosVisuales).filter(efecto => efectosVisuales[efecto as keyof typeof efectosVisuales]).length}
              </div>
              <div style={{ fontSize: '0.7rem', color: temaActual.texto, opacity: 0.8 }}>Efectos Activos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};