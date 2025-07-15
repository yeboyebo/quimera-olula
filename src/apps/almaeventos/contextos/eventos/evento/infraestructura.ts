import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { Evento, NuevoEvento } from "./diseño.ts";

// Datos falsos para desarrollo
const eventosFake: Evento[] = [
    {
        id: "1",
        altas_ss: false,
        camerinos: true,
        camion_escenario: false,
        carteleria: true,
        ccf: null,
        cliente_id: "cliente1",
        conexion_electrica: "220V",
        descripcion: "Evento de prueba 1",
        descripcion_ref: null,
        direccion: "Calle Falsa 123",
        enviado_a_cliente: false,
        enviado_a_proveedor: false,
        empresa_id: "empresa1",
        estado_id: "pendiente",
        factura_enviada: false,
        fecha_inicio: "2025-07-10",
        gastos_facturacion: null,
        gastos_personal: null,
        hora_inicio: "20:00",
        hora_montaje: "18:00",
        hora_prueba_sonido: "19:00",
        hoja_ruta_enviada: false,
        hoja_ruta_hecha: false,
        liquidacion: false,
        lugar: "Teatro Principal",
        num_descansos: "1",
        observaciones: "Sin incidencias",
        organizador_evento: "Juan Pérez",
        presupuesto: true,
        proveedor_id: "proveedor1",
        recibido_por_cliente: false,
        referencia: "EVT-001",
        responsable_local: "Ana Gómez",
        responsable_orquesta: "Luis Martínez",
        responsable_producciones: "Pedro Sánchez",
        recibido_por_proveedor: false,
        subtotal_coste: "1000",
        telefono: "600123123",
        tipo_escenario: "Grande",
        total_beneficio: "500",
        total_costes: "1500",
        total_costesind: "200",
        total_ingresos: "2000",
    },
    {
        id: "2",
        altas_ss: true,
        camerinos: false,
        camion_escenario: true,
        carteleria: false,
        ccf: null,
        cliente_id: "cliente2",
        conexion_electrica: "380V",
        descripcion: "Evento de prueba 2",
        descripcion_ref: null,
        direccion: "Avenida Siempre Viva 742",
        enviado_a_cliente: true,
        enviado_a_proveedor: false,
        empresa_id: "empresa2",
        estado_id: "confirmado",
        factura_enviada: true,
        fecha_inicio: "2025-08-15",
        gastos_facturacion: "300",
        gastos_personal: "400",
        hora_inicio: "21:00",
        hora_montaje: "19:00",
        hora_prueba_sonido: "20:00",
        hoja_ruta_enviada: true,
        hoja_ruta_hecha: true,
        liquidacion: true,
        lugar: "Auditorio Municipal",
        num_descansos: "2",
        observaciones: "Requiere catering",
        organizador_evento: "María López",
        presupuesto: false,
        proveedor_id: "proveedor2",
        recibido_por_cliente: true,
        referencia: "EVT-002",
        responsable_local: "Carlos Ruiz",
        responsable_orquesta: "Elena Torres",
        responsable_producciones: "Miguel Ángel",
        recibido_por_proveedor: true,
        subtotal_coste: "2000",
        telefono: "600456456",
        tipo_escenario: "Mediano",
        total_beneficio: "800",
        total_costes: "2200",
        total_costesind: "300",
        total_ingresos: "3000",
    },
];

export const getEvento = async (id: string): Promise<Evento> => {
    const evento = eventosFake.find((e) => e.id === id);
    if (!evento) throw new Error("Evento no encontrado");
    return evento;
};

export const getEventos = async (_filtro: Filtro, _orden: Orden): Promise<Evento[]> => {
    return eventosFake;
};

// Las siguientes funciones se mantienen igual para cuando la API esté lista
export const postEvento = async (_evento: NuevoEvento): Promise<string> => {
    return "fake-id";
};

export const patchEvento = async (_id: string, _evento: Partial<Evento>): Promise<void> => { };

export const deleteEvento = async (_id: string): Promise<void> => { };