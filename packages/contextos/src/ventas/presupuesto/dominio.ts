import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { Criteria, Direccion, ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, MetaModelo, modeloEsEditable, publicar } from "@olula/lib/dominio.ts";
import { NuevaLineaVenta } from "../venta/diseño.ts";
import {
    CambioCliente,
    ContextoMaestroPresupuesto,
    ContextoPresupuesto,
    EstadoMaestroPresupuesto,
    EstadoPresupuesto,
    LineaPresupuesto,
    NuevaLinea,
    NuevoPresupuesto,
    NuevoPresupuestoClienteNoRegistrado,
    Presupuesto
} from "./diseño.ts";
import {
    aprobarPresupuesto as aprobarPresupuestoFuncion,
    borrarPresupuesto as borrarPresupuestoFuncion,
    deleteLinea,
    getLineas,
    getPresupuesto,
    getPresupuestos,
    patchCambiarCliente,
    patchCambiarDivisa,
    patchCantidadLinea,
    patchLinea,
    patchPresupuesto,
    postLinea,
    postPresupuesto
} from "./infraestructura.ts";

export const metaTablaPresupuesto: MetaTabla<Presupuesto> = [
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

export const presupuestoVacio = (): Presupuesto => ({
    id: '',
    codigo: '',
    fecha: '',
    fecha_salida: '',
    cliente_id: '',
    nombre_cliente: '',
    id_fiscal: '',
    direccion_id: '',
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
    agente_id: '',
    nombre_agente: '',
    divisa_id: '',
    tasa_conversion: 1,
    aprobado: false,
    total: 0,
    total_divisa_empresa: 0,
    neto: 0,
    total_iva: 0,
    total_irpf: 0,
    forma_pago_id: '',
    nombre_forma_pago: '',
    grupo_iva_negocio_id: '',
    observaciones: '',
    lineas: [],
})

type ProcesarPresupuesto = ProcesarContexto<EstadoPresupuesto, ContextoPresupuesto>;
type ProcesarPresupuestos = ProcesarContexto<EstadoMaestroPresupuesto, ContextoMaestroPresupuesto>;

const pipePresupuesto = ejecutarListaProcesos<EstadoPresupuesto, ContextoPresupuesto>;

const presupuestoVacioObjeto: Presupuesto = presupuestoVacio();

export const presupuestoVacioContexto = (): Presupuesto => ({ ...presupuestoVacioObjeto });

const cargarPresupuesto: (_: string) => ProcesarPresupuesto = (idPresupuesto) =>
    async (contexto) => {
        const presupuesto = await getPresupuesto(idPresupuesto);
        return {
            ...contexto,
            presupuesto,
        }
    }

export const refrescarPresupuesto: ProcesarPresupuesto = async (contexto) => {
    const presupuesto = await getPresupuesto(contexto.presupuesto.id);
    return [
        {
            ...contexto,
            presupuesto: {
                ...contexto.presupuesto,
                ...presupuesto
            },
        },
        [["presupuesto_cambiado", presupuesto]]
    ]
}

export const cancelarCambioPresupuesto: ProcesarPresupuesto = async (contexto) => {
    return {
        ...contexto,
        presupuesto: contexto.presupuestoInicial
    }
}

export const abiertoOAprobadoContexto: ProcesarPresupuesto = async (contexto) => {
    return {
        ...contexto,
        estado: contexto.presupuesto.aprobado ? "APROBADO" : "ABIERTO"
    }
}

export const refrescarLineas: ProcesarPresupuesto = async (contexto) => {
    const lineas = await getLineas(contexto.presupuesto.id);
    return {
        ...contexto,
        presupuesto: {
            ...contexto.presupuesto,
            lineas: lineas as LineaPresupuesto[]
        }
    }
}

export const activarLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const lineaActiva = payload as LineaPresupuesto;
    return {
        ...contexto,
        lineaActiva
    }
}

