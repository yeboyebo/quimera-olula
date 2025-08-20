import { ReglaAnidada } from "../../../diseño.ts";
import { AccionesRegla } from "./Acciones.tsx";

export const SubReglaItem = ({
  regla,
  padre,
  grupoId,
  emitir,
}: {
  regla: ReglaAnidada;
  padre?: ReglaAnidada;
  grupoId: string;
  emitir: (evento: string, payload?: unknown) => void;
}) => (
  <div className="regla-item subregla">
    <div>{regla.descripcion.split(" - ").slice(2).join(" - ")}</div>
    <AccionesRegla
      regla={regla}
      reglaPadre={padre}
      grupoId={grupoId}
      emitir={emitir}
    />
  </div>
);
