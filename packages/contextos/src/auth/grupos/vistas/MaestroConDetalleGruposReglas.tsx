import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { Criteria, Maquina, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
  accionesListaActivaEntidades,
  ListaActivaEntidades,
  listaActivaEntidadesInicial,
  ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { Grupo } from "../diseño.ts";
import { getGrupos } from "../infraestructura.ts";
import { AltaGrupo } from "./AltaGrupo.tsx";
import { ReglasGrupo } from "./ReglasGrupo/ReglasGrupo.tsx";

const metaTablaGrupos = [
  { id: "id", cabecera: "Grupo" },
  { id: "descripcion", cabecera: "Descripción" },
];

type Estado = "LISTA" | "ALTA";

type Contexto = {
  estado: Estado;
  grupos: ListaActivaEntidades<Grupo>;
};

type ProcesarGrupos = ProcesarContexto<Estado, Contexto>;

const conGrupos =
  (fn: ProcesarListaActivaEntidades<Grupo>) => (ctx: Contexto) => ({
    ...ctx,
    grupos: fn(ctx.grupos),
  });

const Grupos = accionesListaActivaEntidades(conGrupos);

const recargarGrupos: ProcesarGrupos = async (contexto, payload) => {
  const criteria = payload as Criteria;
  const resultado = await getGrupos(
    criteria.filtro,
    criteria.orden,
    criteria.paginacion
  );

  return Grupos.recargar(contexto, resultado);
};

const getMaquina: () => Maquina<Estado, Contexto> = () => ({
  LISTA: {
    grupo_seleccionado: [Grupos.activar],
    grupo_deseleccionado: Grupos.desactivar,
    recarga_de_grupos_solicitada: recargarGrupos,
    criteria_cambiado: [Grupos.filtrar, recargarGrupos],
    ALTA_INICIADA: "ALTA",
    GRUPO_CREADO: Grupos.incluir,
  },
  ALTA: {
    GRUPO_CREADO: [Grupos.incluir, "LISTA"],
    ALTA_CANCELADA: "LISTA",
  },
});

export const MaestroConDetalleGruposReglas = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "LISTA",
    grupos: listaActivaEntidadesInicial<Grupo>(id, criteria),
  });

  useUrlParams(ctx.grupos.activo, ctx.grupos.criteria);

  useEffect(() => {
    emitir("recarga_de_grupos_solicitada", ctx.grupos.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grupoSeleccionado =
    ctx.grupos.lista.find(
      (grupo) => String(grupo.id) === String(ctx.grupos.activo)
    ) ?? null;

  return (
    <div className="GruposReglas">
      <MaestroDetalle
        seleccionada={ctx.grupos.activo}
        Maestro={
          <>
            <h2>Grupos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>
                Nuevo Grupo
              </QBoton>
            </div>
            <Listado<Grupo>
              metaTabla={metaTablaGrupos}
              criteria={ctx.grupos.criteria}
              modo="tabla"
              entidades={ctx.grupos.lista}
              totalEntidades={ctx.grupos.total}
              seleccionada={ctx.grupos.activo}
              onSeleccion={(payload) => emitir("grupo_seleccionado", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        modoDisposicion="maestro-50"
        Detalle={<ReglasGrupo grupoSeleccionado={grupoSeleccionado} />}
      />

      <QModal
        nombre="modal"
        abierto={ctx.estado === "ALTA"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaGrupo emitir={emitir} />
      </QModal>
    </div>
  );
};
