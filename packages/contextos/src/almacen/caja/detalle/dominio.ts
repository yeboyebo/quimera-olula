import { MetaTabla } from "@olula/componentes/index.js";
import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo, publicar, stringNoVacio } from "@olula/lib/dominio.ts";
import { Caja, MovimientoCaja } from "../diseño.ts";
import { getCaja, patchCaja } from "../infraestructura.ts";
import { ContextoCaja, EstadoCaja } from "./diseño.ts";

export const cajaVacia: Caja = {
    id: "",
    codigo_almacen: "",
};

export const metaCaja: MetaModelo<Caja> = {
    campos: {
        codigo_almacen: {
            requerido: true,
            validacion: (m: Caja) => stringNoVacio(m.codigo_almacen),
        },
    },
};

export const metaTablaMovimientosCaja: MetaTabla<MovimientoCaja> = [
    { id: "sku", cabecera: "Referencia" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "cantidad", cabecera: "Cantidad", tipo: "numero" },
];

type ProcesarCaja = ProcesarContexto<EstadoCaja, ContextoCaja>;
const pipeCaja = ejecutarListaProcesos<EstadoCaja, ContextoCaja>;

const cajaVaciaContexto = (): Caja => ({ ...cajaVacia });

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
    caja: cajaVaciaContexto(),
    cajaInicial: cajaVaciaContexto(),
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
