import React from "react";
import { Historia, MetaHistorias } from "../historias/diseño.ts";
import { QModal } from "./qmodal.tsx";

export default {
    grupo: "atomos",
    titulo: "qmodal",
    attrs: {
        nombre: "modal",
        abierto: "true",
    },
    Componente: QModal,
} as unknown as MetaHistorias;

export const Base: Historia = {
    children: React.createElement("h2", {}, "Hola mundo"),
};
