import { Entidad } from "../../../contextos/comun/diseño.ts";

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
      style={{ display: "flex", flexDirection: "column" }}
      onClick={() => onClick && onClick(entidad)}
    >
      <span>ID: {id}</span>
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
            {clave}: {valor}
          </span>
        ))}
    </li>
  );
};
