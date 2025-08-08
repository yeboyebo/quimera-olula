import { useEffect, useState } from "react";
import { QBoton } from "../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../comun/useMaquina.ts";
import { Grupo, Regla } from "../diseño.ts";
import { getGrupos, getReglas } from "../infraestructura.ts";
import { AltaGrupo } from "./AltaGrupo.tsx";
import { ReglasGrupo } from "./ReglasGrupo/ReglasGrupo.tsx";

const metaTablaGrupos = [
  { id: "id", cabecera: "Grupo" },
  { id: "descripcion", cabecera: "Descripción" },
];

type Estado = "lista" | "alta";
export const MaestroConDetalleGruposReglas = () => {
  const grupos = useLista<Grupo>([]);
  const reglas = useLista<Regla>([]);
  const [estado, setEstado] = useState<Estado>("lista");

  useEffect(() => {
    getGrupos().then(({ datos }) => grupos.setLista(datos));
    getReglas().then(({ datos }) => reglas.setLista(datos));
  }, []);

  const maquina: Maquina<Estado> = {
    alta: {
      GRUPO_CREADO: (payload: unknown) => {
        const grupo = payload as Grupo;
        grupos.añadir(grupo);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="GruposReglas">
      <MaestroDetalleResponsive
        seleccionada={grupos.seleccionada}
        Maestro={
          <>
            <h2>Grupos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>
                Nuevo Grupo
              </QBoton>
            </div>
            <Listado
              metaTabla={metaTablaGrupos}
              entidades={grupos.lista}
              setEntidades={grupos.setLista}
              seleccionada={grupos.seleccionada}
              setSeleccionada={grupos.seleccionar}
              cargar={getGrupos}
            />
          </>
        }
        Detalle={
          <ReglasGrupo
            reglas={reglas}
            grupoSeleccionado={grupos.seleccionada}
          />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaGrupo emitir={emitir} />
      </QModal>
    </div>
  );
};
