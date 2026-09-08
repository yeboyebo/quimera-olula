export type TipoArticuloLinea = "registrado" | "libre" | "generico";

export type ArticuloDeLinea = {
    referencia: string | null;
    descripcion: string;
    descripcionArticulo: string | null;
};

export type ArticuloDeLineaConTipo = ArticuloDeLinea & {
    tipoArticulo: TipoArticuloLinea;
};
