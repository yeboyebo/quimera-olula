// Tipo base que deben cumplir todos los datos
export interface DatoBase {
  id: string | number;
  fecha: Date | string;
  [key: string]: any; // Permite propiedades adicionales
}

// Tipo para las funciones de formateo personalizadas
export interface CalendarioConfig<T extends DatoBase = DatoBase> {
  formatearMes?: (fecha: Date) => string;
  formatearMesAño?: (fecha: Date) => string;
  getDiasDelMes?: (fecha: Date) => Date[];
  getSemanasDelMes?: (fecha: Date) => Date[][];
  maxDatosVisibles?: number;
  getDatosPorFecha?: (datos: T[], fecha: Date) => T[];
  esHoy?: (fecha: Date) => boolean;
  esMesActual?: (fecha: Date, mesReferencia: Date) => boolean;
  cabecera?: {
    botonesIzquierda?: React.ReactNode[];
    botonesDerecha?: React.ReactNode[];
    mostrarCambioModo?: boolean;
    mostrarControlesNavegacion?: boolean;
    mostrarBotonHoy?: boolean;
    modoCalendario?: 'mes' | 'anio';
  };
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