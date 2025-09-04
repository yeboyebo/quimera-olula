import React, { useState, useEffect } from 'react';
import { EjemploCalendarioMovil } from './ejemplos/EjemploCalendarioMovil';
import { EjemploCargaInfinita } from './ejemplos/EjemploCargaInfinita';
import { EjemploModosMúltiples } from './ejemplos/EjemploModosMúltiples';
import { EjemploNavegacionTeclado } from './ejemplos/EjemploNavegacionTeclado';
import { EjemploPersonalizacionVisual } from './ejemplos/EjemploPersonalizacionVisual';
import { EjemploSeleccionCalendario } from './ejemplos/EjemploSeleccionCalendario';

interface CalendarioPlaygroundProps {
  esMovil?: boolean;
}

interface EjemploConfig {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  componente: React.ComponentType;
  destacado?: boolean;
  categoria: 'interaccion' | 'personalizacion' | 'empresarial' | 'tecnico';
  dificultad: 'basico' | 'intermedio' | 'avanzado';
  tags: string[];
}

const ejemplos: EjemploConfig[] = [
  {
    id: 'seleccion',
    titulo: 'Selección de Fechas',
    descripcion: 'Selección simple, múltiple y por rangos con validaciones empresariales',
    icono: '📅',
    componente: EjemploSeleccionCalendario,
    destacado: true,
    categoria: 'interaccion',
    dificultad: 'basico',
    tags: ['fechas', 'validacion', 'rangos', 'vacaciones']
  },
  {
    id: 'teclado',
    titulo: 'Navegación por Teclado',
    descripcion: 'Control completo por teclado con atajos personalizados y accesibilidad',
    icono: '⌨️',
    componente: EjemploNavegacionTeclado,
    categoria: 'interaccion',
    dificultad: 'intermedio',
    tags: ['accesibilidad', 'atajos', 'productividad', 'navegacion']
  },
  {
    id: 'modos',
    titulo: 'Modos Múltiples',
    descripcion: 'Visualización del calendario en diferentes modos (día, semana, mes)',
    icono: '📊',
    componente: EjemploModosMúltiples,
    categoria: 'interaccion',
    dificultad: 'basico',
    tags: ['vistas', 'modos', 'navegacion']
  },
  {
    id: 'carga-infinita',
    titulo: 'Carga Infinita',
    descripcion: 'Carga dinámica de datos en el calendario',
    icono: '🔄',
    componente: EjemploCargaInfinita,
    categoria: 'tecnico',
    dificultad: 'intermedio',
    tags: ['carga', 'datos', 'dinamico']
  },
  {
    id: 'personalizacion',
    titulo: 'Personalización Visual',
    descripcion: 'Personalización visual del calendario con temas y colores personalizados',
    icono: '🎨',
    componente: EjemploPersonalizacionVisual,
    destacado: true,
    categoria: 'personalizacion',
    dificultad: 'basico',
    tags: ['temas', 'colores', 'personalizacion']
  },
  {
    id: 'movil',
    titulo: 'Calendario Móvil',
    descripcion: 'Optimización del calendario para dispositivos móviles',
    icono: '📱',
    componente: EjemploCalendarioMovil,
    destacado: true,
    categoria: 'empresarial',
    dificultad: 'avanzado',
    tags: ['movil', 'gestos', 'ux']
  }
];

const categorias = {
  interaccion: { titulo: 'Interacción', color: '#3a86ff', icono: '🎯' },
  personalizacion: { titulo: 'Personalización', color: '#ff6b6b', icono: '🎨' },
  empresarial: { titulo: 'Empresarial', color: '#4ecdc4', icono: '🏢' },
  tecnico: { titulo: 'Técnico', color: '#45b7d1', icono: '⚙️' }
};

const dificultades = {
  basico: { titulo: 'Básico', color: '#28a745' },
  intermedio: { titulo: 'Intermedio', color: '#ffc107' },
  avanzado: { titulo: 'Avanzado', color: '#dc3545' }
};

