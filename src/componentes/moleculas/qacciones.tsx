import { QBoton } from "../atomos/qboton.tsx";
import { QIcono } from "../atomos/qicono.tsx";
import "./qacciones.css";

export type Accion =
  | {
      icono?: string;
      texto?: string;
      onClick: () => void;
      deshabilitado?: boolean;
      variante?: "solido" | "borde" | "texto";
    }
  | false;

export const QuimeraAcciones = ({
  acciones,
  vertical,
}: {
  acciones: (Accion | false)[];
  vertical?: boolean;
}) => (
  <quimera-acciones className={vertical ? "vertical" : ""}>
    {acciones.filter(Boolean).map((accion) =>
      accion && typeof accion === "object" && accion.icono && !accion.texto ? (
        <span key={accion.icono} onClick={accion.onClick}>
          <QIcono nombre={accion.icono} tamaño="sm" />
        </span>
      ) : accion && typeof accion === "object" ? (
        <QBoton
          key={accion.texto || accion.icono}
          onClick={accion.onClick}
          deshabilitado={accion.deshabilitado}
          variante={accion.variante}
        >
          {accion.texto}
        </QBoton>
      ) : null
    )}
  </quimera-acciones>
);
