import { MetaModelo } from "@olula/lib/dominio.js";
import { AltaLineaVenta } from "../../venta/diseño.ts";
import { postLinea } from "../infraestructura.ts";

export type ModeloNuevaLinea = {
    tipoArticulo: "registrado" | "libre" | "generico";
    referencia: string | null;
    descripcionArticulo: string | null;
    descripcion: string | null;
    cantidad: number;
    pvp_unitario: number | null;
};

export const nuevaLineaVacia: ModeloNuevaLinea = {
    tipoArticulo: "registrado",
    referencia: null,
    descripcionArticulo: null,
    descripcion: null,
    cantidad: 1,
    pvp_unitario: null,
};

const validacion = (linea: ModeloNuevaLinea) => {
    return !!(linea.referencia || linea.descripcion);
};

export const metaNuevaLinea: MetaModelo<ModeloNuevaLinea> = {
    campos: {
        referencia: { tipo: "texto" },
        descripcion: { tipo: "texto" },
        cantidad: { tipo: "decimal", requerido: true, decimales: 2 },
        pvp_unitario: { requerido: (linea) => !linea.referencia, tipo: "moneda" },
    },
    validacion,
};

export const postModelo = async (idPedido: string, linea: ModeloNuevaLinea) => {
    await postLinea(idPedido, altaLineaDesdeModelo(linea));
};

const altaLineaDesdeModelo = (linea: ModeloNuevaLinea): AltaLineaVenta => {
    const { cantidad } = linea;
    switch (linea.tipoArticulo) {
        case "registrado":
            return { articulo: { articuloId: linea.referencia! }, cantidad };
        case "generico":
            return { articulo: { articuloId: linea.referencia!, descripcion: linea.descripcion! }, cantidad };
        case "libre":
            return { articulo: { descripcion: linea.descripcion!, pvpUnitario: linea.pvp_unitario! }, cantidad };
    }
};
