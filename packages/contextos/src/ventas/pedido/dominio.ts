import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, Direccion, ProcesarContexto } from "@olula/lib/diseño.js";
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
    CambioClientePedido,
    ContextoMaestroPedido,
    ContextoPedido,
    EstadoMaestroPedido,
    EstadoPedido,
    LineaPedido,
    NuevaLineaPedido,
    NuevoPedido,
    Pedido
} from "./diseño.ts";
import {
    borrarPedido as borrarPedidoFuncion,
    deleteLinea,
    getLineas,
    getPedido,
    getPedidos,
    patchCambiarCliente,
    patchCantidadLinea,
    patchLinea,
    patchPedido,
    postLinea,
    postPedido
} from "./infraestructura.ts";

export const metaTablaPedido: MetaTabla<Pedido> = [
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

export const pedidoVacio = (): Pedido => ({
    ...ventaVacia,
    servido: 'No',
    lineas: [],
})

export const nuevoPedidoVacio: NuevoPedido = nuevaVentaVacia;

export const cambioClientePedidoVacio: CambioClientePedido = cambioClienteVentaVacio;

export const nuevaLineaPedidoVacia: NuevaLineaPedido = nuevaLineaVentaVacia;

export const metaNuevoPedido: MetaModelo<NuevoPedido> = metaNuevaVenta;

export const metaCambioClientePedido: MetaModelo<CambioClientePedido> = metaCambioClienteVenta;

export const metaPedido: MetaModelo<Pedido> = {
    campos: {
        ...metaVenta.campos,
        fecha: { tipo: "fecha", requerido: false },
    },
    editable: (pedido: Pedido, _?: string) => {
        return pedido.servido === 'No';
    },
};

export const editable = modeloEsEditable<Pedido>(metaPedido);
export const pedidoValido = modeloEsValido<Pedido>(metaPedido);

export const metaLineaPedido: MetaModelo<LineaPedido> = metaLineaVenta;

export const metaNuevaLineaPedido: MetaModelo<NuevaLineaPedido> = metaNuevaLineaVenta;

type ProcesarPedido = ProcesarContexto<EstadoPedido, ContextoPedido>;
type ProcesarPedidos = ProcesarContexto<EstadoMaestroPedido, ContextoMaestroPedido>;

const pipePedido = ejecutarListaProcesos<EstadoPedido, ContextoPedido>;

const pedidoVacioObjeto: Pedido = pedidoVacio();

export const pedidoVacioContexto = (): Pedido => ({ ...pedidoVacioObjeto });

const cargarPedido: (_: string) => ProcesarPedido = (idPedido) =>
    async (contexto) => {
        const pedido = await getPedido(idPedido);
        return {
            ...contexto,
            pedido,
        }
    }

export const refrescarPedido: ProcesarPedido = async (contexto) => {
    const pedido = await getPedido(contexto.pedido.id);
    return [
        {
            ...contexto,
            pedido: {
                ...contexto.pedido,
                ...pedido
            },
        },
        [["pedido_cambiado", pedido]]
    ]
}

export const cancelarCambioPedido: ProcesarPedido = async (contexto) => {
    return {
        ...contexto,
        pedido: contexto.pedidoInicial
    }
}

export const abiertoOServido: ProcesarPedido = async (contexto) => {
    return {
        ...contexto,
        estado: contexto.pedido.servido === 'Si' ? "SERVIDO" : "ABIERTO"
    }
}

export const refrescarLineas: ProcesarPedido = async (contexto) => {
    const lineas = await getLineas(contexto.pedido.id);
    return {
        ...contexto,
        pedido: {
            ...contexto.pedido,
            lineas: lineas as LineaPedido[]
        }
    }
}

export const activarLinea: ProcesarPedido = async (contexto, payload) => {
    const lineaActiva = payload as LineaPedido;
    return {
        ...contexto,
        lineaActiva
    }
}

const activarLineaPorIndice = (indice: number) => async (contexto: ContextoPedido) => {
    const lineas = contexto.pedido.lineas as LineaPedido[];
    const lineaActiva = lineas.length > 0
        ? indice >= 0 && indice < lineas.length
            ? lineas[indice]
            : lineas[lineas.length - 1]
        : null

    return {
        ...contexto,
        lineaActiva
    }
}

const activarLineaPorId = (id: string) => async (contexto: ContextoPedido) => {
    const lineas = contexto.pedido.lineas as LineaPedido[];
    const lineaActiva = lineas.find((l: LineaPedido) => l.id === id) ?? null;

    return {
        ...contexto,
        lineaActiva
    }
}

export const getContextoVacio: ProcesarPedido = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL',
        pedido: pedidoVacioContexto(),
        lineaActiva: null
    }
}

