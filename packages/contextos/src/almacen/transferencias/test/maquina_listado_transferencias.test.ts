import { pipe } from "@olula/lib/funcional.js";
import { Maquina3, OnEvento3 } from "@olula/lib/useMaquina.js";
import { describe, expect, test } from "vitest";
import { configMaquina, Contexto, Estado } from "../maquina_listado_transferencias_stock.ts";

type Maquina = Maquina3<Estado, Contexto>;

const setEstado = (estado: Estado) => (maquina: Maquina) => ({ ...maquina, estado });
const publicar = () => { };

const probarFn = ({ fn, payload }: { fn: Estado | OnEvento3<Estado, Contexto>, payload?: unknown }) => (maquina: Maquina): Maquina => (fn as OnEvento3<Estado, Contexto>)({ maquina, payload, setEstado, publicar })!;

const { inicial, estados } = configMaquina;

describe("Maquina Listado de transferencias", () => {
    test("debe comenzar vacía e inactiva", () => {
        pipe(
            inicial,
            ({ estado, contexto: { transferencias } }: Maquina) => {
                expect(estado).toBe("Inactivo");
                expect(transferencias.lista.length).toBe(0);
            }
        )
    });

    test("añadir transferencia", () => {
        pipe(
            inicial,
            setEstado(estados.Inactivo.crear as Estado),
            probarFn({
                fn: estados.Creando.transferencia_creada,
                payload: {
                    id: "20250A001",
                    origen: "Alm1",
                    destino: "Alm2",
                    nombre_origen: "Almacén 1",
                    nombre_destino: "Almacén 2",
                    fecha: "2025-12-03",
                }
            }),
            ({ estado, contexto: { transferencias } }: Maquina) => {
                expect(estado).toBe("Inactivo");
                expect(transferencias.lista.length).toBe(1);
                expect(transferencias.lista[0].id).toBe("20250A001");
            }
        );
    })
});
