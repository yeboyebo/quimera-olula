import React, { useState } from 'react';
import { EjemploCargaInfinita } from './ejemplos/EjemploCargaInfinita';
import { EjemploModosMúltiples } from './ejemplos/EjemploModosMúltiples';
import { EjemploNavegacionTeclado } from './ejemplos/EjemploNavegacionTeclado';
import { EjemploSeleccionCalendario } from './ejemplos/EjemploSeleccionCalendario';

/**
 * Playground interactivo para demostrar todas las funcionalidades del calendario
 * Permite navegar entre diferentes ejemplos y casos de uso
 */

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
    icono: '📅',
    componente: EjemploModosMúltiples,
    categoria: 'interaccion',
    dificultad: 'basico',
    tags: ['accesibilidad', 'atajos', 'productividad', 'navegacion']
  },
  {
    id: 'carga-infinita',
    titulo: 'Carga Infinita',
    descripcion: 'Carga dinámica de datos en el calendario',
    icono: '📅',
    componente: EjemploCargaInfinita,
    categoria: 'interaccion',
    dificultad: 'intermedio',
    tags: ['carga', 'datos', 'dinamico']
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

export const CalendarioPlayground: React.FC = () => {
  const [ejemploActivo, setEjemploActivo] = useState<string>('seleccion');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState<string>('');

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

  return (
    <div style={{ 
      overflow: 'hidden',
      maxHeight: '90vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #dee2e6',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div>
              <h1 style={{ margin: 0, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🗓️ <span>Calendario Playground</span>
              </h1>
              <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '1.1rem' }}>
                Explora todas las funcionalidades del componente calendario
              </p>
            </div>
            
            {/* Stats rápidas */}
            <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#3a86ff' }}>{ejemplos.length}</div>
                <div style={{ color: '#6c757d' }}>Ejemplos</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#28a745' }}>
                  {Object.keys(categorias).length}
                </div>
                <div style={{ color: '#6c757d' }}>Categorías</div>
              </div>
            </div>
          </div>

          {/* Controles */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Búsqueda */}
            <div style={{ position: 'relative', minWidth: '300px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar ejemplos, funcionalidades, tags..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Filtro por categoría */}
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={{
                padding: '10px 15px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '0.95rem',
                minWidth: '150px'
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
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', display: 'flex', gap: '20px' }}>
        
        {/* Sidebar con lista de ejemplos */}
        <aside style={{ 
          width: '350px', 
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          height: '70vh',
          maxHeight: '700px',
          overflowY: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>
            📚 Ejemplos ({ejemplosFiltrados.length})
          </h3>
          
          {ejemplosFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
              🔍 No se encontraron ejemplos
            </div>
          ) : (
            ejemplosFiltrados.map(ejemplo => (
              <div
                key={ejemplo.id}
                onClick={() => setEjemploActivo(ejemplo.id)}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: `2px solid ${ejemploActivo === ejemplo.id ? categorias[ejemplo.categoria].color : 'transparent'}`,
                  backgroundColor: ejemploActivo === ejemplo.id ? `${categorias[ejemplo.categoria].color}10` : '#f8f9fa',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {ejemplo.destacado && (
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#ffc107',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    ⭐
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{ejemplo.icono}</span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '1rem' }}>
                      {ejemplo.titulo}
                    </h4>
                    <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {ejemplo.descripcion}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                      <span style={{ 
                        backgroundColor: categorias[ejemplo.categoria].color,
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {categorias[ejemplo.categoria].icono} {categorias[ejemplo.categoria].titulo}
                      </span>
                      
                      <span style={{
                        color: dificultades[ejemplo.dificultad].color,
                        fontWeight: 'bold'
                      }}>
                        {dificultades[ejemplo.dificultad].titulo}
                      </span>
                    </div>
                    
                    <div style={{ marginTop: '8px' }}>
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
                  </div>
                </div>
              </div>
            ))
          )}
        </aside>

        {/* Contenido principal */}
        <main style={{ flex: 1, height: '70vh', maxHeight: '700px', overflowY: 'auto' }}>
          {EjemploComponente ? (
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {/* Header del ejemplo */}
              <div style={{ 
                padding: '20px', 
                borderBottom: '1px solid #dee2e6',
                backgroundColor: `${categorias[ejemploSeleccionado!.categoria].color}10`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '2rem' }}>{ejemploSeleccionado!.icono}</span>
                  <div>
                    <h2 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                      {ejemploSeleccionado!.titulo}
                    </h2>
                    <p style={{ margin: 0, color: '#6c757d', fontSize: '1.05rem' }}>
                      {ejemploSeleccionado!.descripcion}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contenido del ejemplo */}
              <div style={{ padding: '0' }}>
                <EjemploComponente />
              </div>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              <h3>Selecciona un ejemplo para comenzar</h3>
              <p>Explora las diferentes funcionalidades del calendario en la barra lateral.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
