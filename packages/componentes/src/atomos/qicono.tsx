import "./qicono.css";

type QIconoProps = {
  nombre: string;
  tamaño?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  style?: React.CSSProperties;
  props?: React.HTMLAttributes<HTMLDivElement>;
};

type Icono = {
  nombre: string;
  tipo?: "solid" | "regular" | "logo";
};

// Libreria Iconos: https://v2.boxicons.com/cheatsheet
const iconos: Record<string, string | Icono> = {
  arriba: "chevron-up",
  abajo: "chevron-down",
  atras: "chevron-left",
  adelante: "chevron-right",
  ajustes: "cog",
  ajustes_relleno: { nombre: "cog", tipo: "solid" },
  archivar: "archive-in",
  archivar_relleno: { nombre: "archive-in", tipo: "solid" },
  añadir: "plus-circle",
  bolsa: "shopping-bag",
  bolsa_relleno: { nombre: "shopping-bag", tipo: "solid" },
  buscar: "search-alt-2",
  buscar_relleno: { nombre: "search-alt-2", tipo: "solid" },
  calendario: "calendar",
  calendario_relleno: { nombre: "calendar", tipo: "solid" },
  calendario_busqueda: "calendar-search",
  calendario_busqueda_relleno: "calendar-search-filled",
  calendario_vacio: "calendar-alt",
  calendario_vacio_relleno: { nombre: "calendar-alt", tipo: "solid" },
  candado: "lock-alt",
  candado_abierto: "lock-open-alt",
  carrito: "cart",
  carrito_relleno: { nombre: "cart", tipo: "solid" },
  cerrar: "x",
  cerrar_sesion: "exit",
  check: "check",
  circulo: { nombre: "circle", tipo: "regular" },
  circulo_relleno: { nombre: "circle", tipo: "solid" },
  copiar: "copy",
  crear: "plus",
  derecha: "chevron-right",
  desarchivar: "archive-out",
  desarchivar_relleno: { nombre: "archive-out", tipo: "solid" },
  detalle: "detail",
  detalle_relleno: { nombre: "detail", tipo: "solid" },
  editar: "edit",
  editar_2: "edit-alt",
  eliminar: "trash",
  evento: "calendar-event",
  evento_relleno: { nombre: "calendar-event", tipo: "solid" },
  falso: "x",
  fichero: "file",
  fichero_relleno: { nombre: "file", tipo: "solid" },
  guardar: "save",
  grafico_barras: "bar-chart-alt-2",
  grupo: "group",
  grupo_relleno: { nombre: "group", tipo: "solid" },
  inicio: "home",
  izquierda: "chevron-left",
  lista: "list-ul",
  menu: "menu",
  minus: "minus",
  paquete: "package",
  paquete_relleno: { nombre: "package", tipo: "solid" },
  perfil: "user",
  tabla: "table",
  tarjeta: "credit-card",
  tienda: "store",
  tienda_relleno: { nombre: "store", tipo: "solid" },
  tiempo: "time",
  tiempo_relleno: { nombre: "time", tipo: "solid" },
  usuario: "user",
  usuario_relleno: { nombre: "user", tipo: "solid" },
  usuario_detalle: "user-detail",
  usuario_detalle_relleno: { nombre: "user-detail", tipo: "solid" },
  ver: "show",
  verdadero: "check",
  x_circle: "x-circle",
};

export const QIcono = ({
  nombre,
  tamaño = "md",
  color,
  style,
  ...props
}: QIconoProps) => {
  let nombreIcono, tipo;
  if (typeof iconos[nombre] === "undefined") {
    nombreIcono = nombre;
    tipo = undefined;
  } else {
    if (typeof iconos[nombre] === "object") {
      nombreIcono = iconos[nombre].nombre;
      tipo = iconos[nombre].tipo;
    } else {
      nombreIcono = iconos[nombre];
      tipo = undefined;
    }
  }

  return (
    <quimera-icono>
      <box-icon
        name={nombreIcono}
        size={tamaño}
        color={color}
        style={style}
        type={tipo}
        {...props}
      ></box-icon>
    </quimera-icono>
  );
};
