import { MetaTabla } from "@olula/componentes/index.js";
import { ListaSeleccionable } from "@olula/lib/diseño.js";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { cambiarItem, cargar, listaSeleccionableVacia, quitarItem, seleccionarItem } from "@olula/lib/entidad.js";
import { pipe } from "@olula/lib/funcional.js";
import { ConfigMaquina4, Maquina3 } from "@olula/lib/useMaquina.js";
import { Factura } from "../factura/diseño.ts";
import {
    cambioClienteVentaVacio,
    metaCambioClienteVenta,
    metaLineaVenta,
    metaNuevaLineaVenta,
    metaNuevoPagoEfecctivo,
    metaVenta,
    nuevaLineaVentaVacia,
    ventaVacia
} from "../venta/dominio.ts";
import {
    CambioClienteFactura,
    LineaFactura as Linea,
    LineaFactura,
    // NuevaFactura,
    NuevaLineaFactura,
    NuevoPagoEfectivo,
    VentaTpv
} from "./diseño.ts";

export const ventaTpvVacia: VentaTpv = {
    ...ventaVacia,
    pagado: 0,
    pendiente: 0,
};

export const nuevoPagoEfectivoVacio: NuevoPagoEfectivo = {
    importe: 0
}

// export const nuevaFacturaVacia: NuevaFactura = nuevaVentaVacia;

export const cambioClienteFacturaVacio: CambioClienteFactura = cambioClienteVentaVacio;

export const nuevaLineaFacturaVacia: NuevaLineaFactura = nuevaLineaVentaVacia;

// export const metaNuevaFactura: MetaModelo<NuevaFactura> = metaNuevaVenta;

export const metaCambioClienteFactura: MetaModelo<CambioClienteFactura> = metaCambioClienteVenta;

export const metaVentaTpv: MetaModelo<VentaTpv> = {
    campos: {
        fecha: { tipo: "fecha", requerido: false },
        ...metaVenta.campos,
    },
};

export const metaLineaFactura: MetaModelo<LineaFactura> = metaLineaVenta;

export const metaNuevaLineaFactura: MetaModelo<NuevaLineaFactura> = metaNuevaLineaVenta;

export const metaNuevoPagoEfectivo: MetaModelo<NuevoPagoEfectivo> = metaNuevoPagoEfecctivo;


export const metaTablaFactura: MetaTabla<Factura> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

export type Estado = "Inactivo" | "Creando" | "Editando" | "ConfirmandoBorrado";
export type Contexto = {
    lineas: ListaSeleccionable<Linea>;
};

const setLineas =
    (
        aplicable: (lineas: ListaSeleccionable<Linea>) => ListaSeleccionable<Linea>
    ) =>
        (maquina: Maquina3<Estado, Contexto>) => ({
            ...maquina,
            contexto: {
                ...maquina.contexto,
                lineas: aplicable(maquina.contexto.lineas),
            },
        });

export const configMaquina: ConfigMaquina4<Estado, Contexto> = {
    inicial: {
        estado: "Inactivo",
        contexto: {
            lineas: listaSeleccionableVacia<Linea>(),
        },
    },
    estados: {

        Inactivo: {

            crear: "Creando",

            linea_seleccionada: ({ maquina, payload }) =>
                pipe(maquina, setLineas(seleccionarItem(payload as Linea))),

            linea_cambiada: ({ maquina, payload }) =>
                pipe(maquina, setLineas(cambiarItem(payload as Linea))),

            linea_borrada: ({ maquina }) => {
                const { lineas } = maquina.contexto;
                if (!lineas.idActivo) {
                    return maquina;
                }
                return pipe(maquina, setLineas(quitarItem(lineas.idActivo)));
            },

            lineas_cargadas: ({ maquina, payload, setEstado }) =>
                pipe(
                    maquina,
                    setEstado("Inactivo" as Estado),
                    setLineas(cargar(payload as Linea[]))
                ),

            seleccion_cancelada: ({ maquina }) =>
                pipe(
                    maquina,
                    setLineas((lineas) => ({
                        ...lineas,
                        idActivo: null,
                    }))
                ),

            editar: "Editando",

            borrar: "ConfirmandoBorrado",
        },

        Creando: {

            linea_creada: "Inactivo",

            creacion_cancelada: "Inactivo",
        },

        Editando: {

            edicion_confirmada: "Inactivo",

            edicion_cancelada: "Inactivo",
        },

        ConfirmandoBorrado: {

            borrado_confirmado: "Inactivo",

            borrado_cancelado: "Inactivo",
        },
    },
};