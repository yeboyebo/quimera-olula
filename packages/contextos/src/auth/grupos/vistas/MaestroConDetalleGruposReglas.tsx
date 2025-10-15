import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useEffect, useState } from "react";
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

  const setListaReglas = reglas.setLista;

  useEffect(() => {
    getReglas().then(({ datos }) => setListaReglas(datos));
  }, [setListaReglas]);

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
      <MaestroDetalle
        seleccionada={grupos.seleccionada}
        preMaestro={
          <>
            <h2>Grupos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>
                Nuevo Grupo
              </QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        modoDisposicion="maestro-50"
        metaTabla={metaTablaGrupos}
        entidades={grupos.lista}
        setEntidades={grupos.setLista}
        setSeleccionada={grupos.seleccionar}
        cargar={getGrupos}
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
