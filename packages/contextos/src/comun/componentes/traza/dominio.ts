import { formatearFechaString, formatearMoneda } from "@olula/lib/dominio.ts";
import {
    AristaTraza,
    ColumnaTraza,
    DatoResumen,
    DatosDocumentoTraza,
    GrafoTraza,
    NodoTraza,
    TipoDocumentoTraza,
    UrlPorId,
    UrlsTraza,
} from "./diseño.ts";

/** Columnas del grafo, en el orden en que se generan los documentos. */
const COLUMNAS: { id: string; titulo: string; tipos: TipoDocumentoTraza[] }[] = [
    { id: "presupuesto", titulo: "Presupuestos", tipos: ["presupuesto_venta"] },
    { id: "pedido", titulo: "Pedidos", tipos: ["pedido_venta", "pedido_compra"] },
    { id: "albaran", titulo: "Albaranes", tipos: ["albaran_venta", "albaran_compra"] },
    { id: "factura", titulo: "Facturas", tipos: ["factura_venta", "factura_compra"] },
    { id: "recibo", titulo: "Recibos", tipos: ["recibo_cobro", "recibo_pago"] },
    { id: "pago", titulo: "Pagos", tipos: ["pago_cobro"] },
];

const NOMBRES_TIPO: Record<TipoDocumentoTraza, string> = {
    presupuesto_venta: "Presupuesto de venta",
    pedido_venta: "Pedido de venta",
    albaran_venta: "Albarán de venta",
    factura_venta: "Factura de venta",
    recibo_cobro: "Recibo de cobro",
    pago_cobro: "Pago / devolución",
    pedido_compra: "Pedido de compra",
    albaran_compra: "Albarán de compra",
    factura_compra: "Factura de compra",
    recibo_pago: "Recibo de pago",
};

const URLS_POR_DEFECTO: Record<TipoDocumentoTraza, UrlPorId | null> = {
    presupuesto_venta: (id) => `/ventas/presupuesto?id=${id}`,
    pedido_venta: (id) => `/ventas/pedido?id=${id}`,
    albaran_venta: (id) => `/ventas/albaran?id=${id}`,
    factura_venta: (id) => `/ventas/factura?id=${id}`,
    recibo_cobro: (id) => `/tesoreria/recibo_venta?id=${id}`,
    pago_cobro: null,
    pedido_compra: (id) => `/compras/pedido?id=${id}`,
    albaran_compra: (id) => `/compras/albaran?id=${id}`,
    factura_compra: (id) => `/compras/factura?id=${id}`,
    recibo_pago: (id) => `/tesoreria/recibo_compra?id=${id}`,
};

const columnaDeTipo = (tipo: TipoDocumentoTraza): number =>
    COLUMNAS.findIndex((columna) => columna.tipos.includes(tipo));

const claveDe = (datos: DatosDocumentoTraza): string => `${datos.tipo}:${datos.id}`;

const esDatosDocumento = (valor: unknown): valor is DatosDocumentoTraza =>
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor) &&
    typeof (valor as DatosDocumentoTraza).tipo === "string" &&
    typeof (valor as DatosDocumentoTraza).id === "string";

/**
 * Convierte la respuesta anidada de `.../traza` en un grafo.
 *
 * Cada nivel de la respuesta es `{ <documento>: datos, <relacionados>: [niveles] }`:
 * el valor que tiene `tipo` e `id` son los datos y cada lista son documentos
 * relacionados, sean padres o hijos. La dirección de la arista no depende de
 * por dónde se llegue, sino del orden de la cadena (presupuesto → … → pago).
 * Un documento al que se llega por dos caminos es un único nodo.
 */
export const grafoDesdeTraza = (respuesta: unknown): GrafoTraza => {
    const nodos = new Map<string, NodoTraza>();
    const aristas = new Map<string, AristaTraza>();

    const recorrer = (nivel: unknown): string => {
        const valores = Object.values(nivel as Record<string, unknown>);
        const datos = valores.find(esDatosDocumento);
        if (!datos) throw new Error("La traza no trae los datos del documento");

        const clave = claveDe(datos);
        if (!nodos.has(clave)) nodos.set(clave, { clave, datos });

        valores.filter(Array.isArray).flat().forEach((relacionado) => {
            const claveRelacionado = recorrer(relacionado);
            const [desde, hasta] =
                columnaDeTipo(datos.tipo) <= columnaDeTipo(nodos.get(claveRelacionado)!.datos.tipo)
                    ? [clave, claveRelacionado]
                    : [claveRelacionado, clave];
            aristas.set(`${desde}>${hasta}`, { desde, hasta });
        });

        return clave;
    };

    const raiz = recorrer(respuesta);

    return { raiz, nodos: [...nodos.values()], aristas: [...aristas.values()] };
};

