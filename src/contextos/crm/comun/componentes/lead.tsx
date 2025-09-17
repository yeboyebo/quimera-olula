import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { getLeads } from "../../lead/infraestructura.ts";

interface LeadSelectorProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const LeadSelector = ({
  descripcion = "",
  valor,
  nombre = "lead_id",
  label = "Seleccionar lead",
  deshabilitado = false,
  onChange,
}: LeadSelectorProps) => {
  const obtenerOpciones = async (valor: string) => {
    if (valor.length < 3) return [];

    const criteria = {
      filtro: ["id", "~", valor],
      orden: ["id"],
    };

    const { datos: leads } = await getLeads(
      criteria.filtro as unknown as Filtro,
      criteria.orden as Orden
    );

    return leads.map((lead) => ({
      valor: lead.id,
      descripcion: `${lead.id} - ${lead.nombre}`,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      autoSeleccion
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
      deshabilitado={deshabilitado}
    />
  );
};
