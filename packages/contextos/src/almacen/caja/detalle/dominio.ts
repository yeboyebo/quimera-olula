import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo, publicar, stringNoVacio } from "@olula/lib/dominio.ts";
import { Caja, CajaContenido, ComponenteCaja, MovimientoCaja } from "../diseño.ts";
import { getCaja, patchCaja } from "../infraestructura.ts";
import { ContextoCaja, EstadoCaja } from "./diseño.ts";

export const cajaContenidoVacia: CajaContenido = {
    id: "",
    ubicacionId: "",
    contenido: [],
};

export const metaCaja: MetaModelo<Caja> = {
    campos: {
        ubicacionId: {
            requerido: true,
            validacion: (m: Caja) => stringNoVacio(m.ubicacionId),
        },
    },
};

export const esMaterial = (comp: ComponenteCaja): comp is MovimientoCaja =>
    "sku" in comp;

export const esSubcaja = (comp: ComponenteCaja): comp is CajaContenido =>
    "contenido" in comp;

type ProcesarCaja = ProcesarContexto<EstadoCaja, ContextoCaja>;
const pipeCaja = ejecutarListaProcesos<EstadoCaja, ContextoCaja>;

const cajaContenidoVaciaContexto = (): CajaContenido => ({ ...cajaContenidoVacia });

const cargarCaja = (idCaja: string): ProcesarCaja => async (contexto) => {
    const caja = await getCaja(idCaja);
    return {
        ...contexto,
        caja,
        cajaInicial: caja,
    };
};

export const abiertoContexto: ProcesarCaja = async (contexto) => ({
    ...contexto,
    estado: "ABIERTO",
});

export const getContextoVacio: ProcesarCaja = async (contexto) => ({
    ...contexto,
    estado: "INICIAL",
    caja: cajaContenidoVaciaContexto(),
    cajaInicial: cajaContenidoVaciaContexto(),
});

export const cargarContexto: ProcesarCaja = async (contexto, payload) => {
    const idCaja = payload as string;
    if (!idCaja) {
        return getContextoVacio(contexto);
    }

    return pipeCaja(contexto, [cargarCaja(idCaja), abiertoContexto], payload);
};

export const refrescarCaja: ProcesarCaja = async (contexto) => {
    const caja = await getCaja(contexto.caja.id);
    return [
        {
            ...contexto,
            caja: {
                ...contexto.caja,
                ...caja,
            },
        },
        [["caja_cambiada", caja]],
    ];
};

export const cambiarCaja: ProcesarCaja = async (contexto, payload) => {
    const caja = payload as Caja;
    await patchCaja(contexto.caja.id, caja);

    return pipeCaja(contexto, [refrescarCaja, "ABIERTO"]);
};

export const cancelarCambioCaja: ProcesarCaja = async (contexto) => ({
    ...contexto,
    caja: contexto.cajaInicial,
});

export const borrarCajaContexto: ProcesarCaja = async (contexto, payload) => {
    const { cajaId } = (payload as { cajaId: string }) ?? { cajaId: contexto.caja.id };

    return pipeCaja(contexto, [
        getContextoVacio,
        publicar("caja_borrada", cajaId),
    ]);
};
