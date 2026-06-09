import { MetaTabla } from "@olula/componentes/index.js";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Entidad } from "@olula/lib/diseño.ts";

export interface DevolucionPedido extends Entidad {
    codigo: string;
    codCliente: string;
    nombrecliente: string;
    servido: string;
    estadopago: string;
    fecha: Date | null;
    total: number;
}

export interface LineaDevolucionPedido extends Entidad {
    codigo: string;
    descripcion: string;
    cantidad: number;
    cantidadDevolver: number;
    precio: number;
    total: number;
    codLote?: string;
    fechaCaducidad?: Date | null;
}

export interface LineaFacturaDevolucion extends Entidad {
    codigo: string;
    descripcion: string;
    cantidad: number;
    precio: number;
    total: number;
    cantidadDevolver?: number;
    importe?: number;
    esKit?: boolean;
}

export interface CabeceraFacturaDevolucion extends Entidad {
    codigo: string;
    nombrecliente: string;
    codCliente?: string;
    fecha: Date | null;
    total: number;
}

export interface FacturaDevolucion {
    cabeceraFactura: CabeceraFacturaDevolucion;
    lineas: LineaFacturaDevolucion[];
}

export type EstadoMaestroDevolucionesPedidos = "INICIAL" | "BUSCANDO_FACTURA";

export type ContextoMaestroDevolucionesPedidos = {
    estado: EstadoMaestroDevolucionesPedidos;
    devoluciones: ListaActivaEntidades<DevolucionPedido>;
};

export const metaTablaDevolucionesPedidos: MetaTabla<DevolucionPedido> = [
    { id: "codigo", cabecera: "Codigo" },
    { id: "nombrecliente", cabecera: "Cliente" },
    { id: "fecha", cabecera: "Fecha", tipo: "fecha" },
    { id: "servido", cabecera: "Servido" },
    { id: "estadopago", cabecera: "Estado" },
    { id: "total", cabecera: "Importe", tipo: "moneda" },
];
