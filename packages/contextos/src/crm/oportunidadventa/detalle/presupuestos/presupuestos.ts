import { Presupuesto } from "#/ventas/presupuesto/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { getPresupuestosOportunidad } from "../../infraestructura.ts";
import { ContextoPresupuestosOportunidad, EstadoPresupuestosOportunidad } from "./diseño.ts";

export const metaTablaPresupuesto: MetaTabla<Presupuesto> = [
    { id: "codigo", cabecera: "Código" },
    { id: "nombre_cliente", cabecera: "Cliente" },
    { id: "total", cabecera: "Total", tipo: "moneda" },
];

type ProcesarPresupuestos = ProcesarContexto<EstadoPresupuestosOportunidad, ContextoPresupuestosOportunidad>;

const conPresupuestos = (fn: ProcesarListaEntidades<Presupuesto>) => (ctx: ContextoPresupuestosOportunidad) => ({ ...ctx, presupuestos: fn(ctx.presupuestos) });

export const Presupuestos = accionesListaEntidades(conPresupuestos);

export const recargarPresupuestos: ProcesarPresupuestos = async (contexto, payload) => {
    const oportunidadId = payload as string;
    const resultado = await getPresupuestosOportunidad(oportunidadId);

    return Presupuestos.recargar(contexto, resultado);
}