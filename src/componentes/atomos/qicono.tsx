import "./qicono.css";

type QIconoProps = {
  nombre: string;
  tamaño?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  style?: React.CSSProperties;
  props?: React.HTMLAttributes<HTMLDivElement>;
};

const iconos: Record<string, string> = {
  buscar: "search-alt-2",
  cerrar: "x",
  inicio: "home",
  fichero: "file",
  grafico_barras: "bar-chart-alt-2",
  candado: "lock-alt",
  candado_abierto: "lock-open-alt",
  editar: "edit",
  eliminar: "trash",
  guardar: "save",
  copiar: "copy",
  usuario: "user",
  perfil: "user",
  cerrar_sesion: "arrow-out-up-square-half",
  verdadero: "check",
  falso: "x",
  atras: 'chevron-left',
  adelante: 'chevron-right',
  menu: 'menu',
  calendario_vacio: 'calendar-alt',
  check: "check",
  x_circle: "x-circle",
  minus: "minus",
  lista: "list-ul",
  tarjeta: "credit-card",
};

export const QIcono = ({ nombre, tamaño = "md", color, style, props }: QIconoProps) => {
  return (
    <quimera-icono>
      <box-icon name={iconos[nombre]} size={tamaño} color={color} style={style} {...props}></box-icon>
    </quimera-icono>
  );
};
