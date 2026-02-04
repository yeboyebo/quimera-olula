import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaEntidades, accionesListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Contacto } from "../diseño.ts";
import { getContactos } from "../infraestructura.ts";
import { ContextoMaestroContactos, EstadoMaestroContactos } from "./diseño.ts";

export const metaTablaContacto: MetaTabla<Contacto> = [
    { id: "id", cabecera: "Id" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "email", cabecera: "Email" },
    { id: "telefono1", cabecera: "Teléfono" },
];

type ProcesarContactos = ProcesarContexto<EstadoMaestroContactos, ContextoMaestroContactos>;

const conContactos = (fn: ProcesarListaEntidades<Contacto>) => (ctx: ContextoMaestroContactos) => ({ ...ctx, contactos: fn(ctx.contactos) });

export const Contactos = accionesListaEntidades(conContactos);

export const recargarContactos: ProcesarContactos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getContactos(criteria.filtro, criteria.orden, criteria.paginacion);

    return Contactos.recargar(contexto, resultado);
}