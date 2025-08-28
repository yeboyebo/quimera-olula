import { QSelect } from "../../../../componentes/atomos/qselect.tsx";

interface PrioridadProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

const opcionesPrioridad = [
  { valor: "alta", descripcion: "Alta" },
  { valor: "media", descripcion: "Media" },
  { valor: "baja", descripcion: "Baja" },
];

export const PrioridadIncidencia = ({
  valor,
  onChange,
  getProps,
}: PrioridadProps) => {
  return (
    <QSelect
      label="Prioridad"
      nombre="prioridad"
      valor={valor}
      onChange={onChange}
      opciones={opcionesPrioridad}
      {...(getProps ? getProps("prioridad") : {})}
    />
  );
};
