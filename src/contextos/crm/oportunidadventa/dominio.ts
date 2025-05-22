import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { NuevaOportunidadVenta, OportunidadVenta } from "./diseño.ts";

export const oportunidadVentaVacia: OportunidadVenta = {
    id: '',
    descripcion: '',
    cliente_id: null,
    nombre_cliente: null,
    total_venta: 0,
    estado_id: '',
    nombre_estado: null,
    probabilidad: 0,
    fecha_cierre: null,
    contacto_id: null,
    nombre_contacto: null,
    tarjeta_id: null,
    nombre_tarjeta: null,
    usuario_id: null,
    observaciones: null,
};

export const nuevaOportunidadVentaVacia: NuevaOportunidadVenta = {
    descripcion: '',
    estado_id: '1',
    fecha_cierre: '',
};

export const validadoresOportunidadVenta = {
    descripcion: (valor: string) => stringNoVacio(valor),
    total_venta: (valor: number) => valor >= 0,
    estado_id: (valor: string) => stringNoVacio(valor),
};

export const metaOportunidadVenta: MetaModelo<OportunidadVenta> = {
    campos: {
        descripcion: { requerido: true },
        total_venta: { tipo: "number", requerido: true },
        estado_id: { requerido: true },
    },
};

export const metaNuevaOportunidadVenta: MetaModelo<NuevaOportunidadVenta> = {
    campos: {
        descripcion: { requerido: true },
        estado_id: { requerido: true },
        fecha_cierre: { requerido: true },
    },
};

export const initEstadoOportunidadVenta = (oportunidad: OportunidadVenta): EstadoModelo<OportunidadVenta> =>
    initEstadoModelo(oportunidad);

export const initEstadoOportunidadVentaVacia = () => initEstadoOportunidadVenta(oportunidadVentaVacia);
