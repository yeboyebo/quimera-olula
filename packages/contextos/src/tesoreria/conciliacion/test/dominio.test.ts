import { paramsAsiento } from "#/tesoreria/conciliacion/casar_asiento/dominio.ts";
import { CandidatoConciliacion, Casacion, MovimientoBancario } from "#/tesoreria/conciliacion/diseño.ts";
import {
    casacionDesdeCandidato,
    etiquetaEstadoConCasaciones,
    filtroCuentaBanco,
    movimientoBancarioVacio,
    restoCasacionParcial,
    urlReciboCasacion,
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
    tipoCasacion: "cobrar_recibo_venta",
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
        expect(etiquetaEstadoConCasaciones(movimiento({ estado: "candidatos", numCasaciones: 1 }))).toBe("1 candidato");
        expect(etiquetaEstadoConCasaciones(movimiento({ estado: "candidatos", numCasaciones: 3 }))).toBe("3 candidatos");
        expect(etiquetaEstadoConCasaciones(movimiento({ estado: "conciliado" }))).toBe("Casado");
        expect(etiquetaEstadoConCasaciones(movimiento({ estado: "pendiente" }))).toBe("Pendiente");
    });
});

describe("casación a mano desde un recibo buscado", () => {
    test("un recibo por el importe del movimiento se casa entero", () => {
        expect(casacionDesdeCandidato(movimiento(), candidato())).toEqual({
            tipo: "cobrar_recibo_venta",
            params: { recibo_id: 7 },
        });
    });

    test("un recibo mayor se casa en parte, por el importe del movimiento", () => {
        const mayor = candidato({ tipoCasacion: "cobro_parcial_venta", importe: 500 });

        expect(casacionDesdeCandidato(movimiento(), mayor)).toEqual({
            tipo: "cobro_parcial_venta",
            params: { recibo_id: 7, importe: "300.00" },
        });
        expect(restoCasacionParcial(movimiento(), 500)).toBe(200);
    });

    test("en un cargo el importe parcial va en positivo", () => {
        const mayor = candidato({ tipoRecibo: "pago", tipoCasacion: "pago_parcial_compra", importe: 100 });

        expect(casacionDesdeCandidato(movimiento({ importe: -40.5 }), mayor).params)
            .toEqual({ recibo_id: 7, importe: "40.50" });
        expect(restoCasacionParcial(movimiento({ importe: -40.5 }), 100)).toBe(59.5);
    });
});

describe("enlaces al recibo", () => {
    test("según la clase de recibo de la casación", () => {
        expect(urlReciboMovimientoBancario(movimiento({ tipoCasacion: "pago_parcial_compra", reciboId: "9" })))
            .toBe("/tesoreria/recibo_compra?id=9");
        expect(urlReciboMovimientoBancario(movimiento({ tipoCasacion: "asiento_manual" }))).toBeNull();

        const casacion: Casacion = {
            id: "c1", tipo: "cobrar_recibo_venta", params: { recibo_id: 7 }, probabilidad: 60,
            origen: "determinista", justificacion: null,
            recibo: { id: "7", codigo: "R", tercero: null, importe: 1, fechaVencimiento: new Date(), estado: "Emitido" },
            cuota: null,
        };
        expect(urlReciboCasacion(casacion)).toBe("/tesoreria/recibo_venta?id=7");
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
