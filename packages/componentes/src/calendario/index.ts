// Exportaciones principales del calendario
export { Calendario } from './calendario';

// Tipos para selección de fechas
export type {
  CalendarioConfig, ConfiguracionSeleccion, DatoBase, EstadoSeleccion, ModoCalendario, TipoSeleccion
} from './tipos';

// Hooks principales
export { useNavegacionTeclado } from './useNavegacionTeclado';
export { useSeleccionFechas } from './useSeleccionFechas';

// Utilidades y helpers
export {
  esHoy,
  esMesActual,
  formatearMes,
  formatearMesAño, getDatosPorFecha, getDiasDelMes, getSemanasDelMes
} from './helpers';
export { useIsMobile, useSwipe } from './hooks';

// Componentes de ejemplo
export { EjemploCalendarioMovil } from './ejemplos/EjemploCalendarioMovil';
export { EjemploCargaInfinita } from './ejemplos/EjemploCargaInfinita';
export { EjemploModosMúltiples } from './ejemplos/EjemploModosMúltiples';
export { EjemploNavegacionTeclado } from './ejemplos/EjemploNavegacionTeclado';
export { EjemploPersonalizacionVisual } from './ejemplos/EjemploPersonalizacionVisual';
export { EjemploSeleccionCalendario } from './ejemplos/EjemploSeleccionCalendario';

// Playground interactivo
export { CalendarioPlayground } from './CalendarioPlayground';

