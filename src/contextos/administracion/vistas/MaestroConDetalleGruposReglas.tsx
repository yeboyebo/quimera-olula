import { useEffect } from "react";
import { Listado } from "../../../componentes/maestro/Listado.tsx";
import { useLista } from "../../comun/useLista.ts";
import { Grupo, Permiso, Regla } from "../diseño.ts";
import { getGrupos, getPermisos, getReglas } from "../infraestructura.ts";
import { ReglasGrupo } from "./ReglasGrupo/ReglasGrupo.tsx";

const metaTablaGrupos = [
  { id: "id", cabecera: "Grupo" },
  { id: "descripcion", cabecera: "Descripción" },
];

export const MaestroConDetalleGruposReglas = () => {
  const grupos = useLista<Grupo>([]);
  const reglas = useLista<Regla>([]);
  const permisos = useLista<Permiso>([]);

  useEffect(() => {
    getGrupos().then(grupos.setLista);
    getReglas().then(reglas.setLista);
    getPermisos().then(permisos.setLista);
  }, []);

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
      <ReglasGrupo
        reglas={reglas}
        permisos={permisos}
        grupoSeleccionado={grupos.seleccionada}
      />
    </div>
  );
};
