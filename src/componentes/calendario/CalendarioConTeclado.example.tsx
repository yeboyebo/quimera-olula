import { useState } from 'react';
import { Calendario } from './calendario';
import { DatoBase } from './tipos';

// Ejemplo de evento simple
interface EventoEjemplo extends DatoBase {
  id: string;
  fecha: Date;
  titulo: string;
  descripcion?: string;
}

// Datos de ejemplo
const eventosEjemplo: EventoEjemplo[] = [
  {
    id: '1',
    fecha: new Date('2024-01-15'),
    titulo: 'Reunión importante',
    descripcion: 'Reunión con el equipo de desarrollo'
  },
  {
    id: '2', 
    fecha: new Date('2024-01-20'),
    titulo: 'Presentación',
    descripcion: 'Presentación del proyecto a los clientes'
  },
  {
    id: '3',
    fecha: new Date('2024-02-05'),
    titulo: 'Capacitación',
    descripcion: 'Capacitación en nuevas tecnologías'
  }
];

export function CalendarioConTeclado() {
  const [accionCustom, setAccionCustom] = useState<string>('');

  return (
    <div>
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Navegación por Teclado</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><kbd>H</kbd> - Ir a Hoy</li>
          <li><kbd>M</kbd> - Cambiar a Modo Mes</li>
          <li><kbd>A</kbd> - Cambiar a Modo Año</li>
          <li><strong>Modo Mes:</strong> <kbd>←</kbd><kbd>→</kbd> cambiar mes, <kbd>↑</kbd><kbd>↓</kbd> scroll + cambio de año</li>
          <li><strong>Modo Año:</strong> <kbd>←</kbd><kbd>→</kbd> cambiar año, <kbd>↑</kbd><kbd>↓</kbd> solo scroll</li>
          <li><kbd>R</kbd> - Acción personalizada (ejemplo)</li>
        </ul>
        {accionCustom && (
          <div style={{ marginTop: '10px', color: '#2563eb' }}>
            Última acción personalizada: {accionCustom}
          </div>
        )}
      </div>

      <Calendario
        datos={eventosEjemplo}
        config={{
          // Configuración de teclado personalizada
          teclado: {
            habilitado: true,
            atajos: {
              hoy: 'h',
              modoMes: 'm', 
              modoAño: 'a',
              recargar: 'r' // Atajo personalizado
            },
            onAccion: (accion, contexto) => {
              console.log('Acción de teclado:', accion, contexto);
              if (accion === 'recargar') {
                setAccionCustom(`Recarga solicitada en ${contexto.fechaActual.toLocaleDateString()}`);
              }
            }
          },
          // Configuración de vista
          maxDatosVisibles: 3,
          inicioSemana: 'lunes'
        }}
        renderDato={(evento) => (
          <div style={{ 
            fontSize: '0.75rem', 
            padding: '2px 4px',
            background: '#e3f2fd',
            borderRadius: '3px',
            marginBottom: '2px'
          }}>
            {evento.titulo}
          </div>
        )}
        renderDia={({ fecha, datos, esMesActual, esHoy }) => (
          <div style={{
            background: esHoy ? '#fef3c7' : 'transparent',
            opacity: esMesActual ? 1 : 0.5,
            padding: '4px',
            borderRadius: '4px'
          }}>
            <div style={{ 
              fontWeight: esHoy ? 'bold' : 'normal',
              color: esHoy ? '#92400e' : 'inherit'
            }}>
              {fecha.getDate()}
            </div>
            <div>
              {datos.map(evento => (
                <div key={evento.id} style={{ 
                  fontSize: '0.7rem',
                  background: '#dbeafe', 
                  padding: '1px 3px',
                  borderRadius: '2px',
                  marginTop: '1px'
                }}>
                  {evento.titulo}
                </div>
              ))}
            </div>
          </div>
        )}
      />
    </div>
  );
}
