import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.js";
import { pipe } from "@olula/lib/funcional.js";
import { Contacto } from "../diseño.ts";
import { getContacto, patchContacto } from "../infraestructura.ts";
import { ContextoDetalleContacto, EstadoDetalleContacto } from "./diseño.ts";

export const contactoVacio: Contacto = {
    id: '',
    nombre: '',
    email: '',
    nif: '',
    telefono1: '',
};

export const metaContacto: MetaModelo<Contacto> = {
    campos: {
        nombre: { requerido: true },
        email: { requerido: true, tipo: "email" },
        nif: { requerido: false },
        telefono1: { requerido: false },
    }
};

type ProcesarContacto = ProcesarContexto<EstadoDetalleContacto, ContextoDetalleContacto>;

const pipeContacto = ejecutarListaProcesos<EstadoDetalleContacto, ContextoDetalleContacto>;

const conContacto = (contacto: Contacto) => (ctx: ContextoDetalleContacto) => ({ ...ctx, contacto });
const conEstado = (estado: EstadoDetalleContacto) => (ctx: ContextoDetalleContacto) => ({ ...ctx, estado });

const cargarContacto: (_: string) => ProcesarContacto = (id) =>
    async (contexto) => {
        const contacto = await getContacto(id);

        return pipe(
            contexto,
            conContacto(contacto)
        )
    }

export const refrescarContacto: ProcesarContacto = async (contexto) => {
    const contacto = await getContacto(contexto.contacto.id);

    return [
        pipe(
            contexto,
            conContacto({
                ...contexto.contacto,
                ...contacto
            })
        ),
        [["contacto_cambiado", contacto]]
    ]
}

export const cambiarContacto: ProcesarContacto = async (contexto, payload) => {
    const contacto = payload as Contacto;
    await patchContacto(contexto.contacto.id, contacto)

    return pipeContacto(contexto, [
        refrescarContacto,
        "INICIAL",
    ]);
}

export const getContextoVacio: ProcesarContacto = async (contexto) => {
    return pipe(
        contexto,
        conEstado("INICIAL"),
        conContacto(contactoVacio)
    )
}

export const cargarContexto: ProcesarContacto = async (contexto, payload) => {
    const id = payload as string;

    if (!id) return getContextoVacio(contexto);

    return pipeContacto(
        contexto,
        [cargarContacto(id)],
        payload
    );
}
