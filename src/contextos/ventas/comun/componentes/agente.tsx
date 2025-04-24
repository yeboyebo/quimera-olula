import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";

interface AgenteProps {
  agente_id: string;
  onAgenteChanged: (
    opcion: { valor: string; descripcion: string } | null
  ) => void;
}

export const Agentes = ({ agente_id, onAgenteChanged }: AgenteProps) => {
  const obtenerOpcionesAgente = async () => [
    { valor: "1", descripcion: "Antonio 1" },
    { valor: "2", descripcion: "Juanma 2" },
    { valor: "3", descripcion: "Pozu 3" },
  ];

  return (
    <QAutocompletar
      label="Agente"
      nombre="agente_id"
      onChange={onAgenteChanged}
      valor={agente_id}
      obtenerOpciones={obtenerOpcionesAgente}
    />
  );
};
