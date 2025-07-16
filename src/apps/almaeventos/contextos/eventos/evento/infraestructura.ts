import { RestAPI } from "../../../../../contextos/comun/api/rest_api.ts";
import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { criteriaQuery } from "../../../../../contextos/comun/infraestructura.ts";
import { Evento, NuevoEvento } from "./diseño.ts";

const baseUrlEvento = `/eventos/evento`;

// Datos falsos para desarrollo
const eventosFake: Evento[] = [
    {
        id: "PR000001",
        referencia: "kraken",
        descripcion: "Kraken Almansa",
        descripcion_ref: "Kraken",
        estado_id: "Confirmado",
        fecha_inicio: "2025-05-08",
        cliente_id: "Nombre cliente",
        proveedor_id: "nombre proveedor",
        empresa_id: "Nombre empresa",
        total_ingresos: "1000.36",
        total_costes: "950",
        presupuesto: false,
        enviado_a_cliente: true,
        recibido_por_cliente: false,
        enviado_a_proveedor: true,
        recibido_por_proveedor: false,
        factura_enviada: true,
        hoja_ruta_hecha: true,
        hoja_ruta_enviada: false,
        altas_ss: true,
        carteleria: false,
        liquidacion: false,
        ccf: "Un texto",
        direccion: "Calle de la calle 123",
        lugar: "Almansa",
        hora_montaje: "06:00",
        hora_prueba_sonido: "10:00",
        hora_inicio: "11:00",
        observaciones:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse habitant, proin eget porta fringilla lacinia mattis magna conubia aliquet, viverra suspendisse et imperdiet sed urna odio sapien. Tincidunt interdum fringilla rhoncus arcu metus sed, non laoreet suscipit dignissim varius. Arcu est pellentesque cras condimentum posuere elementum diam, tempor facilisis convallis placerat ut odio suscipit tellus, nunc in venenatis netus at mus.",
        organizador_evento: "Organizador",
        telefono: "Teléfono",
        responsable_local: "Un nombre",
        responsable_orquesta: "Un nombre",
        responsable_producciones: "Un nombre",
        conexion_electrica: "Un texto",
        num_descansos: "Un texto",
        camion_escenario: false,
        camerinos: true,
        tipo_escenario:
            "Litora at in imperdiet placerat donec turpis taciti tincidunt, orci nisl lacinia penatibus interdum volutpat pharetra, pellentesque purus faucibus est nunc conubia tempus. Ac aliquam vulputate eu mattis diam vel pulvinar lacus inceptos, taciti habitasse dictumst commodo duis ornare nullam mauris, placerat fringilla consequat sociosqu et dignissim tempus felis. Ligula etiam suscipit quam fames enim habitant senectus penatibus mattis, taciti blandit ad in bibendum sem netus a, diam dignissim dis viverra libero magnis nascetur varius",
        subtotal_coste: null,
        gastos_facturacion: null,
        gastos_personal: null,
        total_beneficio: null,
        total_costesind: null,
    },
    {
        id: "PR000002",
        referencia: "monster",
        descripcion: "Monster Almansa",
        descripcion_ref: "Monster",
        estado_id: "Confirmado",
        fecha_inicio: "2025-05-08",
        cliente_id: "Nombre cliente",
        proveedor_id: "nombre proveedor",
        empresa_id: "Nombre empresa",
        total_ingresos: "12100.36",
        total_costes: "11830.56",
        presupuesto: true,
        enviado_a_cliente: true,
        recibido_por_cliente: true,
        enviado_a_proveedor: true,
        recibido_por_proveedor: true,
        factura_enviada: false,
        hoja_ruta_hecha: true,
        hoja_ruta_enviada: true,
        altas_ss: false,
        carteleria: true,
        liquidacion: false,
        ccf: "Un texto",
        direccion: "Calle de la calle 123",
        lugar: "Almansa",
        hora_montaje: "14:00",
        hora_prueba_sonido: "Una hora antes del inicio",
        hora_inicio: "18:30",
        observaciones:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse habitant, proin eget porta fringilla lacinia mattis magna conubia aliquet, viverra suspendisse et imperdiet sed urna odio sapien. Tincidunt interdum fringilla rhoncus arcu metus sed, non laoreet suscipit dignissim varius. Arcu est pellentesque cras condimentum posuere elementum diam, tempor facilisis convallis placerat ut odio suscipit tellus, nunc in venenatis netus at mus.",
        organizador_evento: "Organizador",
        telefono: "Teléfono",
        responsable_local: "Un nombre",
        responsable_orquesta: "Un nombre",
        responsable_producciones: "Un nombre",
        conexion_electrica: "Un texto",
        num_descansos: "Un texto",
        camion_escenario: false,
        camerinos: true,
        tipo_escenario:
            "Litora at in imperdiet placerat donec turpis taciti tincidunt, orci nisl lacinia penatibus interdum volutpat pharetra, pellentesque purus faucibus est nunc conubia tempus. Ac aliquam vulputate eu mattis diam vel pulvinar lacus inceptos, taciti habitasse dictumst commodo duis ornare nullam mauris, placerat fringilla consequat sociosqu et dignissim tempus felis. Ligula etiam suscipit quam fames enim habitant senectus penatibus mattis, taciti blandit ad in bibendum sem netus a, diam dignissim dis viverra libero magnis nascetur varius",
        subtotal_coste: null,
        gastos_facturacion: null,
        gastos_personal: null,
        total_beneficio: null,
        total_costesind: null,
    },
    {
        id: "PR000003",
        referencia: "party",
        descripcion: "Party San Roque",
        descripcion_ref: "Party",
        estado_id: "Confirmado",
        fecha_inicio: "2025-05-09",
        cliente_id: "Nombre cliente",
        proveedor_id: "nombre proveedor",
        empresa_id: "Nombre empresa",
        total_ingresos: "522490",
        total_costes: "611950",
        presupuesto: true,
        enviado_a_cliente: true,
        recibido_por_cliente: true,
        enviado_a_proveedor: true,
        recibido_por_proveedor: true,
        factura_enviada: true,
        hoja_ruta_hecha: true,
        hoja_ruta_enviada: true,
        altas_ss: true,
        carteleria: true,
        liquidacion: true,
        ccf: "Un texto",
        direccion: "Calle de la calle 123",
        lugar: "Almansa",
        hora_montaje: "08:00",
        hora_prueba_sonido: "12:00",
        hora_inicio: "14:15",
        observaciones:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse habitant, proin eget porta fringilla lacinia mattis magna conubia aliquet, viverra suspendisse et imperdiet sed urna odio sapien. Tincidunt interdum fringilla rhoncus arcu metus sed, non laoreet suscipit dignissim varius. Arcu est pellentesque cras condimentum posuere elementum diam, tempor facilisis convallis placerat ut odio suscipit tellus, nunc in venenatis netus at mus.",
        organizador_evento: "Organizador",
        telefono: "Teléfono",
        responsable_local: "Un nombre",
        responsable_orquesta: "Un nombre",
        responsable_producciones: "Un nombre",
        conexion_electrica: "Un texto",
        num_descansos: "Un texto",
        camion_escenario: false,
        camerinos: true,
        tipo_escenario:
            "Litora at in imperdiet placerat donec turpis taciti tincidunt, orci nisl lacinia penatibus interdum volutpat pharetra, pellentesque purus faucibus est nunc conubia tempus. Ac aliquam vulputate eu mattis diam vel pulvinar lacus inceptos, taciti habitasse dictumst commodo duis ornare nullam mauris, placerat fringilla consequat sociosqu et dignissim tempus felis. Ligula etiam suscipit quam fames enim habitant senectus penatibus mattis, taciti blandit ad in bibendum sem netus a, diam dignissim dis viverra libero magnis nascetur varius",
        subtotal_coste: null,
        gastos_facturacion: null,
        gastos_personal: null,
        total_beneficio: null,
        total_costesind: null,
    },
    {
        id: "PR000008",
        referencia: "party",
        descripcion: "Party Cumpleaños",
        descripcion_ref: "Party",
        estado_id: "Reservado",
        fecha_inicio: "2025-05-10",
        cliente_id: "Nombre cliente",
        proveedor_id: "nombre proveedor",
        empresa_id: "Nombre empresa",
        total_ingresos: "1200.36",
        total_costes: "1210",
        presupuesto: true,
        enviado_a_cliente: true,
        recibido_por_cliente: true,
        enviado_a_proveedor: true,
        recibido_por_proveedor: true,
        factura_enviada: false,
        hoja_ruta_hecha: false,
        hoja_ruta_enviada: false,
        altas_ss: false,
        carteleria: false,
        liquidacion: false,
        ccf: "Un texto",
        direccion: "Calle de la calle 123",
        lugar: "Caudete",
        hora_montaje: "06:00",
        hora_prueba_sonido: "10:00",
        hora_inicio: "11:00",
        observaciones:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse habitant, proin eget porta fringilla lacinia mattis magna conubia aliquet, viverra suspendisse et imperdiet sed urna odio sapien. Tincidunt interdum fringilla rhoncus arcu metus sed, non laoreet suscipit dignissim varius. Arcu est pellentesque cras condimentum posuere elementum diam, tempor facilisis convallis placerat ut odio suscipit tellus, nunc in venenatis netus at mus.",
        organizador_evento: "Organizador",
        telefono: "Teléfono",
        responsable_local: "Un nombre",
        responsable_orquesta: "Un nombre",
        responsable_producciones: "Un nombre",
        conexion_electrica: "Un texto",
        num_descansos: "Un texto",
        camion_escenario: false,
        camerinos: true,
        tipo_escenario:
            "Litora at in imperdiet placerat donec turpis taciti tincidunt, orci nisl lacinia penatibus interdum volutpat pharetra, pellentesque purus faucibus est nunc conubia tempus. Ac aliquam vulputate eu mattis diam vel pulvinar lacus inceptos, taciti habitasse dictumst commodo duis ornare nullam mauris, placerat fringilla consequat sociosqu et dignissim tempus felis. Ligula etiam suscipit quam fames enim habitant senectus penatibus mattis, taciti blandit ad in bibendum sem netus a, diam dignissim dis viverra libero magnis nascetur varius",
        subtotal_coste: null,
        gastos_facturacion: null,
        gastos_personal: null,
        total_beneficio: null,
        total_costesind: null,
    },
];

export const getEvento = async (id: string): Promise<Evento> => {
    const evento = eventosFake.find((e) => e.id === id);
    if (!evento) throw new Error("Evento no encontrado");
    return evento;
};

export const getEventos = async (_filtro: Filtro, _orden: Orden): Promise<Evento[]> => {
    // return eventosFake;
    const q = criteriaQuery(_filtro, _orden);
    return RestAPI.get<{ datos: Evento[] }>(baseUrlEvento + q).then((respuesta) => respuesta.datos);
};


// Las siguientes funciones se mantienen igual para cuando la API esté lista
export const postEvento = async (_evento: NuevoEvento): Promise<string> => {
    return "fake-id";
};

export const patchEvento = async (_id: string, _evento: Partial<Evento>): Promise<void> => { };

export const deleteEvento = async (_id: string): Promise<void> => { };