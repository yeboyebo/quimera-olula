
import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../../../../contextos/comun/dominio.ts";
import { Evento, NuevoEvento } from "./diseño.ts";

export const eventoVacio: Evento = {
    id: '',
    altas_ss: false,
    camerinos: false,
    camion_escenario: false,
    carteleria: false,
    ccf: null,
    cliente_id: null,
    conexion_electrica: null,
    descripcion: null,
    descripcion_ref: null,
    direccion: null,
    enviado_a_cliente: false,
    enviado_a_proveedor: false,
    empresa_id: null,
    estado_id: null,
    factura_enviada: false,
    fecha_inicio: null,
    gastos_facturacion: null,
    gastos_personal: null,
    hora_inicio: null,
    hora_montaje: null,
    hora_prueba_sonido: null,
    hoja_ruta_enviada: false,
    hoja_ruta_hecha: false,
    liquidacion: false,
    lugar: null,
    num_descansos: null,
    observaciones: null,
    organizador_evento: null,
    presupuesto: false,
    proveedor_id: null,
    recibido_por_cliente: false,
    referencia: null,
    responsable_local: null,
    responsable_orquesta: null,
    responsable_producciones: null,
    recibido_por_proveedor: false,
    subtotal_coste: null,
    telefono: null,
    tipo_escenario: null,
    total_beneficio: null,
    total_costes: null,
    total_costesind: null,
    total_ingresos: null,
};

export const nuevoEventoVacio: NuevoEvento = {
    referencia: '',
    codproyecto: '',
    fecha_inicio: '',
};

export const metaEvento: MetaModelo<Evento> = {
    campos: {
        referencia: { requerido: false },
        descripcion: { requerido: false },
        fecha_inicio: { requerido: false, tipo: "fecha" },
        cliente_id: { requerido: false },
        empresa_id: { requerido: false },
        estado_id: { requerido: false },
        proveedor_id: { requerido: false },
        lugar: { requerido: false },
        telefono: { requerido: false },
        // Agrega aquí más campos según validaciones necesarias
    },
};

export const metaNuevoEvento: MetaModelo<NuevoEvento> = {
    campos: {
        referencia: { requerido: true, validacion: (evento: NuevoEvento) => stringNoVacio(evento.referencia) },
        codproyecto: { requerido: true, validacion: (evento: NuevoEvento) => stringNoVacio(evento.codproyecto) },
        fecha_inicio: { requerido: true, tipo: "fecha", validacion: (evento: NuevoEvento) => stringNoVacio(evento.fecha_inicio) },
    },
};

export const initEstadoEvento = (evento: Evento): EstadoModelo<Evento> =>
    initEstadoModelo(evento);

export const initEstadoEventoVacio = () => initEstadoEvento(eventoVacio);