export const CalendarioPlayground: React.FC<CalendarioPlaygroundProps> = ({ 
  esMovil = false 
}) => {
  const [ejemploActivo, setEjemploActivo] = useState<string>('seleccion');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [mostrarSidebar, setMostrarSidebar] = useState(false); // ✅ Cerrado por defecto en móvil/tablet
  
  // ✅ Detección responsive basada en CSS media queries
  const [dimensiones, setDimensiones] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const detectarDimensiones = () => {
      setDimensiones({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    detectarDimensiones();
    window.addEventListener('resize', detectarDimensiones);
    
    return () => window.removeEventListener('resize', detectarDimensiones);
  }, []);

  // ✅ Media queries según CSS
  const esMovilReal = dimensiones.width < 640;      // CSS: @media (max-width: 640px)
  const esTablet = dimensiones.width < 1120;       // CSS: @media (max-width: 1120px)
  const esDesktop = dimensiones.width >= 1120;     // Sin media query

  const ejemplosFiltrados = ejemplos.filter(ejemplo => {
    const coincideBusqueda = busqueda === '' || 
      ejemplo.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      ejemplo.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      ejemplo.tags.some(tag => tag.toLowerCase().includes(busqueda.toLowerCase()));
    
    const coincifeCategoria = filtroCategoria === 'todas' || ejemplo.categoria === filtroCategoria;
    
    return coincideBusqueda && coincifeCategoria;
  });

  const ejemploSeleccionado = ejemplos.find(e => e.id === ejemploActivo);
  const EjemploComponente = ejemploSeleccionado?.componente;

  // ✅ Cerrar sidebar al redimensionar a desktop
  useEffect(() => {
    if (esDesktop) {
      setMostrarSidebar(false);
    }
  }, [esDesktop]);

  return (
    <div style={{ 
      overflow: 'hidden',
      maxHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* ✅ HEADER FIJO responsive */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #dee2e6',
        padding: esMovilReal ? '10px 0' : esTablet ? '15px 0' : '20px 0',
        flexShrink: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          padding: '0 15px'
        }}>
          {/* Título y botón hamburguesa */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: esMovilReal ? '8px' : '12px'
          }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                color: '#2c3e50', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: esMovilReal ? '1.2rem' : esTablet ? '1.4rem' : '1.8rem'
              }}>
                🗓️ <span>Playground</span>
              </h1>
              {/* Descripción solo en desktop */}
              {esDesktop && (
                <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '1rem' }}>
                  Explora todas las funcionalidades del componente calendario
                </p>
              )}
            </div>
            
            {/* Stats solo en desktop */}
            {esDesktop && (
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#3a86ff' }}>
                    {ejemplos.length}
                  </div>
                  <div style={{ color: '#6c757d' }}>Ejemplos</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#28a745' }}>
                    {Object.keys(categorias).length}
                  </div>
                  <div style={{ color: '#6c757d' }}>Categorías</div>
                </div>
              </div>
            )}

            {/* Botón hamburguesa para móvil/tablet */}
            {!esDesktop && (
              <button
                onClick={() => setMostrarSidebar(!mostrarSidebar)}
                style={{
                  padding: esMovilReal ? '8px 12px' : '10px 16px',
                  backgroundColor: mostrarSidebar ? '#dc3545' : '#3a86ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: esMovilReal ? '0.9rem' : '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  fontWeight: 'bold'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>
                  {mostrarSidebar ? '✕' : '☰'}
                </span>
                {mostrarSidebar ? 'Cerrar' : 'Ejemplos'}
              </button>
            )}
          </div>

          {/* Controles de búsqueda y filtro */}
          <div style={{ 
            display: 'flex', 
            gap: esMovilReal ? '8px' : '12px', 
            alignItems: 'center', 
            flexWrap: esMovilReal ? 'wrap' : 'nowrap'
          }}>
            {/* Buscador */}
            <div style={{ 
              flex: esMovilReal ? '1 1 100%' : '1 1 auto',
              minWidth: esMovilReal ? '200px' : '250px'
            }}>
              <input
                type="text"
                placeholder={esMovilReal ? "🔍 Buscar..." : "🔍 Buscar ejemplos, funcionalidades, tags..."}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: '100%',
                  padding: esMovilReal ? '8px 12px' : '10px 14px',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: esMovilReal ? '0.9rem' : '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3a86ff'}
                onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
              />
            </div>

            {/* Filtro por categoría */}
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={{
                padding: esMovilReal ? '8px 12px' : '10px 14px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: esMovilReal ? '0.9rem' : '1rem',
                minWidth: esMovilReal ? '100px' : '140px',
                flex: esMovilReal ? '1' : 'none',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="todas">📂 Todas</option>
              {Object.entries(categorias).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icono} {cat.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* ✅ CONTENIDO PRINCIPAL */}
      <div style={{ 
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* ✅ SIDEBAR - comportamiento por dispositivo */}
        {esDesktop ? (
          // DESKTOP: Sidebar siempre visible
          <aside style={{ 
            width: '350px',
            backgroundColor: 'white',
            borderRight: '1px solid #dee2e6',
            padding: '20px',
            overflowY: 'auto',
            flexShrink: 0
          }}>
            <SidebarContent 
              ejemplosFiltrados={ejemplosFiltrados}
              ejemploActivo={ejemploActivo}
              setEjemploActivo={setEjemploActivo}
              esMovilReal={false}
            />
          </aside>
        ) : (
          // MÓVIL/TABLET: Sidebar como overlay
          mostrarSidebar && (
            <>
              {/* Backdrop */}
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 500,
                  backdropFilter: 'blur(2px)'
                }}
                onClick={() => setMostrarSidebar(false)}
              />
              
              {/* Sidebar overlay */}
              <aside style={{ 
                position: 'fixed',
                top: esMovilReal ? '120px' : '140px', // Debajo del header
                left: '15px',
                width: esMovilReal ? 'calc(100vw - 30px)' : '320px',
                height: esMovilReal ? 'calc(100vh - 140px)' : 'calc(100vh - 160px)',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                animation: 'slideIn 0.3s ease-out'
              }}>
                <SidebarContent 
                  ejemplosFiltrados={ejemplosFiltrados}
                  ejemploActivo={ejemploActivo}
                  setEjemploActivo={(id) => {
                    setEjemploActivo(id);
                    setMostrarSidebar(false); // Auto-cerrar en móvil/tablet
                  }}
                  esMovilReal={esMovilReal}
                />
              </aside>
            </>
          )
        )}

        {/* ✅ ÁREA PRINCIPAL */}
        <main style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          // Blur cuando sidebar está abierto en móvil/tablet
          ...((!esDesktop && mostrarSidebar) && {
            filter: 'blur(1px)',
            pointerEvents: 'none'
          })
        }}>
          {EjemploComponente ? (
            <div style={{ 
              backgroundColor: 'white',
              margin: esDesktop ? '20px' : '15px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              flex: 1
            }}>
              {/* Header del ejemplo */}
              <div style={{ 
                padding: esMovilReal ? '15px' : '20px',
                borderBottom: '1px solid #dee2e6',
                backgroundColor: `${categorias[ejemploSeleccionado!.categoria].color}15`,
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: esMovilReal ? '1.8rem' : '2.2rem' }}>
                    {ejemploSeleccionado!.icono}
                  </span>
                  <div>
                    <h2 style={{ 
                      margin: '0 0 4px 0', 
                      color: '#2c3e50',
                      fontSize: esMovilReal ? '1.1rem' : esTablet ? '1.3rem' : '1.5rem'
                    }}>
                      {ejemploSeleccionado!.titulo}
                    </h2>
                    {!esMovilReal && (
                      <p style={{ 
                        margin: 0, 
                        color: '#6c757d', 
                        fontSize: esTablet ? '0.95rem' : '1.05rem' 
                      }}>
                        {ejemploSeleccionado!.descripcion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Contenido del ejemplo */}
              <div style={{ 
                flex: 1,
                overflow: 'auto'
              }}>
                <EjemploComponente />
              </div>
            </div>
          ) : (
            // Estado inicial
            <div style={{ 
              backgroundColor: 'white',
              margin: esDesktop ? '20px' : '15px',
              borderRadius: '12px',
              padding: esMovilReal ? '30px 20px' : '40px',
              textAlign: 'center',
              color: '#6c757d',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🗓️</div>
              <h3 style={{ 
                fontSize: esMovilReal ? '1.2rem' : '1.5rem',
                margin: '0 0 15px 0'
              }}>
                {esMovilReal ? 'Selecciona un ejemplo' : 'Selecciona un ejemplo para comenzar'}
              </h3>
              <p style={{ fontSize: esMovilReal ? '0.9rem' : '1rem' }}>
                {esMovilReal 
                  ? 'Toca "Ejemplos" para explorar las funcionalidades.' 
                  : 'Explora las diferentes funcionalidades del calendario.'
                }
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ✅ ESTILOS CSS-in-JS para animaciones */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

// ✅ COMPONENTE SIDEBAR separado para reutilizar
const SidebarContent: React.FC<{
  ejemplosFiltrados: EjemploConfig[];
  ejemploActivo: string;
  setEjemploActivo: (id: string) => void;
  esMovilReal: boolean;
}> = ({ ejemplosFiltrados, ejemploActivo, setEjemploActivo, esMovilReal }) => {
  return (
    <>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: '#2c3e50',
        fontSize: esMovilReal ? '1.1rem' : '1.3rem'
      }}>
        📚 Ejemplos ({ejemplosFiltrados.length})
      </h3>
      
      {ejemplosFiltrados.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#6c757d', 
          padding: '40px 20px',
          fontSize: esMovilReal ? '0.9rem' : '1rem'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
          No se encontraron ejemplos
        </div>
      ) : (
        ejemplosFiltrados.map(ejemplo => (
          <div
            key={ejemplo.id}
            onClick={() => setEjemploActivo(ejemplo.id)}
            style={{
              padding: esMovilReal ? '12px' : '16px',
              marginBottom: '10px',
              borderRadius: '10px',
              cursor: 'pointer',
              border: `2px solid ${ejemploActivo === ejemplo.id ? categorias[ejemplo.categoria].color : 'transparent'}`,
              backgroundColor: ejemploActivo === ejemplo.id 
                ? `${categorias[ejemplo.categoria].color}15` 
                : '#f8f9fa',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (ejemploActivo !== ejemplo.id) {
                e.currentTarget.style.backgroundColor = `${categorias[ejemplo.categoria].color}08`;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (ejemploActivo !== ejemplo.id) {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {ejemplo.destacado && !esMovilReal && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ffc107',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                ⭐
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: esMovilReal ? '1.3rem' : '1.6rem', flexShrink: 0 }}>
                {ejemplo.icono}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ 
                  margin: '0 0 6px 0', 
                  color: '#2c3e50', 
                  fontSize: esMovilReal ? '0.95rem' : '1.05rem',
                  fontWeight: 'bold'
                }}>
                  {ejemplo.titulo}
                </h4>
                <p style={{ 
                  margin: '0 0 10px 0', 
                  color: '#6c757d', 
                  fontSize: esMovilReal ? '0.8rem' : '0.9rem', 
                  lineHeight: '1.4',
                  ...(esMovilReal && {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  })
                }}>
                  {ejemplo.descripcion}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span style={{ 
                    backgroundColor: categorias[ejemplo.categoria].color,
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: esMovilReal ? '0.7rem' : '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {categorias[ejemplo.categoria].icono} {categorias[ejemplo.categoria].titulo}
                  </span>
                  
                  <span style={{
                    color: dificultades[ejemplo.dificultad].color,
                    fontWeight: 'bold',
                    fontSize: esMovilReal ? '0.7rem' : '0.8rem'
                  }}>
                    {dificultades[ejemplo.dificultad].titulo}
                  </span>
                </div>
                
                {!esMovilReal && (
                  <div style={{ marginTop: '10px' }}>
                    {ejemplo.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: '#e9ecef',
                          color: '#495057',
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          marginRight: '4px',
                          marginTop: '2px',
                          display: 'inline-block'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};
