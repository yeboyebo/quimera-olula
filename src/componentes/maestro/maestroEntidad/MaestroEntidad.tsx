import { useContext } from "react";
import { Contexto } from "../../../contextos/comun/contexto.ts";
import { Entidad } from "../../../contextos/comun/diseño.ts";
import "./MaestroEntidad.css";

type MaestroEntidadProps<T extends Entidad> = {
  entidad: T;
  onClick?: (e: Entidad) => void;
};

export const MaestroEntidad = <T extends Entidad>({
  entidad,
  onClick,
}: MaestroEntidadProps<T>) => {
  const { id, ...resto } = entidad;

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto nulo");
  }
  const { seleccionada } = context;

  return (
    <li
      key={id}
      className={ entidad.id == seleccionada?.id ? "maestroEntidadSeleccionada": "maestroEntidad"}
      onClick={() => onClick && onClick(entidad)}
    >
      <span className="id">{id}</span>
      {Object.entries(resto)
        .filter(([, valor]) => !Array.isArray(valor))
        .flatMap(([clave, valor]) => {
          if (valor?.constructor !== Object) return [[clave, valor]];

          return Object.entries(valor).map(([claveInterna, valor]) => [
            clave + "." + claveInterna,
            valor,
          ]);
        })
        .map(([clave, valor]) => (
          <span key={clave} style={{ marginLeft: "1rem" }}>
            {valor === false ? "No" : valor === true ? "Sí" : valor}
          </span>
        ))}
    </li>
  );
};
