import { paramsAsiento } from "#/tesoreria/conciliacion/conciliar_asiento/dominio.ts";
import { CandidatoConciliacion, ItemConciliacion, MovimientoBancario } from "#/tesoreria/conciliacion/diseño.ts";
import {
    conciliacionDesdeCandidato,
    etiquetaEstadoConConciliaciones,
    filtroCuentaBanco,
    movimientoBancarioVacio,
    restoConciliacionParcial,
    urlReciboConciliacion,
    urlReciboMovimientoBancario,
    varianteEstadoMovimientoBancario,
    varianteProbabilidad,
} from "#/tesoreria/conciliacion/dominio.ts";
import { describe, expect, test } from "vitest";

const movimiento = (cambios: Partial<MovimientoBancario> = {}): MovimientoBancario => ({
    ...movimientoBancarioVacio,
    id: "m1",
    importe: 300,
    ...cambios,
});

const candidato = (cambios: Partial<CandidatoConciliacion> = {}): CandidatoConciliacion => ({
    id: "cobro_7",
    tipoRecibo: "cobro",
    tipoConciliacion: "cobrar_recibo_venta",
    reciboId: "7",
    codigo: "F2026A00001-01",
    facturaCodigo: "F2026A00001",
    tercero: "Cliente",
    idFiscal: null,
    importe: 300,
    fechaVencimiento: new Date("2026-10-01"),
    estado: "Emitido",
    diasDiferencia: 0,
    ...cambios,
});

describe("estado del movimiento en la lista", () => {
    test("casado en verde, con candidatos en naranja y pendiente en rojo", () => {
        expect(varianteEstadoMovimientoBancario("conciliado")).toBe("exito");
        expect(varianteEstadoMovimientoBancario("candidatos")).toBe("advertencia");
        expect(varianteEstadoMovimientoBancario("pendiente")).toBe("error");
    });

    test("con candidatos indica cuántos hay", () => {
        expect(etiquetaEstadoConConciliaciones(movimiento({ estado: "candidatos", numConciliaciones: 1 }))).toBe("1 candidato");
        expect(etiquetaEstadoConConciliaciones(movimiento({ estado: "candidatos", numConciliaciones: 3 }))).toBe("3 candidatos");
        expect(etiquetaEstadoConConciliaciones(movimiento({ estado: "conciliado" }))).toBe("Casado");
        expect(etiquetaEstadoConConciliaciones(movimiento({ estado: "pendiente" }))).toBe("Pendiente");
    });
});

describe("conciliación a mano desde un recibo buscado", () => {
    test("un recibo por el importe del movimiento se casa entero", () => {
        const item = conciliacionDesdeCandidato(movimiento(), candidato());
        expect(item.tipo).toBe("cobrar_recibo_venta");
        expect(item.params).toEqual({ recibo_id: 7 });
        expect(item.recibo?.codigo).toBe("F2026A00001-01");
        expect(item.cuota).toBeNull();
    });

    test("un recibo mayor se casa en parte, por el importe del movimiento", () => {
        const mayor = candidato({ tipoConciliacion: "cobro_parcial_venta", importe: 500 });
        const item = conciliacionDesdeCandidato(movimiento(), mayor);

        expect(item.tipo).toBe("cobro_parcial_venta");
        expect(item.params).toEqual({ recibo_id: 7, importe: "300.00" });
        expect(restoConciliacionParcial(movimiento(), 500)).toBe(200);
    });

    test("en un cargo el importe parcial va en positivo", () => {
        const mayor = candidato({ tipoRecibo: "pago", tipoConciliacion: "pago_parcial_compra", importe: 100 });

        expect(conciliacionDesdeCandidato(movimiento({ importe: -40.5 }), mayor).params)
            .toEqual({ recibo_id: 7, importe: "40.50" });
        expect(restoConciliacionParcial(movimiento({ importe: -40.5 }), 100)).toBe(59.5);
    });
});

describe("enlaces al recibo", () => {
    test("el movimiento ya no lleva URL del recibo (los ítems están en el endpoint de conciliaciones)", () => {
        expect(urlReciboMovimientoBancario(movimiento())).toBeNull();
    });

    test("urlReciboConciliacion genera la URL a partir del ítem y su recibo", () => {
        const itemCobro: ItemConciliacion = {
            tipo: "cobrar_recibo_venta",
            params: { recibo_id: 7 },
            recibo: { id: "7", codigo: "R", tercero: null, importe: 1, fechaVencimiento: new Date(), estado: "Emitido" },
            cuota: null,
        };
        expect(urlReciboConciliacion(itemCobro)).toBe("/tesoreria/recibo_venta?id=7");

        const itemAsiento: ItemConciliacion = {
            tipo: "asiento_manual",
            params: {},
            recibo: null,
            cuota: null,
        };
        expect(urlReciboConciliacion(itemAsiento)).toBeNull();
    });
});

describe("probabilidad y filtros", () => {
    test("la probabilidad de conciliar sin preguntar sale en verde", () => {
        expect(varianteProbabilidad(95)).toBe("exito");
        expect(varianteProbabilidad(75)).toBe("advertencia");
        expect(varianteProbabilidad(40)).toBe("gris");
    });

    test("filtro de los movimientos de una cuenta", () => {
        expect(filtroCuentaBanco("000001")).toEqual(["cuenta_banco_id", "=", "000001"]);
    });

    test("los datos del asiento van a la API en snake_case y sin espacios", () => {
        expect(paramsAsiento({ codigoSubcuenta: " 6260000000 ", concepto: "Comisión " }))
            .toEqual({ codigo_subcuenta: "6260000000", concepto: "Comisión" });
    });
});
