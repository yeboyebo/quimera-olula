import { Familia } from "../../diseño.ts";

export type EstadoFamilia = "INICIAL" | "Editando" | "Borrando";

export type ContextoFamilia = {
    estado: EstadoFamilia;
    familia: Familia;
    familiaInicial: Familia;
};
