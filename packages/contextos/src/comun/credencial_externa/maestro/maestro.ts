import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { CategoriaCredencialExterna, CredencialExterna } from "../diseño.js";
import { getCredencialExterna, getCredencialesExterna } from "../infraestructura.js";
import { ContextoMaestroCredencialExterna, EstadoMaestroCredencialExterna } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroCredencialExterna, ContextoMaestroCredencialExterna>;

const conCredenciales = (fn: ProcesarListaActivaEntidades<CredencialExterna>) =>
    (ctx: ContextoMaestroCredencialExterna) => ({ ...ctx, credenciales: fn(ctx.credenciales) });

export const Credenciales = accionesListaActivaEntidades(conCredenciales);

export const recargarCredenciales: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getCredencialesExterna(criteria);
    return Credenciales.recargar(contexto, resultado);
};

export const ampliarCredenciales: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getCredencialesExterna(criteria);
    return Credenciales.ampliar(contexto, resultado);
};

export const iniciarCreacion: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    estado: "CREANDO",
    categoriaCreando: payload as CategoriaCredencialExterna,
});

export const incluirCredencialCreadaPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const credencial = await getCredencialExterna(id);
    return {
        ...contexto,
        estado: "INICIAL",
        credenciales: {
            ...contexto.credenciales,
            lista: [credencial, ...contexto.credenciales.lista],
            total: contexto.credenciales.total + 1,
            activo: credencial.id,
        },
    };
};
