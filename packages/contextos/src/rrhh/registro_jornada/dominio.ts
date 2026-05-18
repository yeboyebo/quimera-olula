import { MetaModelo } from "@olula/lib/dominio.js";
import { RegistroJornada } from "./diseño.ts";

export const registroJornadaVacio: RegistroJornada = {
    id: "",
    empleadoId: "",
    fecha: new Date(0),
    horaEntrada: null,
    horaSalida: null,
    estado: "BORRADOR",
    observaciones: null,
    tiempoTotalPausas: 0,
    estadoBorrador: null,
    pausas: [],
};

export const metaRegistroJornada: MetaModelo<RegistroJornada> = {
    campos: {
        horaEntrada: { tipo: "hora" },
        horaSalida: { tipo: "hora" },
        observaciones: { tipo: "texto" },
    },
    editable: (jornada: RegistroJornada) => jornada.estado === "BORRADOR",
};
