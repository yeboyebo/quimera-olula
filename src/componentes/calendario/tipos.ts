// Tipo base que deben cumplir todos los eventos
export interface EventoBase {
  id: string | number;
  fecha: Date | string;
  descripcion: string;
  [key: string]: any; // Permite propiedades adicionales
}

// Tipo para las funciones de formateo personalizadas
export interface CalendarioConfig<T extends EventoBase = EventoBase> {
  esHoy?: (fecha: Date) => boolean;
  esMesActual?: (fecha: Date, mesReferencia: Date) => boolean;
  formatearMes?: (fecha: Date) => string;
  formatearMesAño?: (fecha: Date) => string;
  getDiasDelMes?: (fecha: Date) => Date[];
  getEventosPorFecha?: (eventos: T[], fecha: Date) => T[];
  getSemanasDelMes?: (fecha: Date) => Date[][];
}