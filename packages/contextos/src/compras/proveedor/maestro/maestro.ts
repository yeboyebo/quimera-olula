import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Proveedor } from "../diseño.ts";
import { getProveedor, getProveedores } from "../infraestructura.ts";
import { ContextoMaestroProveedor, EstadoMaestroProveedor } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroProveedor, ContextoMaestroProveedor>;

const conProveedores = (fn: ProcesarListaActivaEntidades<Proveedor>) =>
    (ctx: ContextoMaestroProveedor) => ({ ...ctx, proveedores: fn(ctx.proveedores) });

export const Proveedores = accionesListaActivaEntidades(conProveedores);

export const recargarProveedores: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getProveedores(criteria);
    return Proveedores.recargar(contexto, resultado);
};

export const ampliarProveedores: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getProveedores(criteria);
    return Proveedores.ampliar(contexto, resultado);
};

export const incluirProveedorCreadoPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const proveedor = await getProveedor(id);
    return {
        ...contexto,
        estado: "INICIAL",
        proveedores: {
            ...contexto.proveedores,
            lista: [proveedor, ...contexto.proveedores.lista],
            total: contexto.proveedores.total + 1,
            activo: proveedor.id,
        },
    };
};
