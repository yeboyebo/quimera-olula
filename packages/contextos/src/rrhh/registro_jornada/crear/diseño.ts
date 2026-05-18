import { MetaModelo } from "@olula/lib/dominio.js";

export type NuevaJornadaForm = {
    empleadoId: string;
    fecha: Date;
    horaEntrada: string;
    horaSalida: string;
    observaciones: string;
};

export const nuevaJornadaFormInicial: NuevaJornadaForm = {
    empleadoId: "",
    fecha: new Date(),
    horaEntrada: "",
    horaSalida: "",
    observaciones: "",
};

export const metaNuevaJornada: MetaModelo<NuevaJornadaForm> = {
    campos: {
        empleadoId: { tipo: "texto", requerido: true },
        fecha: { tipo: "fecha", requerido: true },
        horaEntrada: { tipo: "hora", },
        horaSalida: { tipo: "hora" },
        observaciones: { tipo: "texto" },
    },
};
