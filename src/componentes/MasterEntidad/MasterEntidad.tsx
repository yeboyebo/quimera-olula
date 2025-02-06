import { Entidad } from "../../contextos/comun/diseño.ts";

type MasterEntidadProps<T extends Entidad> = {
  entidad: T;
};

export const MasterEntidad = <T extends Entidad>({
  entidad,
}: MasterEntidadProps<T>) => {
  const { id, ...resto } = entidad;

  return (
    <li key={id} style={{ display: "flex", flexDirection: "column" }}>
      <span>Cliente: {id}</span>
      {Object.entries(resto).map(([clave, valor]) => (
        <span style={{ marginLeft: "1rem" }} key={clave}>
          {clave}: {valor}
        </span>
      ))}
    </li>
  );
};