const activarLineaPorIndice = (indice: number) => async (contexto: ContextoPresupuesto) => {
    const lineas = contexto.presupuesto.lineas as LineaPresupuesto[];
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

const activarLineaPorId = (id: string) => async (contexto: ContextoPresupuesto) => {
    const lineas = contexto.presupuesto.lineas as LineaPresupuesto[];
    const lineaActiva = lineas.find((l: LineaPresupuesto) => l.id === id) ?? null;

    return {
        ...contexto,
        lineaActiva
    }
}

export const getContextoVacio: ProcesarPresupuesto = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL',
        presupuesto: presupuestoVacioContexto(),
        lineaActiva: null
    }
}

export const cargarContexto: ProcesarPresupuesto = async (contexto, payload) => {
    const idPresupuesto = payload as string;
    if (idPresupuesto) {
        return pipePresupuesto(
            contexto,
            [
                cargarPresupuesto(idPresupuesto),
                refrescarLineas,
                abiertoOAprobadoContexto,
                activarLineaPorIndice(0),
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}

export const cambiarPresupuesto: ProcesarPresupuesto = async (contexto, payload) => {
    const presupuesto = payload as Presupuesto;
    await patchPresupuesto(contexto.presupuesto.id, presupuesto);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        'ABIERTO',
    ]);
}

export const borrarPresupuesto: ProcesarPresupuesto = async (contexto) => {
    await borrarPresupuestoFuncion(contexto.presupuesto.id);

    return pipePresupuesto(contexto, [
        getContextoVacio,
        publicar('presupuesto_borrado', null)
    ]);
}

export const aprobarPresupuesto: ProcesarPresupuesto = async (contexto) => {
    await aprobarPresupuestoFuncion(contexto.presupuesto.id);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        'APROBADO',
    ]);
}

export const cambiarDivisa: ProcesarPresupuesto = async (contexto, payload) => {
    const divisaId = payload as string;
    await patchCambiarDivisa(contexto.presupuesto.id, divisaId);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        'ABIERTO',
    ]);
}

export const cambiarCliente: ProcesarPresupuesto = async (contexto, payload) => {
    const cambio = payload as CambioCliente;
    await patchCambiarCliente(contexto.presupuesto.id, cambio);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        'ABIERTO',
    ]);
}

export const crearLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const nuevaLinea = payload as NuevaLinea;
    const idLinea = await postLinea(contexto.presupuesto.id, nuevaLinea);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        activarLineaPorId(idLinea),
        'ABIERTO',
    ]);
}

export const cambiarLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const linea = payload as LineaPresupuesto;
    await patchLinea(contexto.presupuesto.id, linea);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const cambiarCantidadLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const { lineaId, cantidad } = payload as { lineaId: string, cantidad: number };

    const linea = contexto.presupuesto.lineas.find(l => l.id === lineaId);
    if (!linea) return contexto;

    await patchCantidadLinea(contexto.presupuesto.id, linea, cantidad);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        activarLineaPorId(lineaId),
        'ABIERTO',
    ]);
}

export const borrarLinea: ProcesarPresupuesto = async (contexto, payload) => {
    const idLinea = payload as string;
    await deleteLinea(contexto.presupuesto.id, idLinea);

    const indiceLineaActiva = (contexto.presupuesto.lineas as LineaPresupuesto[]).findIndex((l: LineaPresupuesto) => l.id === idLinea);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        activarLineaPorIndice(indiceLineaActiva),
        'ABIERTO',
    ]);
}

// Para el maestro

export const cambiarPresupuestoEnLista: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuesto = payload as Presupuesto;
    return {
        ...contexto,
        presupuestos: contexto.presupuestos.map(p => p.id === presupuesto.id ? presupuesto : p)
    }
}

export const activarPresupuesto: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuestoActivo = payload as Presupuesto;
    return {
        ...contexto,
        presupuestoActivo
    }
}

export const desactivarPresupuestoActivo: ProcesarPresupuestos = async (contexto) => {
    return {
        ...contexto,
        presupuestoActivo: null
    }
}

