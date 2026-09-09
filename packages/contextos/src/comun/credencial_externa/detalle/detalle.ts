import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos } from "@olula/lib/dominio.ts";
import { CredencialExterna } from "../diseño.js";
import { credencialExternaVacia } from "../dominio.js";
import { getCredencialExterna, patchCredencialExterna } from "../infraestructura.js";
import { ContextoDetalleCredencialExterna, EstadoDetalleCredencialExterna } from "./diseño.js";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleCredencialExterna, ContextoDetalleCredencialExterna>;

const pipeCredencial = ejecutarListaProcesos<EstadoDetalleCredencialExterna, ContextoDetalleCredencialExterna>;

export const contextoDetalleCredencialExternaInicial: ContextoDetalleCredencialExterna = {
    estado: 'INICIAL',
    credencial: credencialExternaVacia,
};

export const refrescarCredencialExterna: ProcesarDetalle = async (contexto) => {
    const credencial = await getCredencialExterna(contexto.credencial.id);
    return [
        { ...contexto, credencial },
        [["credencial_externa_cambiada", credencial]],
    ];
};

/**
 * Guarda cambios en la API (auto-guardado de useModelo). El secreto NUNCA
 * pasa por aquí: se rota aparte (ver rotar/RotarCredencialExterna.tsx).
 */
export const guardarCredencialExterna = async (
    contexto: ContextoDetalleCredencialExterna,
    credencial: CredencialExterna
): Promise<void> => {
    if (
        credencial.nombre !== contexto.credencial.nombre ||
        credencial.proveedor !== contexto.credencial.proveedor
    ) {
        await patchCredencialExterna(credencial.id, {
            nombre: credencial.nombre,
            proveedor: credencial.proveedor,
        });
    }
};

export const alternarActivoCredencialExterna: ProcesarDetalle = async (contexto) => {
    await patchCredencialExterna(contexto.credencial.id, { activo: !contexto.credencial.activo });
    const credencial = await getCredencialExterna(contexto.credencial.id);
    return [
        { ...contexto, credencial },
        [["credencial_externa_cambiada", credencial]],
    ];
};

export const cargarCredencialExterna: (_: string) => ProcesarDetalle =
    (idCredencial) => async (contexto) => {
        const credencial = await getCredencialExterna(idCredencial);
        return pipeCredencial(contexto, [
            async (ctx) => ({ ...ctx, credencial }),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idCredencial = payload as string;
    if (idCredencial) {
        return cargarCredencialExterna(idCredencial)(contexto);
    }
    return { ...contexto, estado: 'INICIAL', credencial: credencialExternaVacia };
};
