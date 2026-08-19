import { Direccion } from "@olula/lib/diseño.js";
import { MetaCampo, MetaModelo, plugin } from "@olula/lib/dominio.ts";
import { AltaLineaVentaApi, CambioClienteVenta, ClienteVenta, LineaVenta, NuevaLineaLibreVenta, NuevaLineaVenta, NuevaVenta, NuevaVentaClienteNoRegistrado, Venta } from "./diseño.ts";

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

export const clienteVentaVacio: ClienteVenta = {
    cliente_id: null,
    nombre_cliente: '',
    id_fiscal: '',
    direccion_id: null,
    direccion: direccionVacia(),
}

export const ventaVacia: Venta = {
    id: '',
    codigo: '',
    fecha: new Date(),
    agente_id: '',
    nombre_agente: '',
    divisa_id: '',
    tasa_conversion: 1,
    total: 0,
    total_divisa_empresa: 0,
    neto: 0,
    total_iva: 0,
    total_irpf: 0,
    total_recargo: 0,
    forma_pago_id: '',
    nombre_forma_pago: '',
    grupo_iva_negocio_id: '',
    observaciones: '',
    dtoPorcentual: 0,
    netoSinDto: 0,
}

/** La empresa la resuelve la infraestructura al enviar, con `empresaActual()`. */
export const nuevaVentaVacia: NuevaVenta = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "",
}

export const nuevaVentaClienteNoRegistradaVacia: NuevaVentaClienteNoRegistrado = {
    empresa_id: "",
    nombre_cliente: "",
    id_fiscal: "",
    nombre_via: "",
    tipo_via: "",
    numero: "",
    otros: "",
    cod_postal: "",
    ciudad: "",
    provincia: "",
    pais_id: "",
    apartado: "",
    telefono: "",
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

export const puedeCambiarDivisa = (venta: { lineas?: unknown[] }) => (venta.lineas?.length ?? 0) === 0;

export const DIVISA_EMPRESA = "EUR";

export const enDivisaExtranjera = (venta: { divisa_id: string }): boolean => {
    const divisa = venta.divisa_id?.trim().toUpperCase() ?? "";
    return divisa !== "" && divisa !== DIVISA_EMPRESA;
};

export const mostrarImporte = (importe?: number | null): boolean => !!importe;

/**
 * En `legacy` el documento no lleva grupo de IVA de negocio: el servidor lo
 * devuelve siempre como GENERAL y descarta lo que se le mande.
 */
export const grupoIvaNegocioEnDocumento = (): boolean => plugin("iva_nav") !== "legacy";

export const tituloDocumentoVenta = (
    documento: { codigo: string; cliente: { nombre_cliente: string } },
    fallback: string
): string => {
    const codigo = documento.codigo || fallback;
    const nombreCliente = documento.cliente?.nombre_cliente?.trim() ?? "";
    return nombreCliente ? `${codigo} · ${nombreCliente}` : codigo;
};

export const formatearTasaConversion = (tasa: number): string =>
    `×${new Intl.NumberFormat("es-ES", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    }).format(tasa)}`;

export const metaVenta: MetaModelo<Venta> = {
    campos: {
        tasa_conversion: { tipo: "numero", requerido: false },
        total_divisa_empresa: { tipo: "numero", bloqueado: true },
        codigo: { bloqueado: true },
        divisa_id: { requerido: true },
    },
};

const metaDtoPorcentual: MetaCampo<LineaVenta> = {
    tipo: "decimal",
    requerido: false,
    decimales: 2,
    positivo: true,
    maximo: 100
};

const metaDtoLineal: MetaCampo<LineaVenta> = {
    tipo: "decimal",
    requerido: false,
    decimales: 2,
    positivo: true,
};

const metaPorcentajeLinea: MetaCampo<LineaVenta> = {
    tipo: "decimal",
    requerido: false,
    decimales: 2,
    positivo: true,
    maximo: 100,
};

export const metaLineaVenta: MetaModelo<LineaVenta> = {
    campos: {
        cantidad: { tipo: "decimal", requerido: true, decimales: 2 },
        iva_incluido: { tipo: "checkbox", requerido: true },
        pvp_unitario: { tipo: "moneda", requerido: true },
        dto_porcentual: metaDtoPorcentual,
        dto_lineal: metaDtoLineal,
        tipo_irpf: metaPorcentajeLinea,
        por_comision: metaPorcentajeLinea,
        tipo_recargo: { ...metaPorcentajeLinea, bloqueado: true },
        // Lo calcula el servidor a partir del grupo de IVA: se muestra y nunca se envía.
        tipo_iva: { ...metaPorcentajeLinea, bloqueado: true },
        importe_comision: { tipo: "moneda", requerido: false, bloqueado: true },
        // Las líneas sin artículo de catálogo no tienen referencia: su identidad
        // es la descripción, que sí es obligatoria.
        referencia: { requerido: false },
        descripcion: { requerido: true, tipo: "texto" },
    }
};

export const metaNuevaVenta: MetaModelo<NuevaVenta> = {
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
        empresa_id: { requerido: true },
    }
};

