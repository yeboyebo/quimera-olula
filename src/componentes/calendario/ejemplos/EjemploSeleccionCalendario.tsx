import { useState } from 'react';
import { Calendario } from '../calendario';
import { EstadoSeleccion, TipoSeleccion } from '../tipos';

/**
 * Ejemplo de uso del calendario con selección de fechas
 * Implementación genérica para cualquier aplicación empresarial
 */

interface EjemploEvento {
  id: string;
  fecha: Date;
  descripcion: string;
}

export const EjemploSeleccionCalendario = () => {
  const [seleccionActual, setSeleccionActual] = useState<EstadoSeleccion | null>(null);
  const [tipoSeleccion, setTipoSeleccion] = useState<TipoSeleccion>('simple');

  // Datos de ejemplo
  const eventos: EjemploEvento[] = [
    { id: '1', fecha: new Date(2025, 8, 10), descripcion: 'Reunión equipo' },
    { id: '2', fecha: new Date(2025, 8, 15), descripcion: 'Revisión proyecto' },
    { id: '3', fecha: new Date(2025, 8, 20), descripcion: 'Entrega final' },
  ];

  // Fechas que no se pueden seleccionar (ejemplo: fines de semana)
  const fechasDeshabilitadas = (() => {
    const fechas: Date[] = [];
    const hoy = new Date();
    
    // Deshabilitar los próximos 30 fines de semana
    for (let i = 0; i < 30; i++) {
      const fecha = new Date(hoy.getTime() + i * 24 * 60 * 60 * 1000);
      if (fecha.getDay() === 0 || fecha.getDay() === 6) { // Domingo o Sábado
        fechas.push(fecha);
      }
    }
    return fechas;
  })();

  const manejarCambioSeleccion = (seleccion: EstadoSeleccion) => {
    setSeleccionActual(seleccion);
    console.log('📅 Selección cambiada:', {
      tipo: seleccion.tipo,
      fechas: seleccion.fechas.map(f => f.toISOString().split('T')[0]),
      rango: seleccion.fechaInicio && seleccion.fechaFin ? {
        inicio: seleccion.fechaInicio.toISOString().split('T')[0],
        fin: seleccion.fechaFin.toISOString().split('T')[0],
      } : null,
      esValida: seleccion.esValida,
      error: seleccion.error,
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>📅 Ejemplo: Selección de Fechas en Calendario</h2>
      
      {/* Controles */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>
          <strong>Tipo de selección:</strong>
          <select 
            value={tipoSeleccion} 
            onChange={(e) => setTipoSeleccion(e.target.value as TipoSeleccion)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="simple">Simple (un día)</option>
            <option value="multiple">Múltiple (varios días)</option>
            <option value="rango">Rango (período)</option>
          </select>
        </label>
      </div>

      {/* Información de selección actual */}
      {seleccionActual && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: seleccionActual.esValida ? '#e8f5e8' : '#ffe8e8',
          borderRadius: '8px',
          border: `1px solid ${seleccionActual.esValida ? '#4caf50' : '#f44336'}`
        }}>
          <h4>🎯 Selección Actual</h4>
          <p><strong>Tipo:</strong> {seleccionActual.tipo}</p>
          <p><strong>Fechas:</strong> {seleccionActual.fechas.length > 0 
            ? seleccionActual.fechas.map(f => f.toLocaleDateString('es-ES')).join(', ')
            : 'Ninguna'
          }</p>
          {seleccionActual.fechaInicio && seleccionActual.fechaFin && (
            <p><strong>Rango:</strong> {seleccionActual.fechaInicio.toLocaleDateString('es-ES')} - {seleccionActual.fechaFin.toLocaleDateString('es-ES')}</p>
          )}
          <p><strong>Estado:</strong> 
            <span style={{ color: seleccionActual.esValida ? '#4caf50' : '#f44336' }}>
              {seleccionActual.esValida ? ' ✓ Válida' : ` ✗ ${seleccionActual.error || 'Inválida'}`}
            </span>
          </p>
        </div>
      )}

      {/* Casos de uso empresariales */}
      <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
        <strong>💼 Casos de uso empresariales:</strong>
        <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
          <li><strong>Simple:</strong> Seleccionar fecha de reunión, cita, evento puntual</li>
          <li><strong>Múltiple:</strong> Días de formación, turnos específicos, fechas de entrega</li>
          <li><strong>Rango:</strong> Períodos de vacaciones, campañas, análisis temporal, reservas</li>
        </ul>
      </div>

      {/* Calendario con selección */}
      <Calendario
        datos={eventos}
        config={{
          seleccion: {
            tipo: tipoSeleccion,
            fechasDeshabilitadas: tipoSeleccion !== 'simple' ? fechasDeshabilitadas : undefined,
            maxDias: tipoSeleccion === 'multiple' ? 10 : undefined,
            minDias: tipoSeleccion === 'rango' ? 2 : undefined,
            mensajeError: tipoSeleccion === 'rango' 
              ? 'El rango debe tener al menos 2 días'
              : tipoSeleccion === 'multiple'
              ? 'Máximo 10 días seleccionables'
              : undefined,
          },
        }}
        onSeleccionCambio={manejarCambioSeleccion}
        renderDato={(evento) => (
          <div style={{ 
            backgroundColor: '#3a86ff', 
            color: 'white', 
            padding: '2px 4px', 
            borderRadius: '3px',
            fontSize: '0.8rem',
            margin: '1px 0'
          }}>
            {evento.descripcion}
          </div>
        )}
      />

      {/* Instrucciones */}
      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
        <h4>📖 Instrucciones:</h4>
        <ul>
          <li><strong>Simple:</strong> Haz clic en un día para seleccionarlo</li>
          <li><strong>Múltiple:</strong> Haz clic en varios días (evita fines de semana)</li>
          <li><strong>Rango:</strong> Haz clic en el día inicio, luego en el día final</li>
        </ul>
      </div>
    </div>
  );
};
