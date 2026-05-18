import { describe, expect, test } from "vitest";
import { validacionCampoModelo } from "@olula/lib/dominio.js";
import { metaRegistroJornada, registroJornadaVacio, ERR_HORA_SALIDA_JORNADA } from "../dominio.ts";
import { metaNuevaJornada, nuevaJornadaFormInicial, ERR_HORA_SALIDA_NUEVA_JORNADA } from "../crear/diseño.ts";

const validarJornada = validacionCampoModelo(metaRegistroJornada);
const validarNuevaJornada = validacionCampoModelo(metaNuevaJornada);

// Spec [crear]
describe("[jornada-crear-01] La hora fin de la jornada no puede ser anterior a la hora de inicio", () => {
    test("es válida si horaSalida está vacía", () => {
        const j = { ...nuevaJornadaFormInicial, horaEntrada: "09:00", horaSalida: "" };
        expect(validarNuevaJornada(j, "horaSalida")).toBe(true);
    });

    test("es válida si horaEntrada está vacía", () => {
        const j = { ...nuevaJornadaFormInicial, horaEntrada: "", horaSalida: "18:00" };
        expect(validarNuevaJornada(j, "horaSalida")).toBe(true);
    });

    test("es válida si horaSalida > horaEntrada", () => {
        const j = { ...nuevaJornadaFormInicial, horaEntrada: "09:00", horaSalida: "18:00" };
        expect(validarNuevaJornada(j, "horaSalida")).toBe(true);
    });

    test("es válida si horaSalida === horaEntrada", () => {
        const j = { ...nuevaJornadaFormInicial, horaEntrada: "09:00", horaSalida: "09:00" };
        expect(validarNuevaJornada(j, "horaSalida")).toBe(true);
    });

    test("es inválida si horaSalida < horaEntrada", () => {
        const j = { ...nuevaJornadaFormInicial, horaEntrada: "18:00", horaSalida: "09:00" };
        expect(validarNuevaJornada(j, "horaSalida")).toBe(ERR_HORA_SALIDA_NUEVA_JORNADA);
    });
});

// Spec [cambiar]
describe("[jornada-cambiar-01] La hora fin de la jornada no puede ser anterior al mayor valor de hora entre la hora de inicio de la jornada y las horas de inicio y/o fin de las pausas", () => {
    test("es válida si no hay hora de salida", () => {
        const j = { ...registroJornadaVacio, horaEntrada: "09:00", horaSalida: null };
        expect(validarJornada(j, "horaSalida")).toBe(true);
    });

    test("es válida si no hay ninguna hora de referencia", () => {
        const j = { ...registroJornadaVacio, horaEntrada: null, horaSalida: "18:00", pausas: [] };
        expect(validarJornada(j, "horaSalida")).toBe(true);
    });

    test("es válida si horaSalida > horaEntrada sin pausas", () => {
        const j = { ...registroJornadaVacio, horaEntrada: "09:00", horaSalida: "18:00", pausas: [] };
        expect(validarJornada(j, "horaSalida")).toBe(true);
    });

    test("es válida si horaSalida === horaEntrada sin pausas", () => {
        const j = { ...registroJornadaVacio, horaEntrada: "09:00", horaSalida: "09:00", pausas: [] };
        expect(validarJornada(j, "horaSalida")).toBe(true);
    });

    test("es inválida si horaSalida < horaEntrada sin pausas", () => {
        const j = { ...registroJornadaVacio, horaEntrada: "18:00", horaSalida: "09:00", pausas: [] };
        expect(validarJornada(j, "horaSalida")).toBe(ERR_HORA_SALIDA_JORNADA);
    });

    test("es válida si horaSalida > horaInicio de pausa (sin horaFin)", () => {
        const j = {
            ...registroJornadaVacio,
            horaEntrada: "09:00",
            horaSalida: "18:00",
            pausas: [{ id: "1", horaInicio: "12:00", horaFin: null, causa: "Almuerzo" }],
        };
        expect(validarJornada(j, "horaSalida")).toBe(true);
    });

    test("es inválida si horaSalida < horaInicio de una pausa", () => {
        const j = {
            ...registroJornadaVacio,
            horaEntrada: "09:00",
            horaSalida: "11:00",
            pausas: [{ id: "1", horaInicio: "12:00", horaFin: null, causa: "Almuerzo" }],
        };
        expect(validarJornada(j, "horaSalida")).toBe(ERR_HORA_SALIDA_JORNADA);
    });

    test("es inválida si horaSalida < horaFin de una pausa", () => {
        const j = {
            ...registroJornadaVacio,
            horaEntrada: "09:00",
            horaSalida: "12:30",
            pausas: [{ id: "1", horaInicio: "12:00", horaFin: "13:00", causa: "Almuerzo" }],
        };
        expect(validarJornada(j, "horaSalida")).toBe(ERR_HORA_SALIDA_JORNADA);
    });

    test("es válida si horaSalida > horaFin de la última pausa", () => {
        const j = {
            ...registroJornadaVacio,
            horaEntrada: "09:00",
            horaSalida: "18:00",
            pausas: [{ id: "1", horaInicio: "12:00", horaFin: "13:00", causa: "Almuerzo" }],
        };
        expect(validarJornada(j, "horaSalida")).toBe(true);
    });

    test("es inválida si horaSalida < la hora más tardía de varias pausas", () => {
        const j = {
            ...registroJornadaVacio,
            horaEntrada: "09:00",
            horaSalida: "15:00",
            pausas: [
                { id: "1", horaInicio: "12:00", horaFin: "13:00", causa: "Almuerzo" },
                { id: "2", horaInicio: "16:00", horaFin: null, causa: "Descanso" },
            ],
        };
        expect(validarJornada(j, "horaSalida")).toBe(ERR_HORA_SALIDA_JORNADA);
    });
});