export const cargarContexto: ProcesarPedido = async (contexto, payload) => {
    const idPedido = payload as string;
    if (idPedido) {
        return pipePedido(
            contexto,
            [
                cargarPedido(idPedido),
                refrescarLineas,
                abiertoOServido,
                activarLineaPorIndice(0),
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}

export const cambiarPedido: ProcesarPedido = async (contexto, payload) => {
    const pedido = payload as Pedido;
    await patchPedido(contexto.pedido.id, pedido);

    return pipePedido(contexto, [
        refrescarPedido,
        'ABIERTO',
    ]);
}

export const borrarPedido: ProcesarPedido = async (contexto) => {
    await borrarPedidoFuncion(contexto.pedido.id);

    return pipePedido(contexto, [
        getContextoVacio,
        publicar('pedido_borrado', null)
    ]);
}

export const cambiarCliente: ProcesarPedido = async (contexto, payload) => {
    const cambio = payload as CambioClientePedido;
    await patchCambiarCliente(contexto.pedido.id, cambio);

    return pipePedido(contexto, [
        refrescarPedido,
        'ABIERTO',
    ]);
}

export const crearLinea: ProcesarPedido = async (contexto, payload) => {
    const nuevaLinea = payload as NuevaLineaPedido;
    const idLinea = await postLinea(contexto.pedido.id, nuevaLinea);

    return pipePedido(contexto, [
        refrescarPedido,
        refrescarLineas,
        activarLineaPorId(idLinea),
        'ABIERTO',
    ]);
}

export const cambiarLinea: ProcesarPedido = async (contexto, payload) => {
    const linea = payload as LineaPedido;
    await patchLinea(contexto.pedido.id, linea);

    return pipePedido(contexto, [
        refrescarPedido,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const cambiarCantidadLinea: ProcesarPedido = async (contexto, payload) => {
    const { lineaId, cantidad } = payload as { lineaId: string, cantidad: number };

    const linea = (contexto.pedido.lineas as LineaPedido[]).find((l: LineaPedido) => l.id === lineaId);
    if (!linea) return contexto;

    await patchCantidadLinea(contexto.pedido.id, linea, cantidad);

    const lineasActualizadas = await getLineas(contexto.pedido.id);
    const pedidoActualizado = await getPedido(contexto.pedido.id);

    return {
        estado: "ABIERTO" as EstadoPedido,
        pedido: {
            ...pedidoActualizado,
            lineas: lineasActualizadas
        },
        pedidoInicial: contexto.pedidoInicial,
        lineaActiva: lineasActualizadas.find(l => l.id === lineaId) || null,
    };
}

export const borrarLinea: ProcesarPedido = async (contexto, payload) => {
    const idLinea = payload as string;
    await deleteLinea(contexto.pedido.id, idLinea);

    const indiceLineaActiva = (contexto.pedido.lineas as LineaPedido[]).findIndex((l: LineaPedido) => l.id === idLinea);

    return pipePedido(contexto, [
        refrescarPedido,
        refrescarLineas,
        activarLineaPorIndice(indiceLineaActiva),
        'ABIERTO',
    ]);
}

// Funciones para el maestro (maquinaMaestroPedido)

export const cambiarPedidoEnLista: ProcesarPedidos = async (contexto, payload) => {
    const pedido = payload as Pedido;
    return {
        ...contexto,
        pedidos: contexto.pedidos.map(p => p.id === pedido.id ? pedido : p)
    }
}

export const activarPedido: ProcesarPedidos = async (contexto, payload) => {
    const pedidoActivo = payload as Pedido;
    return {
        ...contexto,
        pedidoActivo
    }
}

export const desactivarPedidoActivo: ProcesarPedidos = async (contexto) => {
    return {
        ...contexto,
        pedidoActivo: null
    }
}

export const quitarPedidoDeLista: ProcesarPedidos = async (contexto, payload) => {
    const pedidoBorrado = payload as Pedido;
    return {
        ...contexto,
        pedidos: contexto.pedidos.filter(p => p.id !== pedidoBorrado.id),
        pedidoActivo: null
    }
}

export const recargarPedidos: ProcesarPedidos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidos(criteria.filtros, criteria.orden, criteria.paginacion);
    const pedidosCargados = resultado.datos;

    return {
        ...contexto,
        pedidos: pedidosCargados,
        totalPedidos: resultado.total == -1 ? contexto.totalPedidos : resultado.total,
        pedidoActivo: contexto.pedidoActivo
            ? pedidosCargados.find(p => p.id === contexto.pedidoActivo?.id) ?? null
            : null
    }
}

export const incluirPedidoEnLista: ProcesarPedidos = async (contexto, payload) => {
    const pedido = payload as Pedido;
    return {
        ...contexto,
        pedidos: [pedido, ...contexto.pedidos]
    }
}

export const abrirModalCreacion: ProcesarPedidos = async (contexto) => {
    return {
        ...contexto,
        estado: 'CREANDO_PEDIDO'
    }
}

export const cerrarModalCreacion: ProcesarPedidos = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL'
    }
}

export const crearPedido: ProcesarPedidos = async (contexto, payload) => {
    const pedidoNuevo = payload as NuevoPedido;
    const idPedido = await postPedido(pedidoNuevo);
    const pedido = await getPedido(idPedido);
    return {
        ...contexto,
        pedidos: [pedido, ...contexto.pedidos],
        pedidoActivo: pedido
    }
}

export const direccionVacia = (): Direccion => ({
    nombre_via: "",
    tipo_via: "",
    numero: "",
    otros: "",
    cod_postal: "",
    ciudad: "",
    provincia_id: 0,
    provincia: "",
    pais_id: "",
    apartado: "",
    telefono: "",
});

export const nuevoClienteRegistradoVacio: NuevoPedido = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
} as NuevoPedido;

export const cambioClienteVacio = (): CambioClientePedido => ({
    cliente_id: "",
    direccion_id: "",
});

export const cambioCliente = (pedido: Pedido): CambioClientePedido => ({
    cliente_id: pedido.cliente_id,
    direccion_id: pedido.direccion_id,
});