/**
 * Cliente de paso: no hay ids que validar, lo mínimo es el nombre y la vía.
 * El `tipo: "texto"` es lo que hace que un valor vacío invalide el campo.
 */
export const metaNuevaVentaClienteNoRegistrado: MetaModelo<NuevaVentaClienteNoRegistrado> = {
    campos: {
        nombre_cliente: { requerido: true, tipo: "texto" },
        nombre_via: { requerido: true, tipo: "texto" },
        empresa_id: { requerido: true },
    }
};

export const metaCambioClienteVenta: MetaModelo<CambioClienteVenta> = {
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
    }
};

export const metaNuevaLineaVenta: MetaModelo<NuevaLineaVenta> = {
    campos: {
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        referencia: { requerido: true, tipo: "texto" },
    }
};

export const nuevaLineaLibreVentaVacia: NuevaLineaLibreVenta = {
    descripcion: "",
    cantidad: 1,
    pvp_unitario: 0,
};

export const metaNuevaLineaLibreVenta: MetaModelo<NuevaLineaLibreVenta> = {
    campos: {
        descripcion: { requerido: true, tipo: "texto" },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvp_unitario: { requerido: true, tipo: "moneda" },
    }
};

/**
 * El bloque `articulo` del PATCH de línea es excluyente: o el id del catálogo,
 * o la descripción, que es lo que convierte (o mantiene) la línea sin referencia.
 */
export const articuloDeLinea = (
    linea: Pick<LineaVenta, 'referencia' | 'descripcion'>
) => linea.referencia
        ? { articulo_id: linea.referencia }
        : { descripcion: linea.descripcion };

/**
 * Discrimina las dos formas de alta de línea que acepta el servidor.
 */
export const esLineaConArticulo = (
    linea: NuevaLineaVenta | NuevaLineaLibreVenta
): linea is NuevaLineaVenta => 'referencia' in linea;

/**
 * Serializa un alta de línea al cuerpo que espera el servidor, igual para los
 * cuatro documentos de venta.
 */
export const altaLineaApi = (
    linea: NuevaLineaVenta | NuevaLineaLibreVenta
): AltaLineaVentaApi => ({
    articulo: esLineaConArticulo(linea)
        ? { articulo_id: linea.referencia }
        : { descripcion: linea.descripcion, pvp_unitario: linea.pvp_unitario },
    cantidad: linea.cantidad,
});


/**
 * Bloque `cliente` que espera el servidor al cambiar el cliente de un documento
 * o al crearlo: o el par de ids del maestro, o el cliente de paso con su
 * dirección anidada. `provincia_id` viaja siempre a null, porque la dirección de
 * un cliente no registrado no referencia el maestro de provincias.
 */
export const payloadCambioCliente = (cambio: CambioClienteVenta) =>
    'cliente_id' in cambio
        ? {
            cliente_id: cambio.cliente_id,
            direccion_id: cambio.direccion_id,
        }
        : {
            nombre: cambio.nombre_cliente || "",
            id_fiscal: cambio.id_fiscal,
            direccion: {
                nombre_via: cambio.nombre_via,
                tipo_via: cambio.tipo_via || null,
                numero: cambio.numero || null,
                otros: cambio.otros || null,
                cod_postal: cambio.cod_postal || null,
                ciudad: cambio.ciudad || null,
                provincia_id: null,
                provincia: cambio.provincia || null,
                pais_id: cambio.pais_id || null,
                apartado: cambio.apartado || null,
                telefono: cambio.telefono || null,
            },
        };
