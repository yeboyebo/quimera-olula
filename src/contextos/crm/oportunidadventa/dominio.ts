import { MetaTabla } from "../../../componentes/atomos/qtabla.tsx";
import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { NuevaOportunidadVenta, OportunidadVenta } from "./diseño.ts";

export const oportunidadVentaVacia: OportunidadVenta = {
    id: '',
    descripcion: '',
    cliente_id: null,
    nombre_cliente: null,
    importe: 0,
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
    agente_id: null,
};

export const nuevaOportunidadVentaVacia: NuevaOportunidadVenta = {
    descripcion: '',
    valor_defecto: false,
    probabilidad: '',
    estado_id: '',
    importe: 0,
    cliente_id: '',
    contacto_id: '',
    fecha_cierre: '',
    tarjeta_id: '',
};

export const metaOportunidadVenta: MetaModelo<OportunidadVenta> = {
    campos: {
        descripcion: { requerido: true, validacion: (oportunidad: OportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
        importe: { requerido: true, tipo: "moneda" },
        probabilidad: { requerido: true, tipo: "numero" },
        fecha_cierre: { requerido: true, tipo: "fecha" },
        estado_id: { requerido: true, tipo: "selector" },
        cliente_id: { requerido: true, tipo: "autocompletar" },
    },
};

export const metaNuevaOportunidadVenta: MetaModelo<NuevaOportunidadVenta> = {
    campos: {
        descripcion: { requerido: true, validacion: (oportunidad: NuevaOportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
        valor_defecto: { requerido: true },
        importe: { requerido: false, tipo: "moneda" },
        probabilidad: { requerido: true, tipo: "numero" },
        estado_id: { requerido: true, tipo: "selector" },
        fecha_cierre: { requerido: true, tipo: "fecha" },
    },
};

export const initEstadoOportunidadVenta = (oportunidad: OportunidadVenta): EstadoModelo<OportunidadVenta> =>
    initEstadoModelo(oportunidad);

export const initEstadoOportunidadVentaVacia = () => initEstadoOportunidadVenta(oportunidadVentaVacia);

export const metaTablaOportunidadVenta: MetaTabla<OportunidadVenta> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "nombre_cliente", cabecera: "Cliente" },
    { id: "importe", cabecera: "Total", tipo: "moneda" },
    { id: "fecha_cierre", cabecera: "Fecha Cierre" },
];