export const quitarPresupuestoDeLista: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuestoBorrado = payload as Presupuesto;
    return {
        ...contexto,
        presupuestos: contexto.presupuestos.filter(p => p.id !== presupuestoBorrado.id),
        presupuestoActivo: null
    }
}

export const recargarPresupuestos: ProcesarPresupuestos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPresupuestos(criteria.filtro, criteria.orden, criteria.paginacion);
    const presupuestosCargados = resultado.datos;

    return {
        ...contexto,
        presupuestos: presupuestosCargados,
        totalPresupuestos: resultado.total == -1 ? contexto.totalPresupuestos : resultado.total,
        presupuestoActivo: contexto.presupuestoActivo
            ? presupuestosCargados.find(p => p.id === contexto.presupuestoActivo?.id) ?? null
            : null
    }
}

export const incluirPresupuestoEnLista: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuesto = payload as Presupuesto;
    return {
        ...contexto,
        presupuestos: [presupuesto, ...contexto.presupuestos]
    }
}

export const abrirModalCreacion: ProcesarPresupuestos = async (contexto) => {
    return {
        ...contexto,
        estado: 'CREANDO_PRESUPUESTO'
    }
}

export const cerrarModalCreacion: ProcesarPresupuestos = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL'
    }
}

export const crearPresupuesto: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuestoNuevo = payload as NuevoPresupuesto;
    const idPresupuesto = await postPresupuesto(presupuestoNuevo);
    const presupuesto = await getPresupuesto(idPresupuesto);
    return {
        ...contexto,
        presupuestos: [presupuesto, ...contexto.presupuestos],
        presupuestoActivo: presupuesto
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



export const nuevoPresupuestoVacio: NuevoPresupuesto = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
};

export const nuevaLineaVentaVacia: NuevaLineaVenta = {
    referencia: "",
    cantidad: 1,
};

export const nuevaLineaVacia: NuevaLinea = nuevaLineaVentaVacia;

export const metaNuevoPresupuesto: MetaModelo<NuevoPresupuesto> = {
    // validador: makeValidador({}),
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
        empresa_id: { requerido: true },
    }
};

export const metaPresupuesto: MetaModelo<Presupuesto> = {
    campos: {
        fecha: { tipo: "fecha", requerido: false },
        fecha_salida: { tipo: "fecha", requerido: false },
        tasa_conversion: { tipo: "numero", requerido: true },
        total_divisa_empresa: { tipo: "numero", bloqueado: true },
        codigo: { bloqueado: true },
        id_fiscal: { bloqueado: true, requerido: true },
        cliente_id: { bloqueado: true, requerido: true },
        divisa_id: { requerido: true },
    },
    editable: (presupuesto: Presupuesto, _?: string) => {
        return !presupuesto.aprobado;
    },
};

export const editable = modeloEsEditable<Presupuesto>(metaPresupuesto);


export const metaLinea: MetaModelo<LineaPresupuesto> = {
    campos: {
        cantidad: { tipo: "numero", requerido: true },
        referencia: { requerido: true },
    }
};

export const metaNuevaLinea: MetaModelo<NuevaLinea> = {
    campos: {
        cantidad: { tipo: "numero", requerido: true },
        referencia: { requerido: true },
    }
};

export const nuevoPresupuestoClienteNoRegistradoVacio: NuevoPresupuestoClienteNoRegistrado = {
    empresa_id: "1",
    nombre_cliente: "",
    id_fiscal: "",
    nombre_via: "",
    tipo_via: "",
    numero: "",
    otros: "",
    cod_postal: "",
    ciudad: "",
    provincia_id: null,
    provincia: "",
    pais_id: "",
    apartado: "",
    telefono: "",
};


export const metaNuevoPresupuestoClienteNoRegistrado: MetaModelo<NuevoPresupuestoClienteNoRegistrado> = {
    campos: {
        cliente_nombre: { requerido: true },
        direccion_nombre_via: { requerido: true },
        empresa_id: { requerido: true },

    }
};
