import { useEffect } from "react";
import { Listado } from "../../../componentes/maestro/Listado.tsx";
import { useLista } from "../../comun/useLista.ts";
import { Grupo, Regla } from "../diseño.ts";
import { getGrupos, getReglas } from "../infraestructura.ts";
import { ReglasGrupo } from "./ReglasGrupo/ReglasGrupo.tsx";

const metaTablaGrupos = [
  { id: "id", cabecera: "Grupo" },
  { id: "descripcion", cabecera: "Descripción" },
];

export const MaestroConDetalleGruposReglas = () => {
  const grupos = useLista<Grupo>([]);
  const reglas = useLista<Regla>([]);

  useEffect(() => {
    getGrupos().then(grupos.setLista);
  }, []);

  useEffect(() => {
    if (grupos.seleccionada) {
      getReglas().then(reglas.setLista);
    } else {
      reglas.setLista([]);
    }
  }, [grupos.seleccionada]);

  return (
    <div style={{ display: "flex", gap: "2rem", overflow: "hidden" }}>
      <div style={{ flexBasis: "50%", overflow: "auto" }}>
        <h2>Grupos</h2>
        <Listado
          metaTabla={metaTablaGrupos}
          entidades={grupos.lista}
          setEntidades={grupos.setLista}
          seleccionada={grupos.seleccionada}
          setSeleccionada={grupos.seleccionar}
          cargar={getGrupos}
        />
      </div>
      <ReglasGrupo reglas={reglas} grupoId={grupos.seleccionada?.id || ""} />
    </div>
  );
};
