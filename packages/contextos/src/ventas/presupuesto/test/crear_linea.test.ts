import {
    metaNuevaLinea,
    nuevaLineaInicial,
} from "#/ventas/presupuesto/crear_linea/dominio.ts";
import { NuevaLineaVentaApiReq, NuevaLineaVentaApiRes } from "#/ventas/venta/infraestructura.ts";
import { modeloEsValido } from "@olula/lib/dominio.ts";
import { beforeEach, describe, expect, test, vi } from "vitest";

const respuestaLinea: NuevaLineaVentaApiRes = {
    id: "lin-1",
    articulo_id: null,
    descripcion: "",
    cantidad: 1,
    pvp_unitario: 0,
    pvp_total: 0,
    dto_porcentual: 0,
    dto_lineal: 0,
    grupo_iva_producto_id: "",
    tipo_iva: 0,
    tipo_recargo: 0,
    tipo_irpf: 0,
    iva_incluido: false,
};

const post = vi.fn(
    async (_url: string, _body: unknown, _msg?: string) => [respuestaLinea]
);

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        post: (url: string, body: unknown, msg?: string) => post(url, body, msg),
    },
}));

const { postLinea } = await import("#/ventas/presupuesto/infraestructura.ts");

const cuerpoEnviado = () =>
    (post.mock.calls[0][1] as { lineas: NuevaLineaVentaApiReq[] }).lineas[0];

describe("postLinea adapta el payload a cada forma", () => {
    beforeEach(() => post.mockClear());

    test("la línea de catálogo manda articulo.articulo_id y cantidad aparte", async () => {
        await postLinea("pre-1", { ...nuevaLineaInicial, idArticulo: "ART-001", pvpUnitario: null, cantidad: 3 });

        expect(cuerpoEnviado()).toEqual(expect.objectContaining({
            articulo: { articulo_id: "ART-001" },
            cantidad: 3,
        }));
    });

    test("la línea libre manda descripción y pvp en articulo, sin articulo_id", async () => {
        await postLinea("pre-1", {
            ...nuevaLineaInicial,
            idArticulo: null,
            descripcion: "Mano de obra",
            pvpUnitario: 50,
            cantidad: 2,
        });

        expect(cuerpoEnviado()).toEqual(expect.objectContaining({
            articulo: { descripcion: "Mano de obra", pvp_unitario: 50 },
            cantidad: 2,
        }));
        expect(cuerpoEnviado().articulo).not.toHaveProperty("articulo_id");
    });

    test("devuelve el id que responde el servidor", async () => {
        const resultado = await postLinea("pre-1", { ...nuevaLineaInicial, idArticulo: "ART-001", pvpUnitario: null, cantidad: 1 });
        expect(resultado).toHaveProperty("id");
    });
});

describe("validación de la nueva línea", () => {
    const valido = modeloEsValido(metaNuevaLinea);

    test("un pvp de 0 es válido en una línea libre", () => {
        expect(valido({ ...nuevaLineaInicial, idArticulo: null, descripcion: "Portes", pvpUnitario: 0 })).toBe(true);
    });

    test("sin descripción no vale en línea libre", () => {
        expect(valido({ ...nuevaLineaInicial, idArticulo: null, descripcion: "", pvpUnitario: 15 })).toBe(false);
    });

    test("sin idArticulo ni descripción no vale", () => {
        expect(valido({ ...nuevaLineaInicial, idArticulo: null, descripcion: null, pvpUnitario: 15 })).toBe(false);
    });
});
