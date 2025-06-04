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

export const metaOportunidadVenta: MetaModelo<OportunidadVenta> = {
    campos: {
        descripcion: { requerido: true, validacion: (oportunidad: OportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
        total_venta: { requerido: false, tipo: "moneda" },
        probabilidad: { requerido: false, tipo: "numero" },
        fecha_cierre: { requerido: false, tipo: "fecha" },
    },
};

export const metaNuevaOportunidadVenta: MetaModelo<NuevaOportunidadVenta> = {
    campos: {
        descripcion: { requerido: true, validacion: (oportunidad: NuevaOportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
        valor_defecto: { requerido: true },
        probabilidad: { requerido: true, tipo: "numero" },
        estado_id: { requerido: false, tipo: "texto" },
    },
};

export const initEstadoOportunidadVenta = (oportunidad: OportunidadVenta): EstadoModelo<OportunidadVenta> =>
    initEstadoModelo(oportunidad);

export const initEstadoOportunidadVentaVacia = () => initEstadoOportunidadVenta(oportunidadVentaVacia);
