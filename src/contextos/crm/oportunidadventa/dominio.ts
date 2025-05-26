import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { NuevaOportunidadVenta, OportunidadVenta } from "./diseño.ts";

export const oportunidadVentaVacia: OportunidadVenta = {
    id: '',
    descripcion: '',
    cliente_id: null,
    nombre_cliente: null,
    total_venta: 0,
    estado_id: '',
    descripcion_estado: null,
    probabilidad: 0,
    fecha_cierre: null,
    contacto_id: null,
    nombre_contacto: null,
    tarjeta_id: null,
    nombre_tarjeta: null,
    usuario_id: null,
    observaciones: null,
    valor_defecto: false,
};

export const nuevaOportunidadVentaVacia: NuevaOportunidadVenta = {
    descripcion: '',
    valor_defecto: false,
    probabilidad: '',
    estado_id: '',
};

export const validadoresOportunidadVenta = {
    descripcion: (valor: string) => stringNoVacio(valor),
    // total_venta: (valor: number) => valor >= 0,
    estado_id: (valor: string) => stringNoVacio(valor),
};

export const metaOportunidadVenta: MetaModelo<OportunidadVenta> = {
    campos: {
        descripcion: { requerido: true },
        total_venta: { requerido: false },
        probabilidad: { requerido: false, tipo: "number" },
        fecha_cierre: { requerido: false, tipo: "date" },
    },
};

export const metaNuevaOportunidadVenta: MetaModelo<NuevaOportunidadVenta> = {
    campos: {
        descripcion: { requerido: true },
        valor_defecto: { requerido: true },
        probabilidad: { requerido: true, tipo: "number" },
        estado_id: { requerido: false, tipo: "string" },
    },
};

export const initEstadoOportunidadVenta = (oportunidad: OportunidadVenta): EstadoModelo<OportunidadVenta> =>
    initEstadoModelo(oportunidad);

export const initEstadoOportunidadVentaVacia = () => initEstadoOportunidadVenta(oportunidadVentaVacia);
