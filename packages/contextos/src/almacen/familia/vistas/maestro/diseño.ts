import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Familia } from "../../diseño.ts";

export type EstadoMaestroFamilia = "INICIAL" | "CREANDO";

export type ContextoMaestroFamilia = {
    estado: EstadoMaestroFamilia;
    familias: ListaActivaEntidades<Familia>;
};

export const metaTablaFamilia: MetaTabla<Familia> = [
    { id: "id", cabecera: "Código Familia" },
    { id: "descripcion", cabecera: "Descripcion" },
];
