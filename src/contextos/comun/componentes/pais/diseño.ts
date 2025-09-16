import { Entidad, Filtro, Orden, Paginacion, RespuestaLista2 } from "../../diseño.ts";


export interface Pais extends Entidad {
    id: string;
    nombre: string;
};


export type GetPaises = (f: Filtro, o: Orden, p?: Paginacion) => Promise<RespuestaLista2<Pais>>;

