import { procesarEvento } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { describe, expect, test } from "vitest";
import {
    Contexto,
    getMaquina,
} from "../maquina_listado_transferencias_stock.ts";

const contextoInicial: Contexto = {
    estado: "INICIAL",
    transferencias: listaActivaEntidadesInicial(),
};

describe("Maquina Listado de transferencias", () => {
    test("debe comenzar vacía e inactiva", () => {
        expect(contextoInicial.estado).toBe("INICIAL");
        expect(contextoInicial.transferencias.lista.length).toBe(0);
    });

    test("añadir transferencia", async () => {
        const maquina = getMaquina();
        const [ctxCreando] = await procesarEvento(maquina, contextoInicial, "crear", undefined);
        const [ctxFinal] = await procesarEvento(maquina, ctxCreando, "transferencia_creada", {
            id: "20250A001",
            origen: "Alm1",
            destino: "Alm2",
            nombre_origen: "Almacén 1",
            nombre_destino: "Almacén 2",
            fecha: "2025-12-03",
        });

        expect(ctxFinal.estado).toBe("INICIAL");
        expect(ctxFinal.transferencias.lista.length).toBe(1);
        expect(ctxFinal.transferencias.lista[0].id).toBe("20250A001");
    });
});
