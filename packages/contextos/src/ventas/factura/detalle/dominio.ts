import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, publicar } from "@olula/lib/dominio.ts";
import { Factura, LineaFactura } from "../diseño.ts";
import { facturaVacia } from "../dominio.ts";
import { borrarFactura as borrarFacturaFuncion, getFactura, getLineas } from "../infraestructura.ts";
import { ContextoFactura, EstadoFactura } from "./diseño.ts";

type ProcesarFactura = ProcesarContexto<EstadoFactura, ContextoFactura>;

const pipeFactura = ejecutarListaProcesos<EstadoFactura, ContextoFactura>;

const cargarFactura = (idFactura: string): ProcesarFactura =>
    async (contexto) => {
        const factura = await getFactura(idFactura);
        return {
            ...contexto,
            factura,
        };
    };

export const refrescarFactura: ProcesarFactura = async (contexto) => {
    const factura = await getFactura(contexto.factura.id);
    return [
        {
            ...contexto,
            factura: {
                ...contexto.factura,
                ...factura,
            },
        },
        [["factura_cambiada", factura]],
    ];
};

export const cancelarCambioFactura: ProcesarFactura = async (contexto) => {
    return {
        ...contexto,
        factura: contexto.facturaInicial,
    };
};

export const refrescarLineas: ProcesarFactura = async (contexto) => {
    const lineas = await getLineas(contexto.factura.id);
    return {
        ...contexto,
        factura: {
            ...contexto.factura,
            lineas: lineas as LineaFactura[],
        },
    };
};

const facturaVaciaObjeto: Factura = facturaVacia();

const facturaVaciaContexto = (): Factura => ({ ...facturaVaciaObjeto });

export const getContextoVacio: ProcesarFactura = async (contexto) => {
    return {
        ...contexto,
        estado: "INICIAL",
        factura: facturaVaciaContexto(),
    };
};

export const cargarContexto: ProcesarFactura = async (contexto, payload) => {
    const idFactura = payload as string;
    if (idFactura) {
        return pipeFactura(contexto, [
            cargarFactura(idFactura),
            refrescarLineas,
            "CONSULTANDO",
        ]);
    } else {
        return getContextoVacio(contexto);
    }
};

export const borrarFactura: ProcesarFactura = async (contexto) => {
    await borrarFacturaFuncion(contexto.factura.id);

    return pipeFactura(contexto, [getContextoVacio, publicar("factura_borrada", null)]);
};


