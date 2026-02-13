import { MetaModelo } from "@olula/lib/dominio.js";
// import { NuevaLineaPedido } from "../diseño.ts";

type FormCrearLinea = {
    idVariedad: string;
    variedad: string;
    cantidad: number;
}

export const FormCrearLineaDefecto: FormCrearLinea = {
    idVariedad: "",
    variedad: "",
    cantidad: 0,
};

export const metaCrearLinea: MetaModelo<FormCrearLinea> = {
    campos: {
        idVariedad: { requerido: true },
        cantidad: { tipo: "entero", requerido: true },
    }
};