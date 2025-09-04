import React, { useEffect, useState } from 'react';
import { EjemploCalendarioMovil } from './ejemplos/EjemploCalendarioMovil';
import { EjemploCargaInfinita } from './ejemplos/EjemploCargaInfinita';
import { EjemploModosMúltiples } from './ejemplos/EjemploModosMúltiples';
import { EjemploNavegacionTeclado } from './ejemplos/EjemploNavegacionTeclado';
import { EjemploPersonalizacionVisual } from './ejemplos/EjemploPersonalizacionVisual';
import { EjemploSeleccionCalendario } from './ejemplos/EjemploSeleccionCalendario';

interface CalendarioPlaygroundProps {
  esMovil?: boolean;
  esTablet?: boolean; // ✅ Añadir esTablet como prop
  onCerrar?: () => void;
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
  esMovil = false,
  esTablet = false, // ✅ Recibir esTablet del padre
  onCerrar
}) => {
  const [ejemploActivo, setEjemploActivo] = useState<string>('seleccion');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [mostrarSidebar, setMostrarSidebar] = useState(false);
  
  // ✅ USAR las props del padre en lugar de detectar internamente
  const esMovilReal = esMovil;      // Ya detectado en calendario.tsx
  const esTabletReal = esTablet;    // Ya detectado en calendario.tsx  
  const esDesktop = !esTabletReal;  // Desktop = NO tablet

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
      
      {/* ✅ HEADER CON BOTÓN CERRAR INTEGRADO */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #dee2e6',
        padding: esMovilReal ? '12px 0' : esTabletReal ? '16px 0' : '20px 0',
        flexShrink: 0,
        zIndex: 100
      }}>
        <div style={{ 
          minWidth: '100%',
          maxWidth: '100%', 
          margin: '0 auto', 
          padding: '0 15px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-around'
          }}>
            
            {/* ✅ LADO IZQUIERDO - Título y descripción */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <div>
              <h1 style={{ 
                margin: 0, 
                color: '#2c3e50', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: esMovilReal ? '1.2rem' : esTabletReal ? '1.4rem' : '1.8rem'
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

            
            {/* ✅ LADO CENTRO - Stats solo en desktop */}
            {esDesktop && (
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', marginRight: '20px' }}>
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

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
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
            </div>
            <div>
              {/* ✅ BOTÓN CERRAR MODAL */}
              {onCerrar && (
              <button
                onClick={onCerrar}
                style={{
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  border: '1px solid #dee2e6',
                  borderRadius: '50%',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease'
                }}
              >
                ✕
              </button>
              )}
            </div>
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
            overflowY: 'auto',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <SidebarContent 
              ejemplosFiltrados={ejemplosFiltrados}
              ejemploActivo={ejemploActivo}
              setEjemploActivo={setEjemploActivo}
              esMovilReal={false}
              esTabletReal={false}
              esDesktop={esDesktop}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              filtroCategoria={filtroCategoria}
              setFiltroCategoria={setFiltroCategoria}
              onCerrar={undefined}
            />
          </aside>
        ) : (
          // MÓVIL/TABLET: Sidebar como overlay
          mostrarSidebar && (
            <>
              {/* ✅ SIDEBAR OVERLAY - posicionamiento corregido */}
              <aside style={{ 
                position: 'fixed',
                // ✅ CENTRADO como el modal padre
                top: '50%',
                left: '50%',
                transform: esMovilReal 
                  ? 'translate(-50%, -50%)' // Móvil: centrado perfecto
                  : 'translate(-50%, -50%)', // Tablet: también centrado perfecto
                // ✅ Dimensiones exactas del modal padre
                width: esMovilReal ? '100vw' : '95vw',
                height: esMovilReal ? '100vh' : '90vh', 
                maxWidth: esMovilReal ? 'none' : '1400px',
                backgroundColor: 'white',
                borderRadius: esMovilReal ? '0' : '12px',
                overflowY: 'auto',
                zIndex: 10001,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: esMovilReal ? 'none' : '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <SidebarContent 
                  ejemplosFiltrados={ejemplosFiltrados}
                  ejemploActivo={ejemploActivo}
                  setEjemploActivo={(id) => {
                    setEjemploActivo(id);
                    setMostrarSidebar(false);
                  }}
                  esMovilReal={esMovilReal}
                  esTabletReal={esTabletReal}
                  esDesktop={false}
                  busqueda={busqueda}
                  setBusqueda={setBusqueda}
                  filtroCategoria={filtroCategoria}
                  setFiltroCategoria={setFiltroCategoria}
                  onCerrar={() => setMostrarSidebar(false)}
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
          overflow: 'hidden'
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
                      fontSize: esMovilReal ? '1.1rem' : esTabletReal ? '1.3rem' : '1.5rem'
                    }}>
                      {ejemploSeleccionado!.titulo}
                    </h2>
                    {!esMovilReal && (
                      <p style={{ 
                        margin: 0, 
                        color: '#6c757d', 
                        fontSize: esTabletReal ? '0.95rem' : '1.05rem' 
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
    </div>
  );
};

// ✅ ACTUALIZAR SidebarContent para usar esTabletReal
const SidebarContent: React.FC<{
  ejemplosFiltrados: EjemploConfig[];
  ejemploActivo: string;
  setEjemploActivo: (id: string) => void;
  esMovilReal: boolean;
  esTabletReal: boolean; // ✅ Añadir esTabletReal
  esDesktop: boolean;
  busqueda: string;
  setBusqueda: (value: string) => void;
  filtroCategoria: string;
  setFiltroCategoria: (value: string) => void;
  onCerrar?: () => void;
}> = ({ 
  ejemplosFiltrados, 
  ejemploActivo, 
  setEjemploActivo, 
  esMovilReal, 
  esTabletReal, // ✅ Usar esTabletReal
  esDesktop,
  busqueda,
  setBusqueda,
  filtroCategoria,
  setFiltroCategoria,
  onCerrar 
}) => {
  return (
    <div style={{ 
      padding: esDesktop ? '20px' : esMovilReal ? '12px 15px' : '20px', // ✅ Tablet usa padding normal
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* ✅ Header del sidebar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#2c3e50',
          fontSize: esMovilReal ? '1.2rem' : '1.3rem'
        }}>
          📚 Ejemplos ({ejemplosFiltrados.length})
        </h3>
        
        {/* ✅ Botón X para móvil/tablet */}
        {onCerrar && (
          <button
            onClick={onCerrar}
            style={{
              padding: '8px',
              backgroundColor: '#f8f9fa',
              color: '#333',
              border: '1px solid #dee2e6',
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ✅ CONTROLES DE BÚSQUEDA */}
      <div style={{
        marginBottom: '20px', // ✅ Más espacio
        display: 'flex',
        flexDirection: 'column',
        gap: '12px' // ✅ Más gap entre elementos
      }}>
        {/* Buscador */}
        <input
          type="text"
          placeholder={esMovilReal ? "🔍 Buscar..." : "🔍 Buscar ejemplos, funcionalidades, tags..."}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: esMovilReal ? '12px 14px' : '12px 14px', // ✅ Padding uniforme y generoso
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            fontSize: esMovilReal ? '1rem' : '1rem', // ✅ Tamaño uniforme
            outline: 'none',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3a86ff'}
          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
        />

        {/* Filtro por categoría */}
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{
            width: '100%',
            padding: esMovilReal ? '12px 14px' : '12px 14px', // ✅ Padding uniforme
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            fontSize: esMovilReal ? '1rem' : '1rem', // ✅ Tamaño uniforme
            outline: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          <option value="todas">📂 Todas las categorías</option>
          {Object.entries(categorias).map(([key, cat]) => (
            <option key={key} value={key}>
              {cat.icono} {cat.titulo}
            </option>
          ))}
        </select>
      </div>
      
      {/* ✅ LISTA DE EJEMPLOS scrolleable */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        // ✅ Margen negativo para compensar el padding del contenedor
        marginLeft: esDesktop ? '0' : '-5px',
        marginRight: esDesktop ? '0' : '-5px',
        paddingLeft: esDesktop ? '0' : '5px',
        paddingRight: esDesktop ? '0' : '5px'
      }}>
        {ejemplosFiltrados.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#6c757d', 
            padding: '40px 20px',
            fontSize: esMovilReal ? '1rem' : '1rem' // ✅ Tamaño uniforme
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🔍</div>
            <p style={{ margin: 0 }}>No se encontraron ejemplos</p>
          </div>
        ) : (
          ejemplosFiltrados.map(ejemplo => (
            <div
              key={ejemplo.id}
              onClick={() => setEjemploActivo(ejemplo.id)}
              style={{
                padding: esMovilReal ? '16px' : '16px', // ✅ Padding uniforme y generoso
                marginBottom: '12px', // ✅ Más espacio entre items
                borderRadius: '12px', // ✅ Bordes más redondeados
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
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (ejemploActivo !== ejemplo.id) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
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
                  width: '26px', // ✅ Un poco más grande
                  height: '26px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  ⭐
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}> {/* ✅ Más gap */}
                <span style={{ fontSize: esMovilReal ? '1.6rem' : '1.6rem', flexShrink: 0 }}> {/* ✅ Tamaño uniforme */}
                  {ejemplo.icono}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ 
                    margin: '0 0 8px 0', // ✅ Más margen
                    color: '#2c3e50', 
                    fontSize: esMovilReal ? '1rem' : '1.05rem', // ✅ Texto un poco más grande
                    fontWeight: 'bold'
                  }}>
                    {ejemplo.titulo}
                  </h4>
                  <p style={{ 
                    margin: '0 0 12px 0', // ✅ Más margen
                    color: '#6c757d', 
                    fontSize: esMovilReal ? '0.85rem' : '0.9rem', // ✅ Texto un poco más grande
                    lineHeight: '1.5', // ✅ Mejor interlineado
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
                    gap: '10px' // ✅ Más gap
                  }}>
                    <span style={{ 
                      backgroundColor: categorias[ejemplo.categoria].color,
                      color: 'white',
                      padding: '4px 10px', // ✅ Más padding
                      borderRadius: '14px', // ✅ Más redondeado
                      fontSize: esMovilReal ? '0.75rem' : '0.8rem', // ✅ Texto un poco más grande
                      fontWeight: 'bold'
                    }}>
                      {categorias[ejemplo.categoria].icono} {categorias[ejemplo.categoria].titulo}
                    </span>
                    
                    <span style={{
                      color: dificultades[ejemplo.dificultad].color,
                      fontWeight: 'bold',
                      fontSize: esMovilReal ? '0.75rem' : '0.85rem' // ✅ Texto un poco más grande
                    }}>
                      {dificultades[ejemplo.dificultad].titulo}
                    </span>
                  </div>
                  
                  {!esMovilReal && (
                    <div style={{ marginTop: '12px' }}> {/* ✅ Más margen */}
                      {ejemplo.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            backgroundColor: '#e9ecef',
                            color: '#495057',
                            fontSize: '0.75rem', // ✅ Un poco más grande
                            padding: '3px 7px', // ✅ Más padding
                            borderRadius: '5px', // ✅ Más redondeado
                            marginRight: '6px', // ✅ Más margen
                            marginTop: '3px',
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
      </div>
    </div>
  );
};
