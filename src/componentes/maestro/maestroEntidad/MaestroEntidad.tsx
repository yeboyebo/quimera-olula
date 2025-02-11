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

  return (
    <li
      key={id}
      className="maestroEntidad"
      onClick={() => onClick && onClick(entidad)}
    >
      <span className="id">{id}</span>
      {Object.entries(resto)
        .filter(([, valor]) => !Array.isArray(valor))
        .flatMap(([clave, valor]) => {
          if (valor.constructor !== Object) return [[clave, valor]];

          return Object.entries(valor).map(([claveInterna, valor]) => [
            clave + "." + claveInterna,
            valor,
          ]);
        })
        .map(([clave, valor]) => (
          <span key={clave} style={{ marginLeft: "1rem" }}>
            {valor}
          </span>
        ))}
    </li>
  );
};
