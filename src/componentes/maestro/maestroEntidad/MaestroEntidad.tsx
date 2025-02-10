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
      <span>Cliente: {id}</span>
      {Object.entries(resto).map(([clave, valor]) => (
        <span style={{ marginLeft: "1rem" }} key={clave}>
          {clave}: {valor}
        </span>
      ))}
    </li>
  );
};
