import { getAgentesTpv } from "#/tpv/agente/infraestructura.ts";
import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Criteria } from "@olula/lib/diseño.js";
interface ArticuloProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  ref?: React.RefObject<HTMLInputElement | null>;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const AgenteTpv = ({
  descripcion = "",
  valor,
  nombre = "agente_tpv",
  label = "Agente",
  onChange,
  ...props
}: ArticuloProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria: Criteria = {
      filtro: ["descripcion", "~", texto],
      orden: ["id"],
      paginacion: { limite: 1000, pagina: 1 },
    };

    const agentes = await getAgentesTpv(criteria);

    return agentes.datos.map((agente) => ({
      valor: agente.id,
      descripcion: agente.nombre,
      agente: agente,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
      {...props}
    />
  );
};
