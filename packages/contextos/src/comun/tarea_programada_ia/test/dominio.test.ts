import { describe, expect, it } from "vitest";
import {
    descripcionFrecuencia,
    expresionCronDesdeProgramacion,
    programacionDesdeExpresionCron,
} from "../dominio.js";

describe("expresionCronDesdeProgramacion / programacionDesdeExpresionCron", () => {
    it("traduce cada frecuencia fija a su expresión cron y viceversa", () => {
        const casos: [string, string][] = [
            ["cada_5_min", "*/5 * * * *"],
            ["cada_15_min", "*/15 * * * *"],
            ["cada_media_hora", "*/30 * * * *"],
            ["cada_hora", "0 * * * *"],
        ];

        for (const [frecuencia, cron] of casos) {
            const programacion = programacionDesdeExpresionCron(cron);
            expect(programacion.frecuencia).toBe(frecuencia);
            expect(expresionCronDesdeProgramacion(programacion)).toBe(cron);
        }
    });

    it("cada_dia usa hora y minuto y deja * en día de la semana", () => {
        const cron = expresionCronDesdeProgramacion({
            frecuencia: "cada_dia", hora: 9, minuto: 30, diaSemana: 1,
        });
        expect(cron).toBe("30 9 * * *");

        const programacion = programacionDesdeExpresionCron(cron);
        expect(programacion).toEqual({ frecuencia: "cada_dia", hora: 9, minuto: 30, diaSemana: 1 });
    });

    it("cada_semana usa hora, minuto y día de la semana", () => {
        const cron = expresionCronDesdeProgramacion({
            frecuencia: "cada_semana", hora: 8, minuto: 0, diaSemana: 5,
        });
        expect(cron).toBe("0 8 * * 5");

        const programacion = programacionDesdeExpresionCron(cron);
        expect(programacion).toEqual({ frecuencia: "cada_semana", hora: 8, minuto: 0, diaSemana: 5 });
    });

    it("una expresión que no encaja con ningún preset cae a un valor por defecto razonable", () => {
        const programacion = programacionDesdeExpresionCron("1,2,3 4 5 6 *");
        expect(programacion.frecuencia).toBe("cada_dia");
    });
});

describe("descripcionFrecuencia", () => {
    it("describe cada_dia con la hora", () => {
        expect(descripcionFrecuencia("30 9 * * *")).toBe("Cada día a las 09:30");
    });

    it("describe cada_semana con el día y la hora", () => {
        expect(descripcionFrecuencia("0 8 * * 5")).toBe("Cada semana (Viernes) a las 08:00");
    });

    it("describe las frecuencias fijas sin hora", () => {
        expect(descripcionFrecuencia("*/5 * * * *")).toBe("Cada 5 minutos");
    });
});
