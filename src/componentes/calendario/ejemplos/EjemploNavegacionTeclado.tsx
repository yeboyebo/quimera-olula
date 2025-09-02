import { useState } from 'react';
import { Calendario } from '../calendario';
import { ModoCalendario } from '../tipos';

/**
 * Ejemplo de uso del calendario con navegación por teclado
 * Demuestra atajos personalizados y callbacks de acciones
 */

interface EjemploTarea {
  id: string;
  fecha: Date;
  titulo: string;
  tipo: 'reunion' | 'tarea' | 'evento';
}

export const EjemploNavegacionTeclado = () => {
  const [ultimaAccion, setUltimaAccion] = useState<string>('');
  const [atajosPersonalizados, setAtajosPersonalizados] = useState({
    hoy: 'h',
    modoMes: 'm',
    modoSemana: 's',
    modoAño: 'a',
    // Atajos personalizados para acciones empresariales
    reportes: 'r',
    buscar: 'b',
    configurar: 'c',
  });

  // Datos de ejemplo con diferentes tipos
  const tareas: EjemploTarea[] = [
    { id: '1', fecha: new Date(2025, 8, 5), titulo: 'Reunión equipo', tipo: 'reunion' },
    { id: '2', fecha: new Date(2025, 8, 10), titulo: 'Entrega proyecto', tipo: 'tarea' },
    { id: '3', fecha: new Date(2025, 8, 15), titulo: 'Conferencia', tipo: 'evento' },
    { id: '4', fecha: new Date(2025, 8, 20), titulo: 'Revisión mensual', tipo: 'reunion' },
    { id: '5', fecha: new Date(2025, 8, 25), titulo: 'Workshop', tipo: 'evento' },
  ];

  const manejarAccionTeclado = (accion: string, contexto: { fechaActual: Date; modoVista: ModoCalendario }) => {
    const mensaje = `🎯 Acción: "${accion}" | Fecha: ${contexto.fechaActual.toLocaleDateString('es-ES')} | Modo: ${contexto.modoVista}`;
    setUltimaAccion(mensaje);
    
    // Lógica empresarial personalizada basada en atajos
    switch (accion) {
      case 'reportes':
        console.log('📊 Generando reportes para:', contexto.fechaActual.toLocaleDateString('es-ES'));
        break;
      case 'buscar':
        console.log('🔍 Iniciando búsqueda desde:', contexto.fechaActual.toLocaleDateString('es-ES'));
        break;
      case 'configurar':
        console.log('⚙️ Abriendo configuración del calendario');
        break;
      default:
        console.log('⌨️ Acción de teclado:', accion);
    }
  };

  const colorPorTipo = {
    reunion: '#ff6b6b',
    tarea: '#4ecdc4', 
    evento: '#45b7d1'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>⌨️ Ejemplo: Navegación por Teclado</h2>
      
      {/* Panel de información en tiempo real */}
      <div style={{ 
        marginBottom: '20px', 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
      }}>
        {/* Última acción */}
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4>🎯 Última Acción</h4>
          <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>
            {ultimaAccion || 'Presiona alguna tecla...'}
          </p>
        </div>

        {/* Atajos disponibles */}
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e8f4fd',
          borderRadius: '8px',
          border: '1px solid #bee5eb'
        }}>
          <h4>⌨️ Atajos Configurados</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '0.85rem' }}>
            <span><kbd style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #ccc' }}>H</kbd> Ir a Hoy</span>
            <span><kbd style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #ccc' }}>M</kbd> Vista Mes</span>
            <span><kbd style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #ccc' }}>S</kbd> Vista Semana</span>
            <span><kbd style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #ccc' }}>A</kbd> Vista Año</span>
            <span><kbd style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #ccc' }}>R</kbd> Reportes</span>
            <span><kbd style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #ccc' }}>B</kbd> Buscar</span>
            <span><kbd style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #ccc' }}>C</kbd> Config</span>
            <span><kbd style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #ccc' }}>←→</kbd> Navegar</span>
          </div>
        </div>
      </div>

      {/* Configuración de atajos */}
      <div style={{ marginBottom: '20px' }}>
        <h4>🔧 Personalizar Atajos</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {Object.entries(atajosPersonalizados).map(([accion, tecla]) => (
            <div key={accion} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ minWidth: '80px', fontSize: '0.9rem' }}>{accion}:</label>
              <input
                type="text"
                value={tecla}
                onChange={(e) => setAtajosPersonalizados(prev => ({ ...prev, [accion]: e.target.value }))}
                style={{ 
                  width: '40px', 
                  textAlign: 'center', 
                  padding: '4px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                maxLength={1}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Casos de uso empresariales */}
      <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
        <strong>🏢 Casos de uso empresariales:</strong>
        <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
          <li><strong>Navegación rápida:</strong> Usuarios power pueden navegar sin ratón</li>
          <li><strong>Accesibilidad:</strong> Cumple estándares de accesibilidad web</li>
          <li><strong>Productividad:</strong> Atajos personalizados para acciones frecuentes</li>
          <li><strong>Integración:</strong> Callbacks para lógica empresarial específica</li>
        </ul>
      </div>

      {/* Calendario con navegación por teclado */}
      <Calendario
        datos={tareas}
        config={{
          teclado: {
            habilitado: true,
            atajos: atajosPersonalizados,
            onAccion: manejarAccionTeclado,
          },
          cabecera: {
            mostrarCambioModo: true,
            mostrarControlesNavegacion: true,
            mostrarBotonHoy: true,
            modos: ['semana', 'mes', 'anio'],
          },
        }}
        renderDato={(tarea) => (
          <div style={{ 
            backgroundColor: colorPorTipo[tarea.tipo],
            color: 'white', 
            padding: '3px 6px', 
            borderRadius: '4px',
            fontSize: '0.8rem',
            margin: '2px 0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontWeight: 'bold' }}>{tarea.titulo}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
              {tarea.tipo.charAt(0).toUpperCase() + tarea.tipo.slice(1)}
            </div>
          </div>
        )}
      />

      {/* Instrucciones detalladas */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>📖 Instrucciones de Navegación por Teclado</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '15px' }}>
          <div>
            <h5>🗓️ Navegación Básica</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>Flechas ←→:</strong> Navegar por períodos</li>
              <li><strong>H:</strong> Ir al día de hoy</li>
              <li><strong>M/S/A:</strong> Cambiar modo vista</li>
              <li><strong>Escape:</strong> Cancelar acciones</li>
            </ul>
          </div>
          
          <div>
            <h5>🎯 Atajos Empresariales</h5>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li><strong>R:</strong> Generar reportes</li>
              <li><strong>B:</strong> Buscar eventos</li>
              <li><strong>C:</strong> Abrir configuración</li>
              <li><strong>Personalizable:</strong> Define tus propios atajos</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', fontSize: '0.9rem' }}>
          <strong>💡 Consejo:</strong> Este calendario mantiene el foco y permite navegación completa por teclado, 
          ideal para aplicaciones empresariales donde la eficiencia y accesibilidad son críticas.
        </div>
      </div>
    </div>
  );
};
