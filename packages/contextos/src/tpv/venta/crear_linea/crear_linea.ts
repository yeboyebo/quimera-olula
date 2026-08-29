import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevaLineaFactura } from "./diseño.ts";

export const nuevaLineaFacturaVacia: NuevaLineaFactura = {
    idArticulo: null,
    descripcion: null,
    pvpUnitario: null,
    cantidad: 1,
    pvpTotal: 0,
    dtoPorcentual: 0,
    dtoLineal: 0,
    idGrupoIvaProducto: null,
    ivaIncluido: false,
    tipoIva: 0,
    tipoRecargo: 0,
    tipoIrpf: 0,
};

export const metaNuevaLineaFactura: MetaModelo<NuevaLineaFactura> = {
    campos: {
        idArticulo: { requerido: true, tipo: "texto" },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
    }
};
