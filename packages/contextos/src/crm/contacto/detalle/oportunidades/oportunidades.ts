import { OportunidadVenta } from "#/crm/oportunidadventa/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { getOportunidadesVentaContacto } from "../../infraestructura.ts";
import { ContextoOportunidadesContacto, EstadoOportunidadesContacto } from "./diseño.ts";

export const metaTablaOportunidades: MetaTabla<OportunidadVenta> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "nombre_cliente", cabecera: "Cliente" },
    { id: "importe", cabecera: "Total", tipo: "moneda" },
    { id: "fecha_cierre", cabecera: "Fecha Cierre", tipo: "fecha" },
];

type ProcesarOportunidades = ProcesarContexto<EstadoOportunidadesContacto, ContextoOportunidadesContacto>;

const conOportunidades = (fn: ProcesarListaEntidades<OportunidadVenta>) => (ctx: ContextoOportunidadesContacto) => ({ ...ctx, oportunidades: fn(ctx.oportunidades) });

export const Oportunidades = accionesListaEntidades(conOportunidades);

export const recargarOportunidades: ProcesarOportunidades = async (contexto, payload) => {
    const contactoId = payload as string;
    const resultado = await getOportunidadesVentaContacto(contactoId);

    return Oportunidades.recargar(contexto, resultado);
}