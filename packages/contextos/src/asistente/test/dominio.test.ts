import { describe, test, expect, vi } from "vitest";
import { ElementoMenu } from "@olula/lib/menu.ts";
import {
    construirCapacidades,
    construirUrlNavegacion,
    normalizarRespuestaIa,
} from "#/asistente/dominio.ts";

vi.mock("@olula/lib/dominio.ts", () => ({
    puede: (regla: string) => regla !== "ventas.factura.leer",
}));

// ---------------------------------------------------------------------------
// [asistente-dom-01] construirCapacidades filtra por descripcionIA y permiso
// ---------------------------------------------------------------------------

describe("[asistente-dom-01] construirCapacidades filtra por descripcionIA y permiso", () => {
    const menu: ElementoMenu[] = [
        {
            nombre: "Ventas",
            subelementos: [
                {
                    nombre: "Pedidos",
                    url: "/ventas/pedido",
                    regla: "ventas.pedido.leer",
                    descripcionIA: "Gestiona pedidos de venta",
                    parametrosIA: { cliente_id: "id del cliente" },
                },
                {
                    nombre: "Clientes",
                    url: "/ventas/cliente",
                    regla: "ventas.cliente.leer",
                },
                {
                    nombre: "Facturas",
                    url: "/ventas/factura",
                    regla: "ventas.factura.leer",
                    descripcionIA: "Gestiona facturas de venta",
                },
            ],
        },
    ];

    test("incluye solo las hojas con descripcionIA", () => {
        const capacidades = construirCapacidades(menu);
        expect(capacidades.map(c => c.ruta)).toEqual(["/ventas/pedido"]);
    });

    test("mapea descripcion y parametros correctamente", () => {
        const capacidades = construirCapacidades(menu);
        expect(capacidades[0]).toEqual({
            ruta: "/ventas/pedido",
            descripcion: "Gestiona pedidos de venta",
            parametros: { cliente_id: "id del cliente" },
            regla: "ventas.pedido.leer",
        });
    });

    test("excluye rutas con descripcionIA si el usuario no tiene permiso", () => {
        const capacidades = construirCapacidades(menu);
        expect(capacidades.some(c => c.ruta === "/ventas/factura")).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// [asistente-dom-03] normalizarRespuestaIa aplica valores por defecto
// ---------------------------------------------------------------------------

describe("[asistente-dom-03] normalizarRespuestaIa normaliza la respuesta cruda del backend", () => {
    test("rellena defaults cuando faltan campos opcionales", () => {
        const respuesta = normalizarRespuestaIa({ respuesta: "Hola", thread_id: "t-1" });
        expect(respuesta).toEqual({
            respuesta: "Hola",
            threadId: "t-1",
            a2uiMessages: [],
            capacidadesHash: null,
            necesitaCapacidades: false,
            accionNavegacion: null,
        });
    });

    test("preserva accion_navegacion y a2ui_messages cuando vienen informados", () => {
        const respuesta = normalizarRespuestaIa({
            respuesta: "Abro el pedido",
            thread_id: "t-2",
            a2ui_messages: [{ tipo: "surface" }],
            necesita_capacidades: true,
            accion_navegacion: { ruta: "/ventas/pedido", parametros: { cliente_id: "C001" } },
        });
        expect(respuesta.a2uiMessages).toEqual([{ tipo: "surface" }]);
        expect(respuesta.necesitaCapacidades).toBe(true);
        expect(respuesta.accionNavegacion).toEqual({ ruta: "/ventas/pedido", parametros: { cliente_id: "C001" } });
    });

    test("guarda tal cual el capacidades_hash calculado por el servidor", () => {
        const respuesta = normalizarRespuestaIa({
            respuesta: "Hola",
            thread_id: "t-3",
            capacidades_hash: "abc123",
        });
        expect(respuesta.capacidadesHash).toBe("abc123");
    });
});

// ---------------------------------------------------------------------------
// [asistente-dom-04] construirUrlNavegacion añade los parámetros como querystring
// ---------------------------------------------------------------------------

describe("[asistente-dom-04] construirUrlNavegacion añade los parámetros como querystring", () => {
    test("devuelve solo la ruta si no hay parámetros", () => {
        expect(construirUrlNavegacion({ ruta: "/ventas/pedido" })).toBe("/ventas/pedido");
    });

    test("devuelve solo la ruta si los parámetros están vacíos", () => {
        expect(construirUrlNavegacion({ ruta: "/ventas/pedido", parametros: {} })).toBe("/ventas/pedido");
    });

    test("añade los parámetros como querystring", () => {
        expect(construirUrlNavegacion({ ruta: "/ventas/pedido", parametros: { cliente_id: "C001" } }))
            .toBe("/ventas/pedido?cliente_id=C001");
    });

    test("descarta cualquier querystring que ya venga en la ruta (el LLM puede inventarse un placeholder)", () => {
        // Reproduce el bug real: el LLM generó enlaceFila.ruta="/ventas/pedido?id={id}",
        // y al concatenar el querystring propio (?id=13) el resultado era
        // "/ventas/pedido?id={id}?id=13" — todo eso se interpretaba como un único
        // parámetro "id" con valor literal "{id}?id=13".
        expect(construirUrlNavegacion({ ruta: "/ventas/pedido?id={id}", parametros: { id: "13" } }))
            .toBe("/ventas/pedido?id=13");
    });
});
