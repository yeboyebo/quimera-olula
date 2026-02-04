import { CambioClienteVenta, LineaVenta, NuevaLineaVenta, NuevaVenta, Venta } from "#/ventas/venta/diseño.ts";
import { Direccion, ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, MetaModelo, modeloEsEditable, publicar } from "@olula/lib/dominio.ts";
import { CambioCliente, LineaPresupuesto, Presupuesto } from "../diseño.ts";
import {
    aprobarPresupuesto as aprobarPresupuestoFuncion,
    getLineas,
    getPresupuesto,
    patchCambiarCliente,
    patchCambiarDivisa,
    patchCantidadLinea,
    patchPresupuesto
} from "../infraestructura.ts";
import { ContextoPresupuesto, EstadoPresupuesto } from "./diseño.ts";

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

export const ventaVacia: Venta = {
    id: '',
    codigo: '',
    fecha: new Date(),
    cliente_id: '',
    nombre_cliente: '',
    id_fiscal: '',
    direccion_id: '',
    direccion: direccionVacia(),
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
}

export const nuevaVentaVacia: NuevaVenta = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
}

export const cambioClienteVentaVacio: CambioClienteVenta = {
    cliente_id: "",
    nombre_cliente: "",
    direccion_id: "",
}
export const nuevaLineaVentaVacia: NuevaLineaVenta = {
    referencia: "",
    cantidad: 1,
};

export const metaVenta: MetaModelo<Venta> = {
    campos: {
        tasa_conversion: { tipo: "numero", requerido: false },
        total_divisa_empresa: { tipo: "numero", bloqueado: true },
        codigo: { bloqueado: true },
        id_fiscal: { bloqueado: true, requerido: true },
        cliente_id: { bloqueado: true, requerido: true },
        divisa_id: { requerido: true },
    },
};

export const metaLineaVenta: MetaModelo<LineaVenta> = {
    campos: {
        cantidad: { tipo: "numero", requerido: true },
        pvp_unitario: { tipo: "moneda", requerido: true },
        dto_porcentual: { tipo: "numero", requerido: false },
        referencia: { requerido: true },
    }
};

export const metaNuevaVenta: MetaModelo<NuevaVenta> = {
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
};

export const editable = modeloEsEditable<Presupuesto>(metaPresupuesto);


export const presupuestoVacio = (): Presupuesto => ({
    ...ventaVacia,
    aprobado: false,
    fecha_salida: new Date(),
    lineas: [],
})

const presupuestoVacioObjeto: Presupuesto = presupuestoVacio();

export const presupuestoVacioContexto = (): Presupuesto => ({ ...presupuestoVacioObjeto });



type ProcesarPresupuesto = ProcesarContexto<EstadoPresupuesto, ContextoPresupuesto>;

const pipePresupuesto = ejecutarListaProcesos<EstadoPresupuesto, ContextoPresupuesto>;

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
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const borrarPresupuesto: ProcesarPresupuesto = async (contexto) => {
    return pipePresupuesto(contexto, [
        publicar('presupuesto_borrado', (ctx) => ctx.presupuesto.id),
        getContextoVacio
    ]);
}

export const aprobarPresupuesto: ProcesarPresupuesto = async (contexto) => {
    await aprobarPresupuestoFuncion(contexto.presupuesto.id);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        'APROBADO',
    ]);
}

export const cambiarDivisa: ProcesarPresupuesto = async (contexto, payload) => {
    const divisaId = payload as string;
    await patchCambiarDivisa(contexto.presupuesto.id, divisaId);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const cambiarCliente: ProcesarPresupuesto = async (contexto, payload) => {
    const cambio = payload as CambioCliente;
    await patchCambiarCliente(contexto.presupuesto.id, cambio);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const crearLinea: ProcesarPresupuesto = async (contexto, payload) => {
    // const nuevaLinea = payload as NuevaLinea;
    // const idLinea = await postLinea(contexto.presupuesto.id, nuevaLinea);
    const idLinea = payload as string;

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        activarLineaPorId(idLinea),
        'ABIERTO',
    ]);
}

export const cambiarLinea: ProcesarPresupuesto = async (contexto) => {
    // const linea = payload as LineaPresupuesto;
    // await patchLinea(contexto.presupuesto.id, linea);

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
    // await deleteLinea(contexto.presupuesto.id, idLinea);

    const indiceLineaActiva = (contexto.presupuesto.lineas as LineaPresupuesto[]).findIndex((l: LineaPresupuesto) => l.id === idLinea);

    return pipePresupuesto(contexto, [
        refrescarPresupuesto,
        refrescarLineas,
        activarLineaPorIndice(indiceLineaActiva),
        'ABIERTO',
    ]);
}
