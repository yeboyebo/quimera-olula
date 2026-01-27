import { MetaTabla } from "@olula/componentes/index.js";
import { Direccion } from "@olula/lib/diseño.js";
import { MetaModelo, modeloEsEditable, modeloEsValido } from "@olula/lib/dominio.ts";
import {
    cambioClienteVentaVacio,
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
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

export const albaranVacio = (): Albaran => ({
    ...ventaVacia,
    idfactura: null,
    lineas: [],
})

export const nuevoAlbaranVacio: NuevoAlbaran = nuevaVentaVacia;

export const cambioClienteAlbaranVacio: CambioClienteAlbaran = cambioClienteVentaVacio;

export const nuevaLineaAlbaranVacia: NuevaLineaAlbaran = nuevaLineaVentaVacia;

export const metaNuevoAlbaran: MetaModelo<NuevoAlbaran> = metaNuevaVenta;

export const metaCambioClienteAlbaran: MetaModelo<CambioClienteAlbaran> = metaCambioClienteVenta;

export const metaAlbaran: MetaModelo<Albaran> = {
    campos: {
        ...metaVenta.campos,
        fecha: { tipo: "fecha", requerido: false },
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

export const nuevoClienteRegistradoVacio: NuevoAlbaran = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
} as NuevoAlbaran;

export const cambioClienteVacio = (): CambioClienteAlbaran => ({
    cliente_id: "",
    direccion_id: "",
});

export const cambioCliente = (albaran: Albaran): CambioClienteAlbaran => ({
    cliente_id: albaran.cliente_id,
    direccion_id: albaran.direccion_id,
});
