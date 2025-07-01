import "./qicono.css";

type QIconoProps = {
  nombre: string;
  tamaño?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
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
  usuario: "user",
  perfil: "user-circle",
  cerrar_sesion: "arrow-out-up-square-half",
};

export const QIcono = ({
  nombre,
  tamaño = "md",
  color = "black",
}: QIconoProps) => {
  return (
    <quimera-icono>
      <box-icon name={iconos[nombre]} size={tamaño} color={color}></box-icon>
    </quimera-icono>
  );
};
