import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { fechaActual } from "@olula/lib/fecha.ts";
import { ItemOrdenAlmacen, LineaOrdenAlmacen, NuevaLineaOrdenAlmacen, NuevaOrdenAlmacen, OrdenAlmacen } from "./diseño.ts";

export const ERR_SKU_REQUERIDO = "El SKU es requerido";
export const ERR_CANTIDAD_PREVISTA_REQUERIDA = "La cantidad prevista es requerida";

export const ordenVacia = (): OrdenAlmacen => ({
    id: "",
    fecha: fechaActual(),
    tipoOrden: "",
    almacenId: "",
    abierta: true,
    ubicacionOrigenId: null,
    cajaOrigenId: null,
    ubicacionDestinoId: null,
    cajaDestinoId: null,
    lineas: [],
});

export const lineaOrdenVacia = (): LineaOrdenAlmacen => ({
    sku: "",
    loteId: null,
    cantidadPrevista: 0,
    ubicacionOrigenId: null,
    cajaOrigenId: null,
    ubicacionDestinoId: null,
    cajaDestinoId: null,
});

export const nuevaLineaOrdenVacia = (): NuevaLineaOrdenAlmacen => lineaOrdenVacia();

export const itemOrdenAlmacenVacio = (): ItemOrdenAlmacen => ({
    id: "",
    fecha: "",
    tipo: "",
    abierta: false,
    estado: "",
    ubicacionOrigenId: null,
    cajaOrigenId: null,
    ubicacionDestinoId: null,
    cajaDestinoId: null,
});

export const metaOrden: MetaModelo<OrdenAlmacen> = {
    campos: {
        tipoOrden: { requerido: true },
        almacenId: { requerido: true },
        fecha: { requerido: true },
    },
};

export const nuevaOrdenVacia: NuevaOrdenAlmacen = {
    fecha: fechaActual(),
    tipoOrden: "",
    almacenId: "",
    abierta: true,
    ubicacionOrigenId: null,
    cajaOrigenId: null,
    ubicacionDestinoId: null,
    cajaDestinoId: null,
};

export const metaNuevaOrden: MetaModelo<NuevaOrdenAlmacen> = {
    campos: {
        tipoOrden: {
            requerido: true,
            validacion: (m) => stringNoVacio(m.tipoOrden),
        },
        almacenId: {
            requerido: true,
            validacion: (m) => stringNoVacio(m.almacenId),
        },
        fecha: {
            requerido: true,
            validacion: (m) => stringNoVacio(m.fecha),
        },
    },
};

export const metaNuevaLinea: MetaModelo<LineaOrdenAlmacen> = {
    campos: {
        sku: {
            validacion: (linea) => {
                if (linea.sku === null || linea.sku === undefined || linea.sku === "") {
                    return ERR_SKU_REQUERIDO;
                }
                return true;
            },
        },
        cantidadPrevista: {
            tipo: "numero",
            validacion: (linea) => {
                if (linea.cantidadPrevista === null || linea.cantidadPrevista === undefined) {
                    return ERR_CANTIDAD_PREVISTA_REQUERIDA;
                }
                return true;
            },
        },
    },
};
