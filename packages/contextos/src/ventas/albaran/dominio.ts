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
    Albaran,
    CambioClienteAlbaran,
    ContextoAlbaran,
    ContextoMaestroAlbaran,
    EstadoAlbaran,
    EstadoMaestroAlbaran,
    LineaAlbaran,
    NuevaLineaAlbaran,
    NuevoAlbaran,
} from "./diseño.ts";
import {
    borrarAlbaran as borrarAlbaranFuncion,
    deleteLinea,
    getAlbaran,
    getAlbaranes,
    getLineas,
    patchAlbaran,
    patchCambiarCliente,
    patchCantidadLinea,
    patchLinea,
    postAlbaran,
    postLinea
} from "./infraestructura.ts";

export const metaTablaAlbaran: MetaTabla<Albaran> = [
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

export const albaranVacio = (): Albaran => ({
    ...ventaVacia,
    idfactura: null,
    lineas: [],
});

export const nuevoAlbaranVacio: NuevoAlbaran = nuevaVentaVacia;

export const cambioClienteAlbaranVacio: CambioClienteAlbaran = cambioClienteVentaVacio;

export const nuevaLineaAlbaranVacia: NuevaLineaAlbaran = nuevaLineaVentaVacia;

export const metaNuevoAlbaran: MetaModelo<NuevoAlbaran> = metaNuevaVenta;

export const metaCambioClienteAlbaran: MetaModelo<CambioClienteAlbaran> = metaCambioClienteVenta;

export const metaAlbaran: MetaModelo<Albaran> = {
    campos: {
        ...metaVenta.campos,
        fecha: { tipo: "fecha", requerido: false },
    },
    editable: (albaran: Albaran, _?: string) => {
        return !albaran.idfactura;
    },
};

export const editable = modeloEsEditable<Albaran>(metaAlbaran);
export const albaranValido = modeloEsValido<Albaran>(metaAlbaran);

export const metaLineaAlbaran: MetaModelo<LineaAlbaran> = metaLineaVenta;

export const metaNuevaLineaAlbaran: MetaModelo<NuevaLineaAlbaran> = metaNuevaLineaVenta;

type ProcesarAlbaran = ProcesarContexto<EstadoAlbaran, ContextoAlbaran>;
type ProcesarAlbaranes = ProcesarContexto<EstadoMaestroAlbaran, ContextoMaestroAlbaran>;

const pipeAlbaran = ejecutarListaProcesos<EstadoAlbaran, ContextoAlbaran>;

const albaranVacioObjeto: Albaran = albaranVacio();

export const albaranVacioContexto = (): Albaran => ({ ...albaranVacioObjeto });

const cargarAlbaran: (_: string) => ProcesarAlbaran = (idAlbaran) =>
    async (contexto) => {
        const albaran = await getAlbaran(idAlbaran);
        return {
            ...contexto,
            albaran,
        }
    }

export const refrescarAlbaran: ProcesarAlbaran = async (contexto) => {
    const albaran = await getAlbaran(contexto.albaran.id);
    return [
        {
            ...contexto,
            albaran: {
                ...contexto.albaran,
                ...albaran
            },
        },
        [["albaran_cambiado", albaran]]
    ]
}

export const cancelarCambioAlbaran: ProcesarAlbaran = async (contexto) => {
    return {
        ...contexto,
        albaran: contexto.albaranInicial
    }
}

export const abiertoOFacturado: ProcesarAlbaran = async (contexto) => {
    const esFacturado = !!contexto.albaran.idfactura;
    return {
        ...contexto,
        estado: esFacturado ? "FACTURADO" : "ABIERTO"
    }
}

export const refrescarLineas: ProcesarAlbaran = async (contexto) => {
    const lineas = await getLineas(contexto.albaran.id);
    return {
        ...contexto,
        albaran: {
            ...contexto.albaran,
            lineas: lineas as LineaAlbaran[]
        }
    }
}

export const activarLinea: ProcesarAlbaran = async (contexto, payload) => {
    const lineaActiva = payload as LineaAlbaran;
    return {
        ...contexto,
        lineaActiva
    }
}

const activarLineaPorIndice = (indice: number) => async (contexto: ContextoAlbaran) => {
    const lineas = contexto.albaran.lineas as LineaAlbaran[];
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

const activarLineaPorId = (id: string) => async (contexto: ContextoAlbaran) => {
    const lineas = contexto.albaran.lineas as LineaAlbaran[];
    const lineaActiva = lineas.find((l: LineaAlbaran) => l.id === id) ?? null;

    return {
        ...contexto,
        lineaActiva
    }
}

export const getContextoVacio: ProcesarAlbaran = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL',
        albaran: albaranVacioContexto(),
        lineaActiva: null
    }
}

