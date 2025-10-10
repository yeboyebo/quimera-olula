import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../../../../contextos/comun/dominio.ts";
import { Evento, NuevoEvento } from "./diseño.ts";
import { descargarHojaRuta as descargarHojaRutaAPI } from "./infraestructura.ts";

export const eventoVacio: Evento = {
    id: '',
    nombre_cliente: '',
    nombre_empresa: '',
    nombre_proveedor: '',
    evento_id: '',
    altas_ss: false,
    camerinos: false,
    camion_escenario: false,
    carteleria: false,
    ccf: '',
    cliente_id: '',
    conexion_electrica: '',
    descripcion: '',
    descripcion_ref: '',
    direccion: '',
    enviado_a_cliente: false,
    enviado_a_proveedor: false,
    empresa_id: 0,
    estado_id: '',
    factura_enviada: false,
    fecha_inicio: '',
    gastos_facturacion: 0,
    gastos_personal: 0,
    hora_inicio: '',
    hora_montaje: '',
    hora_prueba_sonido: '',
    hoja_ruta_enviada: false,
    hoja_ruta_hecha: false,
    liquidacion: false,
    lugar: '',
    num_descansos: 0,
    observaciones: '',
    organizador_evento: '',
    presupuesto: false,
    proveedor_id: '',
    recibido_por_cliente: false,
    referencia: '',
    responsable_local: '',
    responsable_orquesta: '',
    responsable_producciones: '',
    recibido_por_proveedor: false,
    subtotal_coste: 0,
    telefono: '',
    tipo_escenario: '',
    total_beneficio: 0,
    total_costes: 0,
    total_costesind: 0,
    total_ingresos: 0,
    codproyecto: ''
};

export const nuevoEventoVacio: NuevoEvento = {
    altas_ss: false,
    camerinos: false,
    camion_escenario: false,
    carteleria: false,
    ccf: '',
    cliente_id: '',
    conexion_electrica: '',
    descripcion: '',
    descripcion_ref: '',
    direccion: '',
    enviado_a_cliente: false,
    enviado_a_proveedor: false,
    empresa_id: 0,
    estado_id: '',
    factura_enviada: false,
    fecha_inicio: '',
    gastos_facturacion: 0,
    gastos_personal: 0,
    hora_inicio: '',
    hora_montaje: '',
    hora_prueba_sonido: '',
    hoja_ruta_enviada: false,
    hoja_ruta_hecha: false,
    liquidacion: false,
    lugar: '',
    num_descansos: 0,
    observaciones: '',
    organizador_evento: '',
    presupuesto: false,
    proveedor_id: '',
    recibido_por_cliente: false,
    referencia: '',
    responsable_local: '',
    responsable_orquesta: '',
    responsable_producciones: '',
    recibido_por_proveedor: false,
    subtotal_coste: 0,
    telefono: '',
    tipo_escenario: '',
    total_beneficio: 0,
    total_costes: 0,
    total_costesind: 0,
    total_ingresos: 0,
    codproyecto: ''
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
        descripcion: { requerido: true, validacion: (evento: NuevoEvento) => stringNoVacio(evento.descripcion) },
        fecha_inicio: { requerido: true, tipo: "fecha", validacion: (evento: NuevoEvento) => stringNoVacio(evento.fecha_inicio) },
    },
};

export const initEstadoEvento = (evento: Evento): EstadoModelo<Evento> =>
    initEstadoModelo(evento);

export const initEstadoEventoVacio = () => initEstadoEvento(eventoVacio);

// Función para determinar el tipo de un campo basado en la interfaz Evento
export const dameValorDefectoPorTipo = (campo: keyof Evento): string | number | boolean => {
    const valor = eventoVacio[campo];
    if (typeof valor === 'boolean') {
        return false;
    } else if (typeof valor === 'number') {
        return 0;
    } else {
        return '';
    }
};

export const reemplazarNulls = (evento: Partial<Evento>): Partial<Evento> => {
    return Object.fromEntries(
        Object.entries(evento).map(([k, v]) => {
            if (v === null) {
                return [k, dameValorDefectoPorTipo(k as keyof Evento)];
            }
            return [k, v];
        })
    ) as Partial<Evento>;
};

// Para visualizar en nueva pestaña
export const abrirHojaRuta = async (eventoId: string): Promise<void> => {
    const blob = await descargarHojaRutaAPI(eventoId);
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
};

// Para solo descargar
export const descargarHojaRuta = async (eventoId: string): Promise<void> => {
    const blob = await descargarHojaRutaAPI(eventoId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hoja_ruta_${eventoId}.pdf`;
    document.body.appendChild(link); // Agregar al DOM
    link.click();
    document.body.removeChild(link); // Remover del DOM
    window.URL.revokeObjectURL(url);
};

// Para descargar y abrir directamente
export const descargarYAbrirHojaRuta = async (eventoId: string): Promise<void> => {
    const blob = await descargarHojaRutaAPI(eventoId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hoja_ruta_${eventoId}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
};
