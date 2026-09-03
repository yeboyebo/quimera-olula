import { ArticuloDeLineaConTipo } from "./diseño.ts";

export type ArticuloLineaCompraApi =
    | { articulo_id: string; descripcion?: string }
    | { descripcion: string };

export const articuloLineaApi = (
    linea: ArticuloDeLineaConTipo
): ArticuloLineaCompraApi => {
    switch (linea.tipoArticulo) {
        case "registrado":
            return { articulo_id: linea.referencia! };
        case "generico":
            return { articulo_id: linea.referencia!, descripcion: linea.descripcion };
        case "libre":
            return { descripcion: linea.descripcion };
    }
};

export type ProveedorCompraApi =
    | { proveedor_id: string }
    | { nombre: string; id_fiscal: string };

export const proveedorCompraApi = (proveedor: {
    proveedorId?: string | null;
    nombreProveedor?: string;
    idFiscal?: string;
}): ProveedorCompraApi =>
    proveedor.proveedorId
        ? { proveedor_id: proveedor.proveedorId }
        : { nombre: proveedor.nombreProveedor ?? "", id_fiscal: proveedor.idFiscal ?? "" };
