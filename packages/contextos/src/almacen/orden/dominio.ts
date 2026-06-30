import { MetaModelo } from "@olula/lib/dominio.ts";
import { ItemOrdenAlmacen, LineaOrdenAlmacen, OrdenAlmacen } from "./diseño.ts";

export const ERR_SKU_REQUERIDO = "El SKU es requerido";
export const ERR_CANTIDAD_PREVISTA_REQUERIDA = "La cantidad prevista es requerida";

// export const ordenVacia = (): OrdenAlmacen => ({
//     id: "",
//     fecha: fechaActual(),
//     tipoOrden: "",
//     almacenId: "",
//     abierta: true,
//     ubicacionOrigenId: null,
//     cajaOrigenId: null,
//     ubicacionDestinoId: null,
//     cajaDestinoId: null,
//     lineas: [],
// });

// Constante estable para usar como modeloInicial en useModelo.
// No llama a fechaActual() en cada render, evitando el bucle infinito de re-renders.
export const ordenVaciaInicial: OrdenAlmacen = {
    id: "",
    fecha: "",
    tipoOrden: "ENTRADA",
    almacenId: "",
    almacen: "",
    abierta: true,
    ubicacionOrigenId: null,
    cajaOrigenId: null,
    ubicacionDestinoId: null,
    cajaDestinoId: null,
    lineas: [],
};

// export const lineaOrdenVacia = (): LineaOrdenAlmacen => ({
//     sku: "",
//     loteId: null,
//     cantidadPrevista: 0,
//     ubicacionOrigenId: null,
//     cajaOrigenId: null,
//     ubicacionDestinoId: null,
//     cajaDestinoId: null,
// });

// export const nuevaLineaOrdenVacia = (): NuevaLineaOrdenAlmacen => lineaOrdenVacia();

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
        abierta: { tipo: "checkbox", requerido: true },
        cajaOrigenId: {},
        ubicacionOrigenId: {},
        cajaDestinoId: {},
        ubicacionDestinoId: {},
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
