import {
    etiquetaNodo,
    grafoDesdeTraza,
    layoutPorColumnas,
    resumenDocumento,
    urlDocumento,
} from "#/comun/componentes/traza/dominio.ts";
import { DatosDocumentoTraza, TipoDocumentoTraza } from "#/comun/componentes/traza/diseño.ts";
import { describe, expect, test } from "vitest";

const doc = (
    tipo: TipoDocumentoTraza,
    id: string,
    codigo: string,
    extra: Partial<DatosDocumentoTraza> = {}
): DatosDocumentoTraza => ({
    tipo,
    id,
    codigo,
    visible: true,
    fecha: "2026-09-01",
    ...extra,
});

// Factura con un albarán que agrupa dos pedidos; el primero viene de un
// presupuesto. La factura tiene un recibo con un pago.
const trazaFactura = {
    factura: doc("factura_venta", "10", "F-10"),
    albaranes: [
        {
            albaran: doc("albaran_venta", "20", "A-20"),
            pedidos: [
                {
                    pedido: doc("pedido_venta", "32", "P-32"),
                    presupuestos: [],
                },
                {
                    pedido: doc("pedido_venta", "31", "P-31"),
                    presupuestos: [{ presupuesto: doc("presupuesto_venta", "40", "PR-40") }],
                },
            ],
        },
    ],
    recibos: [
        {
            recibo: doc("recibo_cobro", "50", "R-50"),
            pagos: [
                { pago: doc("pago_cobro", "60", "R-50", { tipo_pago: "Pago", fecha: "2026-09-15" }) },
            ],
        },
    ],
};

describe("grafoDesdeTraza", () => {
    test("la raíz es el documento del que se pide la traza", () => {
        const grafo = grafoDesdeTraza(trazaFactura);

        expect(grafo.raiz).toBe("factura_venta:10");
    });

    test("incluye un nodo por documento", () => {
        const grafo = grafoDesdeTraza(trazaFactura);

        expect(grafo.nodos.map((nodo) => nodo.clave).sort()).toEqual([
            "albaran_venta:20",
            "factura_venta:10",
            "pago_cobro:60",
            "pedido_venta:31",
            "pedido_venta:32",
            "presupuesto_venta:40",
            "recibo_cobro:50",
        ]);
    });

    test("las aristas van siempre del documento de origen al generado", () => {
        const grafo = grafoDesdeTraza(trazaFactura);

        expect(grafo.aristas).toContainEqual({ desde: "albaran_venta:20", hasta: "factura_venta:10" });
        expect(grafo.aristas).toContainEqual({ desde: "pedido_venta:31", hasta: "albaran_venta:20" });
        expect(grafo.aristas).toContainEqual({ desde: "presupuesto_venta:40", hasta: "pedido_venta:31" });
        expect(grafo.aristas).toContainEqual({ desde: "factura_venta:10", hasta: "recibo_cobro:50" });
        expect(grafo.aristas).toContainEqual({ desde: "recibo_cobro:50", hasta: "pago_cobro:60" });
        expect(grafo.aristas).toHaveLength(6);
    });

    test("un documento al que se llega por dos caminos es un solo nodo", () => {
        // Desde un presupuesto, dos pedidos que acaban en el mismo albarán.
        const albaran = { albaran: doc("albaran_venta", "20", "A-20"), facturas: [] };
        const grafo = grafoDesdeTraza({
            presupuesto: doc("presupuesto_venta", "40", "PR-40"),
            pedidos: [
                { pedido: doc("pedido_venta", "31", "P-31"), albaranes: [albaran] },
                { pedido: doc("pedido_venta", "32", "P-32"), albaranes: [albaran] },
            ],
        });

        expect(grafo.nodos.filter((nodo) => nodo.clave === "albaran_venta:20")).toHaveLength(1);
        expect(grafo.aristas).toHaveLength(4);
    });

    test("sin datos de documento no hay grafo", () => {
        expect(() => grafoDesdeTraza({ albaranes: [] })).toThrow();
    });
});

