import { MetaModelo } from "@olula/lib/dominio.js";
// import { NuevaLineaPedido } from "../diseño.ts";

type FormCrearLinea = {
    idVariedad: string;
    variedad: string;
    idTipoPalet: string;
    cantidadEnvases: number;
    cantidadPalets: number;
    envasesPorPalet: number;
}

export const FormCrearLineaDefecto: FormCrearLinea = {
    idVariedad: "",
    variedad: "",
    idTipoPalet: "",
    cantidadEnvases: 0,
    cantidadPalets: 0,
    envasesPorPalet: 10
};

const onChange = (modelo: FormCrearLinea, campo: string, _: unknown, palet?: Record<string, unknown>) => {

    if (campo === "idTipoPalet" && palet) {
        const envasesPorPalet = palet.cantidadEnvase as number;
        return {
            ...modelo,
            envasesPorPalet,
            cantidadEnvases: modelo.cantidadPalets * envasesPorPalet
        }
    }
    if (campo === "cantidadPalets") {
        return {
            ...modelo,
            cantidadEnvases: modelo.cantidadPalets * modelo.envasesPorPalet
        }
    }
    return modelo;
}

export const metaCrearLinea: MetaModelo<FormCrearLinea> = {
    campos: {
        idVariedad: { requerido: true },
        idTipoPalet: { requerido: true },
        cantidadPalets: { tipo: "entero", requerido: true },
        cantidadEnvases: { tipo: "entero", requerido: true },
    },
    onChange
};