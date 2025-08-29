import { ConfigTeclado } from './useNavegacionTeclado';

// Tipo base que deben cumplir todos los datos
export interface DatoBase {
  id: string | number;
  fecha: Date | string;
  [key: string]: any; // Permite propiedades adicionales
}

// Tipos para los modos de vista del calendario
export type ModoCalendario = 'semana' | 'mes' | 'anio';

// Tipo para las funciones de formateo personalizadas
export interface CalendarioConfig<T extends DatoBase = DatoBase> {
  /** Permite controlar la fecha actual desde fuera (modo controlado, útil para móvil) */
  fechaActual?: Date;
  onFechaActualChange?: (fecha: Date) => void;
  /** Callbacks para carga infinita cuando se navega fuera del rango de datos */
  onNecesitaDatosAnteriores?: () => Promise<void>;
  onNecesitaDatosPosteriores?: () => Promise<void>;
  formatearMes?: (fecha: Date) => string;
  formatearMesAño?: (fecha: Date) => string;
  getDiasDelMes?: (fecha: Date) => Date[];
  getSemanasDelMes?: (fecha: Date) => Date[][];
  maxDatosVisibles?: number;
  inicioSemana?: 'lunes' | 'domingo';
  getDatosPorFecha?: (datos: T[], fecha: Date) => T[];
  esHoy?: (fecha: Date) => boolean;
  esMesActual?: (fecha: Date, mesReferencia: Date) => boolean;
  cabecera?: {
    botonesIzqModo?: React.ReactNode[];
    botonesDerModo?: React.ReactNode[];
    botonesIzqHoy?: React.ReactNode[];
    botonesDerHoy?: React.ReactNode[];
    mostrarCambioModo?: boolean;
    modos?: ModoCalendario[]; // Array de modos permitidos
    mostrarControlesNavegacion?: boolean;
    mostrarBotonHoy?: boolean;
    modoCalendario?: ModoCalendario;
  };
  teclado?: ConfigTeclado;
  estilos?: {
    dia?: React.CSSProperties;
    dato?: React.CSSProperties;
    cabecera?: React.CSSProperties;
    boton?: React.CSSProperties;
  };
}

export interface PersonalizacionCalendario<T extends DatoBase> {
  renderDia?: (args: {
    fecha: Date;
    datos: T[];
    esMesActual: boolean;
    esHoy: boolean;
  }) => React.ReactNode;

  renderDato?: (dato: T) => React.ReactNode;

}