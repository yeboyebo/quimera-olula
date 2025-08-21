import { QSelect } from "../../../../componentes/atomos/qselect.tsx";

interface EstadoProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const opcionesEstado = [
    { valor: "nueva", descripcion: "Nueva" },
    { valor: "en_espera", descripcion: "En espera" },
    { valor: "asignada", descripcion: "Asignada" },
    { valor: "rechazada", descripcion: "Rechazada" },
    { valor: "cerrada", descripcion: "Cerrada" },
]

export const EstadoIncidencia = ({ valor, onChange, getProps }: EstadoProps) => {
  return (
    <QSelect
      label="Estado"
      nombre="estado"
      valor={valor}
      onChange={onChange}
      opciones={opcionesEstado}
      {...(getProps ? getProps("estado") : {})}
    />
  );
};
