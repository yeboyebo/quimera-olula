import { Accion } from "#/crm/accion/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { getAccionesContacto } from "../../infraestructura.ts";
import { ContextoAccionesContacto, EstadoAccionesContacto } from "./diseño.ts";

export const metaTablaAccion: MetaTabla<Accion> = [
    { id: "id", cabecera: "Código" },
    { id: "fecha", cabecera: "Fecha", tipo: "fecha" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado", cabecera: "Estado" },
];

type ProcesarAcciones = ProcesarContexto<EstadoAccionesContacto, ContextoAccionesContacto>;

const conAcciones = (fn: ProcesarListaEntidades<Accion>) => (ctx: ContextoAccionesContacto) => ({ ...ctx, acciones: fn(ctx.acciones) });

export const Acciones = accionesListaEntidades(conAcciones);

export const recargarAcciones: ProcesarAcciones = async (contexto, payload) => {
    const contactoId = payload as string;
    const resultado = await getAccionesContacto(contactoId);

    return Acciones.recargar(contexto, resultado);
}