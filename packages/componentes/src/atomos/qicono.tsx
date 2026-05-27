import {
  IconArrowBack,
  IconArrowBarRight,
  IconCalendar,
  IconChartBar,
  IconCheck,
  IconCheckbox,
  IconChecks,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircle,
  IconCircleFilled,
  IconCirclePlus,
  IconCircleX,
  IconCopy,
  IconCreditCard,
  IconDeviceFloppy,
  IconEdit,
  IconEye,
  IconFile,
  IconHome,
  IconHourglass,
  IconList,
  IconLock,
  IconLockOpen,
  IconLogout,
  IconMail,
  IconMenu2,
  IconMinus,
  IconPencil,
  IconPhone,
  IconPlus,
  IconQuestionMark,
  IconSearch,
  IconShoppingCart,
  IconStar,
  IconTable,
  IconTag,
  IconTrash,
  IconUser,
  IconTool,
  IconX,
  type Icon,
} from "@tabler/icons-react";
import "./qicono.css";

type QIconoProps = {
  nombre: string;
  tamaño?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  style?: React.CSSProperties;
};

const tamaños: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 28,
  xl: 40,
};

// https://tabler.io/icons
const iconos: Record<string, Icon> = {
  añadir: IconCirclePlus,
  buscar: IconSearch,
  cerrar: IconX,
  inicio: IconHome,
  fichero: IconFile,
  grafico_barras: IconChartBar,
  candado: IconLock,
  candado_abierto: IconLockOpen,
  editar: IconEdit,
  editar_2: IconPencil,
  eliminar: IconTrash,
  guardar: IconDeviceFloppy,
  copiar: IconCopy,
  usuario: IconUser,
  perfil: IconUser,
  cerrar_sesion: IconLogout,
  verdadero: IconCheck,
  falso: IconX,
  atras: IconArrowBack,
  adelante: IconArrowBarRight,
  menu: IconMenu2,
  calendario_vacio: IconCalendar,
  check: IconCheck,
  checkdoble: IconChecks,
  x_circle: IconCircleX,
  minus: IconMinus,
  lista: IconList,
  carrito: IconShoppingCart,
  tarjeta: IconCreditCard,
  etiqueta_compra: IconTag,
  llave_inglesa: IconTool,
  llaveinglesa: IconTool,
  ver: IconEye,
  crear: IconPlus,
  tabla: IconTable,
  arriba: IconChevronUp,
  abajo: IconChevronDown,
  izquierda: IconChevronLeft,
  derecha: IconChevronRight,
  circulo: IconCircle,
  circulo_relleno: IconCircleFilled,
  telefono: IconPhone,
  correo: IconMail,
  casa: IconHome,
  tarea: IconCheckbox,
  estrella: IconStar,
  relojarena: IconHourglass,
};

export const QIcono = ({
  nombre,
  tamaño = "md",
  color,
  style,
}: QIconoProps) => {
  const Icono = iconos[nombre] ?? IconQuestionMark;
  const size = tamaños[tamaño] ?? 20;

  return (
    <quimera-icono>
      <Icono size={size} color={color} style={style} />
    </quimera-icono>
  );
};
