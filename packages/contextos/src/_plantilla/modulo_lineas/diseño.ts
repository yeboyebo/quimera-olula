import { Entidad, Filtro, Modelo, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export interface ModLin extends Entidad {
    id: string;
    campoString: string;
}

export interface LineaModulo extends Entidad {
    id: string;
    campoString: string
}

export interface NuevoModLin {
    campoString: string;
}

export interface NuevaLineaModulo extends Modelo {
    campoString: string
}

export type CambiosModLin = Partial<ModLin>;
export type CambiosLineaModulo = Partial<LineaModulo>;

export type GetModLin = (id: string) => Promise<ModLin>;
export type GetModLins = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<ModLin>;
export type GetLineasModulo = (id: string) => Promise<LineaModulo[]>;
export type PostModLin = (nuevoModLin: NuevoModLin) => Promise<string>;
export type PostLineaModulo = (id: string, nuevaLinea: NuevaLineaModulo) => Promise<string>;
export type PatchModLin = (id: string, cambios: CambiosModLin) => Promise<void>;
export type PatchLineaModulo = (id: string, lineaId: string, cambios: CambiosLineaModulo) => Promise<void>;
export type DeleteModLin = (id: string) => Promise<void>;
export type DeleteLineaModulo = (id: string, lineaId: string) => Promise<void>;
