import { beforeEach, describe, expect, test, vi } from "vitest";

const post = vi.fn(
    async (_url: string, _body: unknown, _msg?: string) => ({ ids: ["lin-1"] })
);

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        post: (url: string, body: unknown, msg?: string) => post(url, body, msg),
    },
}));

const { postLinea } = await import("#/ventas/pedido/infraestructura.ts");

const cuerpoEnviado = () =>
    (post.mock.calls[0][1] as { lineas: Record<string, unknown>[] }).lineas[0];

describe("postLinea del pedido adapta el payload a cada forma", () => {
    beforeEach(() => post.mockClear());

    test("la línea de catálogo manda articulo_id y cantidad", async () => {
        await postLinea("ped-1", { referencia: "ART-001", cantidad: 3 });

        expect(cuerpoEnviado()).toEqual({ articulo_id: "ART-001", cantidad: 3 });
    });

    test("la línea libre manda descripción y pvp, sin articulo_id", async () => {
        await postLinea("ped-1", {
            descripcion: "Mano de obra",
            cantidad: 2,
            pvp_unitario: 50,
        });

        expect(cuerpoEnviado()).toEqual({
            descripcion: "Mano de obra",
            cantidad: 2,
            pvp_unitario: 50,
        });
        expect(cuerpoEnviado()).not.toHaveProperty("articulo_id");
    });
});
