import "./qicono.css";

type QIconoProps = {
  nombre: string;
  tamaño?: "xs" | "sm" | "md" | "lg" | "xl";
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
};

export const QIcono = ({ nombre, tamaño = "md" }: QIconoProps) => {
  return (
    <quimera-icono>
      <box-icon name={iconos[nombre]} size={tamaño}></box-icon>
    </quimera-icono>
  );
};
