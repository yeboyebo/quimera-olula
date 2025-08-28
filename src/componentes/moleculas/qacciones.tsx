import { QBoton } from "../atomos/qboton.tsx";
import { QIcono } from "../atomos/qicono.tsx";
import "./qacciones.css";

export type Accion = {
  icono?: string;
  texto?: string;
  onClick: () => void;
  deshabilitado?: boolean;
  variante?: "solido" | "borde" | "texto";
};

export const QuimeraAcciones = ({
  acciones,
  vertical = false,
}: {
  acciones: Accion[];
  vertical?: boolean;
}) => (
  <quimera-acciones className={vertical ? "vertical" : ""}>
    {acciones.map((accion) =>
      accion.icono && !accion.texto ? (
        <span key={accion.icono} onClick={accion.onClick}>
          <QIcono nombre={accion.icono} tamaño="md" />
        </span>
      ) : (
        <QBoton
          key={accion.texto || accion.icono}
          onClick={accion.onClick}
          deshabilitado={accion.deshabilitado}
          variante={accion.variante}
        >
          {accion.icono && <QIcono nombre={accion.icono} tamaño="sm" />}
          {accion.texto}
        </QBoton>
      )
    )}
  </quimera-acciones>
);
