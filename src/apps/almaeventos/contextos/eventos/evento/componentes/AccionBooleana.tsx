import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { Evento } from "../diseño.ts";

export const AccionBooleana = ({ 
  campo, 
  valor, 
  evento, 
  onClick 
}: { 
  campo: keyof Evento; 
  valor: boolean; 
  evento: Evento; 
  onClick: (e: Evento, v: boolean) => void 
}) => (
  <span 
    className="accion-campo" 
    onClick={() => onClick({ ...evento, [campo]: !valor }, !valor)} 
    title={`Cambiar ${campo}`}
  >
    <QIcono nombre={valor ? "verdadero" : "falso"} color={valor ? "green" : "red"} />
  </span>
);