const media = (valores: number[]): number =>
    valores.reduce((suma, valor) => suma + valor, 0) / valores.length;

/**
 * Columnas con documentos, en orden de la cadena, con la fila de cada nodo.
 *
 * Se colocan de izquierda a derecha: cada documento busca la altura media de
 * sus padres (los de columnas anteriores) para quedar a su lado, y si no cabe
 * baja hasta el primer hueco libre. Los que no tienen padres van detrás, por
 * código, igual que los de la primera columna.
 */
export const layoutPorColumnas = (grafo: GrafoTraza): ColumnaTraza[] => {
    const filas = new Map<string, number>();

    return COLUMNAS.map((columna) => {
        const deseadas = grafo.nodos
            .filter((nodo) => columna.tipos.includes(nodo.datos.tipo))
            .map((nodo) => {
                const padres = grafo.aristas
                    .filter((arista) => arista.hasta === nodo.clave && filas.has(arista.desde))
                    .map((arista) => filas.get(arista.desde)!);
                return { nodo, deseada: padres.length > 0 ? media(padres) : Infinity };
            })
            .sort((a, b) => a.deseada - b.deseada || a.nodo.datos.codigo.localeCompare(b.nodo.datos.codigo, "es"));

        let siguienteLibre = 0;
        const nodos = deseadas.map(({ nodo, deseada }) => {
            const fila = Math.max(deseada === Infinity ? 0 : deseada, siguienteLibre);
            siguienteLibre = fila + 1;
            filas.set(nodo.clave, fila);
            return { ...nodo, fila };
        });

        return { id: columna.id, titulo: columna.titulo, nodos };
    }).filter((columna) => columna.nodos.length > 0);
};

export const nombreTipo = (tipo: TipoDocumentoTraza): string => NOMBRES_TIPO[tipo];

/** Texto del nodo en el grafo. Un pago no tiene código propio: se nombra por su tipo y fecha. */
export const etiquetaNodo = (datos: DatosDocumentoTraza): string =>
    datos.tipo === "pago_cobro" && datos.visible
        ? `${texto(datos.tipo_pago) ?? "Pago"} ${datos.fecha ? formatearFechaString(datos.fecha) : ""}`.trim()
        : datos.codigo;

const APROBACION: Record<string, string> = {
    PENDIENTE: "Pendiente",
    PARCIAL: "Parcial",
    TOTAL: "Aprobado",
};

const texto = (valor: unknown): string | null =>
    valor === null || valor === undefined || valor === "" ? null : String(valor);

const tercero = (id: unknown, nombre: unknown): string | null =>
    [texto(id), texto(nombre)].filter(Boolean).join(" · ") || null;

const importe = (valor: unknown, divisa: unknown): string | null =>
    typeof valor === "number" ? formatearMoneda(valor, texto(divisa) ?? "EUR") : null;

/** Datos del documento seleccionado que se enseñan en el panel. */
export const resumenDocumento = (datos: DatosDocumentoTraza): DatoResumen[] => {
    if (!datos.visible) return [];

    const candidatos: [string, string | null][] = [
        ["Tipo", texto(datos.tipo_pago)],
        ["Recibo", datos.tipo === "pago_cobro" ? datos.codigo : null],
        ["Cliente", tercero(datos.cliente_id, datos.nombre_cliente)],
        ["Proveedor", tercero(datos.proveedor_id, datos.nombre_proveedor)],
        ["Fecha", datos.fecha ? formatearFechaString(datos.fecha) : null],
        ["Total", importe(datos.total, datos.divisa_id)],
        ["Importe", importe(datos.importe, datos.divisa_id)],
        ["Estado", texto(datos.estado)],
        ["Aprobación", APROBACION[String(datos.estado_aprobado)] ?? null],
        ["Servido", texto(datos.servido)],
        ["Recibido", texto(datos.recibido)],
    ];

    return candidatos
        .filter((candidato): candidato is [string, string] => candidato[1] !== null)
        .map(([etiqueta, valor]) => ({ etiqueta, valor }));
};

/**
 * Dónde se abre un documento, o null si no tiene pantalla propia (los pagos).
 * La app puede cambiar la url de cualquier tipo, o dejarlo sin pantalla con null.
 */
export const urlDocumento = (
    tipo: TipoDocumentoTraza,
    id: string,
    urls: UrlsTraza = {}
): string | null => {
    const url = tipo in urls ? urls[tipo] : URLS_POR_DEFECTO[tipo];
    return url ? url(id) : null;
};
