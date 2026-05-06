import { MetaModelo } from "@olula/lib/dominio.js";
import { FormBaja } from "../diseño.ts";

export const metaDarDeBaja: MetaModelo<FormBaja> = {
    campos: {
        fecha_baja: { requerido: true, tipo: "fecha" },
    }
};