describe("layoutPorColumnas", () => {
    test("solo aparecen las columnas con documentos, en orden de la cadena", () => {
        const columnas = layoutPorColumnas(grafoDesdeTraza(trazaFactura));

        expect(columnas.map((columna) => columna.titulo)).toEqual([
            "Presupuestos",
            "Pedidos",
            "Albaranes",
            "Facturas",
            "Recibos",
            "Pagos",
        ]);
    });

    test("dentro de una columna los documentos van por código", () => {
        const columnas = layoutPorColumnas(grafoDesdeTraza(trazaFactura));

        const pedidos = columnas.find((columna) => columna.id === "pedido");
        expect(pedidos?.nodos.map((nodo) => nodo.datos.codigo)).toEqual(["P-31", "P-32"]);
    });

    test("un documento se coloca a la altura de su padre, no arriba del todo", () => {
        const columnas = layoutPorColumnas(
            grafoDesdeTraza({
                albaran: doc("albaran_venta", "1", "A-1"),
                facturas: [
                    { factura: doc("factura_venta", "11", "F-11"), recibos: [] },
                    { factura: doc("factura_venta", "12", "F-12"), recibos: [] },
                    {
                        factura: doc("factura_venta", "13", "F-13"),
                        recibos: [{ recibo: doc("recibo_cobro", "21", "R-21") }],
                    },
                ],
            })
        );

        const fila = (id: string, codigo: string) =>
            columnas.find((columna) => columna.id === id)?.nodos.find((nodo) => nodo.datos.codigo === codigo)?.fila;
        expect(fila("factura", "F-13")).toBe(2);
        expect(fila("recibo", "R-21")).toBe(2);
    });

    test("un documento con varios padres queda entre ellos y un hijo único se centra", () => {
        const columnas = layoutPorColumnas(
            grafoDesdeTraza({
                factura: doc("factura_venta", "10", "F-10"),
                albaranes: [
                    { albaran: doc("albaran_venta", "1", "A-1") },
                    { albaran: doc("albaran_venta", "2", "A-2") },
                ],
            })
        );

        expect(columnas.find((columna) => columna.id === "factura")?.nodos[0].fila).toBe(0.5);
    });

    test("dos documentos que quieren la misma fila no se solapan", () => {
        const columnas = layoutPorColumnas(
            grafoDesdeTraza({
                factura: doc("factura_venta", "10", "F-10"),
                recibos: [
                    { recibo: doc("recibo_cobro", "2", "R-2") },
                    { recibo: doc("recibo_cobro", "1", "R-1") },
                ],
            })
        );

        const recibos = columnas.find((columna) => columna.id === "recibo")?.nodos;
        expect(recibos?.map((nodo) => [nodo.datos.codigo, nodo.fila])).toEqual([
            ["R-1", 0],
            ["R-2", 1],
        ]);
    });

    test("compras usa las mismas columnas que ventas", () => {
        const columnas = layoutPorColumnas(
            grafoDesdeTraza({
                albaran: doc("albaran_compra", "1", "AC-1"),
                pedidos: [{ pedido: doc("pedido_compra", "2", "PC-2") }],
                facturas: [],
            })
        );

        expect(columnas.map((columna) => columna.id)).toEqual(["pedido", "albaran"]);
    });
});

describe("etiquetaNodo", () => {
    test("un pago se nombra por su tipo y fecha", () => {
        expect(etiquetaNodo(doc("pago_cobro", "60", "R-50", { tipo_pago: "Devolución", fecha: "2026-09-15" })))
            .toBe("Devolución 15/09/2026");
    });

    test("el resto de documentos, por su código", () => {
        expect(etiquetaNodo(doc("factura_venta", "10", "F-10"))).toBe("F-10");
    });
});

describe("resumenDocumento", () => {
    test("un documento de venta muestra cliente, fecha y total", () => {
        const resumen = resumenDocumento(
            doc("factura_venta", "10", "F-10", {
                cliente_id: "C1",
                nombre_cliente: "Cliente Uno",
                total: 121,
                divisa_id: "EUR",
            })
        );

        expect(resumen).toContainEqual({ etiqueta: "Cliente", valor: "C1 · Cliente Uno" });
        expect(resumen).toContainEqual({ etiqueta: "Fecha", valor: "01/09/2026" });
        expect(resumen.find((dato) => dato.etiqueta === "Total")?.valor).toContain("121");
    });

    test("un documento de compra muestra el proveedor", () => {
        const resumen = resumenDocumento(
            doc("pedido_compra", "2", "PC-2", {
                proveedor_id: "P1",
                nombre_proveedor: "Proveedor Uno",
                recibido: "Parcial",
            })
        );

        expect(resumen).toContainEqual({ etiqueta: "Proveedor", valor: "P1 · Proveedor Uno" });
        expect(resumen).toContainEqual({ etiqueta: "Recibido", valor: "Parcial" });
    });

    test("un presupuesto muestra su estado de aprobación", () => {
        const resumen = resumenDocumento(doc("presupuesto_venta", "40", "PR-40", { estado_aprobado: "TOTAL" }));

        expect(resumen).toContainEqual({ etiqueta: "Aprobación", valor: "Aprobado" });
    });

    test("un documento no visible no muestra datos", () => {
        expect(resumenDocumento(doc("albaran_venta", "20", "A-20", { visible: false, fecha: null }))).toEqual([]);
    });

    test("no muestra los datos que no vienen", () => {
        const resumen = resumenDocumento(doc("albaran_venta", "20", "A-20", { fecha: null }));

        expect(resumen.map((dato) => dato.etiqueta)).not.toContain("Fecha");
    });
});

describe("urlDocumento", () => {
    test("cada tipo abre su maestro con el id", () => {
        expect(urlDocumento("factura_venta", "10")).toBe("/ventas/factura?id=10");
        expect(urlDocumento("albaran_compra", "3")).toBe("/compras/albaran?id=3");
        expect(urlDocumento("recibo_cobro", "50")).toBe("/tesoreria/recibo_venta?id=50");
        expect(urlDocumento("recibo_pago", "51")).toBe("/tesoreria/recibo_compra?id=51");
    });

    test("un pago no tiene pantalla propia", () => {
        expect(urlDocumento("pago_cobro", "60")).toBeNull();
    });

    test("la app puede cambiar la url de un tipo", () => {
        expect(urlDocumento("factura_venta", "10", { factura_venta: (id) => `/otra/${id}` }))
            .toBe("/otra/10");
    });

    test("la app puede dejar un tipo sin pantalla", () => {
        expect(urlDocumento("recibo_cobro", "50", { recibo_cobro: null })).toBeNull();
    });
});