export const cargarContexto: ProcesarAlbaran = async (contexto, payload) => {
    const idAlbaran = payload as string;
    if (idAlbaran) {
        return pipeAlbaran(
            contexto,
            [
                cargarAlbaran(idAlbaran),
                refrescarLineas,
                abiertoOFacturado,
                activarLineaPorIndice(0),
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}

export const cambiarAlbaran: ProcesarAlbaran = async (contexto, payload) => {
    const albaran = payload as Albaran;
    await patchAlbaran(contexto.albaran.id, albaran);

    return pipeAlbaran(contexto, [
        refrescarAlbaran,
        'ABIERTO',
    ]);
}

export const borrarAlbaran: ProcesarAlbaran = async (contexto) => {
    await borrarAlbaranFuncion(contexto.albaran.id);

    return pipeAlbaran(contexto, [
        getContextoVacio,
        publicar('albaran_borrado', null)
    ]);
}

export const cambiarCliente: ProcesarAlbaran = async (contexto, payload) => {
    const cambio = payload as CambioClienteAlbaran;
    await patchCambiarCliente(contexto.albaran.id, cambio);

    return pipeAlbaran(contexto, [
        refrescarAlbaran,
        'ABIERTO',
    ]);
}

export const crearLinea: ProcesarAlbaran = async (contexto, payload) => {
    const nuevaLinea = payload as NuevaLineaAlbaran;
    const idLinea = await postLinea(contexto.albaran.id, nuevaLinea);

    return pipeAlbaran(contexto, [
        refrescarAlbaran,
        refrescarLineas,
        activarLineaPorId(idLinea),
        'ABIERTO',
    ]);
}

export const cambiarLinea: ProcesarAlbaran = async (contexto, payload) => {
    const linea = payload as LineaAlbaran;
    await patchLinea(contexto.albaran.id, linea);

    return pipeAlbaran(contexto, [
        refrescarAlbaran,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const cambiarCantidadLinea: ProcesarAlbaran = async (contexto, payload) => {
    const { lineaId, cantidad } = payload as { lineaId: string, cantidad: number };

    const linea = (contexto.albaran.lineas as LineaAlbaran[]).find((l: LineaAlbaran) => l.id === lineaId);
    if (!linea) return contexto;

    await patchCantidadLinea(contexto.albaran.id, linea, cantidad);

    const lineasActualizadas = await getLineas(contexto.albaran.id);
    const albaranActualizado = await getAlbaran(contexto.albaran.id);

    return {
        estado: "ABIERTO" as EstadoAlbaran,
        albaran: {
            ...albaranActualizado,
            lineas: lineasActualizadas
        },
        albaranInicial: contexto.albaranInicial,
        lineaActiva: lineasActualizadas.find(l => l.id === lineaId) || null,
    };
}

export const borrarLinea: ProcesarAlbaran = async (contexto, payload) => {
    const idLinea = payload as string;
    await deleteLinea(contexto.albaran.id, idLinea);

    const indiceLineaActiva = (contexto.albaran.lineas as LineaAlbaran[]).findIndex((l: LineaAlbaran) => l.id === idLinea);

    return pipeAlbaran(contexto, [
        refrescarAlbaran,
        refrescarLineas,
        activarLineaPorIndice(indiceLineaActiva),
        'ABIERTO',
    ]);
}

// Funciones para el maestro (maquinaMaestroAlbaran)

export const cambiarAlbaranEnLista: ProcesarAlbaranes = async (contexto, payload) => {
    const albaran = payload as Albaran;
    return {
        ...contexto,
        albaranes: contexto.albaranes.map(a => a.id === albaran.id ? albaran : a)
    }
}

export const activarAlbaran: ProcesarAlbaranes = async (contexto, payload) => {
    const albaranActivo = payload as Albaran;
    return {
        ...contexto,
        albaranActivo
    }
}

export const desactivarAlbaranActivo: ProcesarAlbaranes = async (contexto) => {
    return {
        ...contexto,
        albaranActivo: null
    }
}

export const quitarAlbaranDeLista: ProcesarAlbaranes = async (contexto, payload) => {
    const albaranBorrado = payload as Albaran;
    return {
        ...contexto,
        albaranes: contexto.albaranes.filter(a => a.id !== albaranBorrado.id),
        albaranActivo: null
    }
}

export const recargarAlbaranes: ProcesarAlbaranes = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getAlbaranes(criteria.filtro, criteria.orden, criteria.paginacion);
    const albaranesCargados = resultado.datos;

    return {
        ...contexto,
        albaranes: albaranesCargados,
        totalAlbaranes: resultado.total == -1 ? contexto.totalAlbaranes : resultado.total,
        albaranActivo: contexto.albaranActivo
            ? albaranesCargados.find(a => a.id === contexto.albaranActivo?.id) ?? null
            : null
    }
}

export const incluirAlbaranEnLista: ProcesarAlbaranes = async (contexto, payload) => {
    const albaran = payload as Albaran;
    return {
        ...contexto,
        albaranes: [albaran, ...contexto.albaranes]
    }
}

export const abrirModalCreacion: ProcesarAlbaranes = async (contexto) => {
    return {
        ...contexto,
        estado: 'CREANDO_ALBARAN'
    }
}

export const cerrarModalCreacion: ProcesarAlbaranes = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL'
    }
}

export const crearAlbaran: ProcesarAlbaranes = async (contexto, payload) => {
    const albaranNuevo = payload as NuevoAlbaran;
    const idAlbaran = await postAlbaran(albaranNuevo);
    const albaran = await getAlbaran(idAlbaran);
    return {
        ...contexto,
        albaranes: [albaran, ...contexto.albaranes],
        albaranActivo: albaran
    }
}