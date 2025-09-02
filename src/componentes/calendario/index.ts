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
export { isMobile, useSwipe } from './hooks';

// Componente de ejemplo
export { EjemploSeleccionCalendario } from './EjemploSeleccionCalendario';
