import { useEffect, useState } from "react";
import { Listado } from "../../../componentes/maestro/Listado.tsx";
import { Grupo, Regla } from "../diseño.ts";
import { getGrupos, getReglas } from "../infraestructura.ts";

const metaTablaGrupos = [
  { id: "id", cabecera: "Grupo" },
  { id: "descripcion", cabecera: "Descripción" },
];

const metaTablaReglas = [
  { id: "id", cabecera: "Regla" },
  { id: "descripcion", cabecera: "Descripción" },
];

export const MaestroConDetalleGruposReglas = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [reglas, setReglas] = useState<Regla[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo | null>(
    null
  );

  useEffect(() => {
    getGrupos().then(setGrupos);
  }, []);

  useEffect(() => {
    if (grupoSeleccionado) {
      getReglas().then(setReglas);
    } else {
      setReglas([]);
    }
  }, [grupoSeleccionado]);

  return (
    <div style={{ display: "flex", gap: "2rem", overflow: "hidden" }}>
      <div style={{ flexBasis: "50%", overflow: "auto" }}>
        <h2>Grupos</h2>
        <Listado
          metaTabla={metaTablaGrupos}
          entidades={grupos}
          setEntidades={setGrupos}
          cargar={getGrupos}
          seleccionada={grupoSeleccionado}
          setSeleccionada={setGrupoSeleccionado}
        />
      </div>
      <div style={{ flexBasis: "50%", overflow: "auto" }}>
        <h2>Reglas</h2>
        <Listado
          metaTabla={metaTablaReglas}
          entidades={reglas}
          setEntidades={setReglas}
          seleccionada={null}
          setSeleccionada={() => {}}
          cargar={getReglas}
        />
      </div>
    </div>
  );
};
