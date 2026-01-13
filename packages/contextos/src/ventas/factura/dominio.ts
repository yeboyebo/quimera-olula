import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, MetaModelo, modeloEsEditable, modeloEsValido, publicar } from "@olula/lib/dominio.ts";
import {
    cambioClienteVentaVacio,
    metaCambioClienteVenta,
    metaLineaVenta,
    metaNuevaLineaVenta,
    metaNuevaVenta,
    metaVenta,
    nuevaLineaVentaVacia,
    nuevaVentaVacia,
    ventaVacia
} from "../venta/dominio.ts";
import {
    CambioClienteFactura,
    ContextoFactura,
    ContextoMaestroFactura,
    EstadoFactura,
    EstadoMaestroFactura,
    Factura,
    LineaFactura,
    NuevaFactura,
    NuevaLineaFactura
} from "./diseño.ts";
import {
    borrarFactura as borrarFacturaFuncion,
    getFactura,
    getFacturas,
    getLineas
} from "./infraestructura.ts";

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

export const facturaVacia = (): Factura => ({
    ...ventaVacia,
    editable: false,
});

export const nuevaFacturaVacia: NuevaFactura = nuevaVentaVacia;

export const cambioClienteFacturaVacio: CambioClienteFactura = cambioClienteVentaVacio;

export const nuevaLineaFacturaVacia: NuevaLineaFactura = nuevaLineaVentaVacia;

export const metaNuevaFactura: MetaModelo<NuevaFactura> = metaNuevaVenta;

export const metaCambioClienteFactura: MetaModelo<CambioClienteFactura> = metaCambioClienteVenta;

export const metaFactura: MetaModelo<Factura> = {
    campos: {
        ...metaVenta.campos,
        fecha: { tipo: "fecha", requerido: false },
    },
    editable: (factura: Factura, _?: string) => {
        return factura.editable ?? false;
    },
};

export const editable = modeloEsEditable<Factura>(metaFactura);
export const facturaValida = modeloEsValido<Factura>(metaFactura);

export const metaLineaFactura: MetaModelo<LineaFactura> = metaLineaVenta;

export const metaNuevaLineaFactura: MetaModelo<NuevaLineaFactura> = metaNuevaLineaVenta;

type ProcesarFactura = ProcesarContexto<EstadoFactura, ContextoFactura>;
type ProcesarFacturas = ProcesarContexto<EstadoMaestroFactura, ContextoMaestroFactura>;

const pipeFactura = ejecutarListaProcesos<EstadoFactura, ContextoFactura>;

const facturaVaciaObjeto: Factura = facturaVacia();

export const facturaVaciaContexto = (): Factura => ({ ...facturaVaciaObjeto });

const cargarFactura: (_: string) => ProcesarFactura = (idFactura) =>
    async (contexto) => {
        const factura = await getFactura(idFactura);
        return {
            ...contexto,
            factura,
        }
    }

export const refrescarFactura: ProcesarFactura = async (contexto) => {
    const factura = await getFactura(contexto.factura.id);
    return [
        {
            ...contexto,
            factura: {
                ...contexto.factura,
                ...factura
            },
        },
        [["factura_cambiada", factura]]
    ]
}

export const cancelarCambioFactura: ProcesarFactura = async (contexto) => {
    return {
        ...contexto,
        factura: contexto.facturaInicial
    }
}

export const refrescarLineas: ProcesarFactura = async (contexto) => {
    const lineas = await getLineas(contexto.factura.id);
    return {
        ...contexto,
        factura: {
            ...contexto.factura,
            lineas: lineas as LineaFactura[]
        }
    }
}

export const getContextoVacio: ProcesarFactura = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL',
        factura: facturaVaciaContexto(),
    }
}

export const cargarContexto: ProcesarFactura = async (contexto, payload) => {
    const idFactura = payload as string;
    if (idFactura) {
        return pipeFactura(
            contexto,
            [
                cargarFactura(idFactura),
                refrescarLineas,
                'CONSULTANDO',
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}

export const borrarFactura: ProcesarFactura = async (contexto) => {
    await borrarFacturaFuncion(contexto.factura.id);

    return pipeFactura(contexto, [
        getContextoVacio,
        publicar('factura_borrada', null)
    ]);
}

// Funciones para el maestro (maquinaMaestroFactura)

export const cambiarFacturaEnLista: ProcesarFacturas = async (contexto, payload) => {
    const factura = payload as Factura;
    return {
        ...contexto,
        facturas: contexto.facturas.map(f => f.id === factura.id ? factura : f)
    }
}

export const activarFactura: ProcesarFacturas = async (contexto, payload) => {
    const facturaActiva = payload as Factura;
    return {
        ...contexto,
        facturaActiva
    }
}

export const desactivarFacturaActiva: ProcesarFacturas = async (contexto) => {
    return {
        ...contexto,
        facturaActiva: null
    }
}

export const quitarFacturaDeLista: ProcesarFacturas = async (contexto, payload) => {
    const facturaBorrada = payload as Factura;
    return {
        ...contexto,
        facturas: contexto.facturas.filter(f => f.id !== facturaBorrada.id),
        facturaActiva: null
    }
}

export const recargarFacturas: ProcesarFacturas = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getFacturas(criteria.filtro, criteria.orden, criteria.paginacion);
    const facturasCargadas = resultado.datos;

    return {
        ...contexto,
        facturas: facturasCargadas,
        totalFacturas: resultado.total == -1 ? contexto.totalFacturas : resultado.total,
        facturaActiva: contexto.facturaActiva
            ? facturasCargadas.find(f => f.id === contexto.facturaActiva?.id) ?? null
            : null
    }
}

export const incluirFacturaEnLista: ProcesarFacturas = async (contexto, payload) => {
    const factura = payload as Factura;
    return {
        ...contexto,
        facturas: [factura, ...contexto.facturas],
        estado: 'INICIAL'
    }
}

export const abrirModalCreacion: ProcesarFacturas = async (contexto) => {
    return {
        ...contexto,
        estado: 'CREANDO_FACTURA'
    }
}

export const cerrarModalCreacion: ProcesarFacturas = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL'
    }
}

