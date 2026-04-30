import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "@olula/lib/diseño.ts";
import { useEffect, useState } from "react";
import { getAgentes } from "#/ventas/agente/infraestructura.ts";

type AgenteProps = Omit<QAutocompletarProps, "obtenerOpciones" | "label"> & { label?: string };

type OpcionAgente = {
  valor: string;
  descripcion: string;
};

export const Agente = ({
  valor,
  nombre = "agente_id",
  label = "Agente",
  onChange,
  ...props
}: AgenteProps) => {
  const [opciones, setOpciones] = useState<OpcionAgente[]>([]);

  useEffect(() => {
    getAgentes(undefined as unknown as Filtro, undefined as unknown as Orden).then((agentes) =>
      setOpciones(agentes.map((a) => ({ valor: a.id, descripcion: a.nombre })))
    );
  }, []);

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opciones}
      {...props}
    />
  );
};
