import { empresaActual } from "#/valores/empresaActual.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { MetaModelo, modeloEsEditable, modeloEsValido } from "@olula/lib/dominio.ts";
import {
    cambioClienteVentaVacio,
    clienteVentaVacio,
    metaCambioClienteVenta,
    metaLineaVenta,
    metaNuevaLineaVenta,
    metaNuevaVenta,
    metaVenta,
    nuevaLineaVentaVacia,
    nuevaVentaVacia,
    ventaVacia
} from "../venta/dominio.ts";
import {
    Albaran,
    CambioClienteAlbaran,
    LineaAlbaran,
    NuevaLineaAlbaran,
    NuevoAlbaran,
} from "./diseño.ts";

export const metaTablaAlbaran: MetaTabla<Albaran> = [
    {
        id: "codigo",
        cabecera: "Código",
        prioridad: "alta",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
        prioridad: "alta",
        render: (a) => a.cliente.nombre_cliente,
    },
    {
        id: "almacen_id",
        cabecera: "Almacén",
        prioridad: "baja",
        render: (a) => a.nombre_almacen || a.almacen_id,
    },
    {
        id: "de_abono",
        cabecera: "Abono",
        prioridad: "baja",
        render: (a) => (a.de_abono ? "Sí" : ""),
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
        prioridad: "alta",
    },
];

export const albaranVacio = (): Albaran => ({
    ...ventaVacia,
    cliente: clienteVentaVacio,
    idfactura: null,
    por_comision: 0,
    hora: '',
    almacen_id: '',
    nombre_almacen: '',
    de_abono: false,
    lineas: [],
})

export const tituloAlbaran = (albaran: Albaran): string => {
    const codigo = albaran.codigo || "Nuevo Albarán";
    return albaran.de_abono ? `${codigo} · Abono` : codigo;
}

export const nuevoAlbaranVacio: NuevoAlbaran = nuevaVentaVacia;

export const cambioClienteAlbaranVacio: CambioClienteAlbaran = cambioClienteVentaVacio;

export const nuevaLineaAlbaranVacia: NuevaLineaAlbaran = nuevaLineaVentaVacia;

export const metaNuevoAlbaran: MetaModelo<NuevoAlbaran> = metaNuevaVenta;

export const metaCambioClienteAlbaran: MetaModelo<CambioClienteAlbaran> = metaCambioClienteVenta;

export const metaAlbaran: MetaModelo<Albaran> = {
    campos: {
        ...metaVenta.campos,
        fecha: { tipo: "fecha", requerido: false },
        hora: { tipo: "hora", requerido: false },
        almacen_id: { requerido: true },
        nombre_almacen: { bloqueado: true },
        de_abono: { tipo: "checkbox", requerido: false },
        divisa_id: { requerido: true, bloqueado: true },
        tasa_conversion: { tipo: "numero", requerido: true, bloqueado: true },
        agente_id: { bloqueado: true },
        por_comision: { tipo: "decimal", requerido: false, decimales: 2, positivo: true, maximo: 100, bloqueado: true },
    },
    editable: (albaran: Albaran, _?: string) => {
        return !albaran.idfactura;
    },
};

export const editable = modeloEsEditable<Albaran>(metaAlbaran);
export const albaranValido = modeloEsValido<Albaran>(metaAlbaran);

export const metaLineaAlbaran: MetaModelo<LineaAlbaran> = metaLineaVenta;

export const metaNuevaLineaAlbaran: MetaModelo<NuevaLineaAlbaran> = metaNuevaLineaVenta;

const albaranVacioObjeto: Albaran = albaranVacio();

export const albaranVacioContexto = (): Albaran => ({ ...albaranVacioObjeto });

export const nuevoClienteRegistradoVacio: NuevoAlbaran = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: empresaActual(),
} as NuevoAlbaran;

export const cambioClienteVacio = (): CambioClienteAlbaran => ({
    cliente_id: "",
    direccion_id: "",
});

export const cambioCliente = (albaran: Albaran): CambioClienteAlbaran => ({
    cliente_id: albaran.cliente.cliente_id ?? "",
    direccion_id: albaran.cliente.direccion_id ?? "",
});
