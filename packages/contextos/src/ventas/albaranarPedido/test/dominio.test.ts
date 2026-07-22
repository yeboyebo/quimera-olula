// import { describe, expect, test } from "vitest";
// import {
//   calcularAEnviar,
//   calcularDisponible,
//   lineaAprobadaCompleta,
//   obtenerClaseEstadoAlbaranado,
//   transformarLineasAlbaran,
// } from "../dominio.ts";
// import { aprobarLinea } from "../detalle/dominio.ts";
// import { ContextoAlbaranarPedido } from "../detalle/diseño.ts";
// import { LineaAlbaranarPedido } from "../diseño.ts";

// const linea = (parcial: Partial<LineaAlbaranarPedido>): LineaAlbaranarPedido =>
//   ({
//     id: "L1",
//     cantidad: 10,
//     servida: 0,
//     ...parcial,
//   }) as LineaAlbaranarPedido;

// describe("calcularAEnviar", () => {
//   test("usa la suma de tramos cuando hay tramos", () => {
//     const l = linea({
//       a_enviar: 99,
//       tramos: [
//         { id: "t1", cantidad: 3 },
//         { id: "t2", cantidad: 4 },
//       ],
//     });
//     expect(calcularAEnviar(l)).toBe(7);
//   });

//   test("usa a_enviar cuando no hay tramos", () => {
//     expect(calcularAEnviar(linea({ a_enviar: 5, tramos: [] }))).toBe(5);
//     expect(calcularAEnviar(linea({ a_enviar: 5 }))).toBe(5);
//   });

//   test("es 0 si no hay ni tramos ni a_enviar", () => {
//     expect(calcularAEnviar(linea({}))).toBe(0);
//   });
// });

// describe("calcularDisponible", () => {
//   test("resta servida y a enviar de la cantidad", () => {
//     expect(calcularDisponible(linea({ cantidad: 10, servida: 2, a_enviar: 3 }))).toBe(5);
//   });

//   test("con tramos usa su suma como a enviar", () => {
//     const l = linea({
//       cantidad: 10,
//       servida: 1,
//       tramos: [{ id: "t1", cantidad: 4 }],
//     });
//     expect(calcularDisponible(l)).toBe(5);
//   });
// });

// describe("transformarLineasAlbaran", () => {
//   test("suma tramos cuando existen", () => {
//     const res = transformarLineasAlbaran([
//       linea({
//         id: "L1",
//         tramos: [
//           { id: "t1", cantidad: 2 },
//           { id: "t2", cantidad: 3 },
//         ],
//       }),
//     ]);
//     expect(res).toEqual([{ id: "L1", cantidad: 5, lotes: [] }]);
//   });

//   test("usa a_enviar cuando no hay tramos", () => {
//     const res = transformarLineasAlbaran([linea({ id: "L2", a_enviar: 4 })]);
//     expect(res).toEqual([{ id: "L2", cantidad: 4, lotes: [] }]);
//   });

//   test("filtra las líneas con cantidad 0", () => {
//     const res = transformarLineasAlbaran([
//       linea({ id: "L1", a_enviar: 0 }),
//       linea({ id: "L2", a_enviar: 3 }),
//       linea({ id: "L3", tramos: [] }),
//     ]);
//     expect(res).toEqual([{ id: "L2", cantidad: 3, lotes: [] }]);
//   });
// });

// describe("obtenerClaseEstadoAlbaranado", () => {
//   test("cerrada tiene prioridad", () => {
//     expect(
//       obtenerClaseEstadoAlbaranado(linea({ cerrada: true, a_enviar: 5 }))
//     ).toBe("cerrada");
//   });

//   test("completa cuando a_enviar cubre toda la cantidad sin servir", () => {
//     expect(
//       obtenerClaseEstadoAlbaranado(linea({ cantidad: 10, servida: 0, a_enviar: 10 }))
//     ).toBe("completa");
//   });

//   test("modificada cuando es parcial", () => {
//     expect(
//       obtenerClaseEstadoAlbaranado(linea({ cantidad: 10, servida: 0, a_enviar: 3 }))
//     ).toBe("modificada");
//   });

//   test("vacía cuando no hay nada que enviar", () => {
//     expect(
//       obtenerClaseEstadoAlbaranado(linea({ cantidad: 10, servida: 0, a_enviar: 0 }))
//     ).toBe("");
//   });
// });

// describe("lineaAprobadaCompleta", () => {
//   test("verdadera cuando a_enviar cubre el disponible restante (con servida)", () => {
//     expect(
//       lineaAprobadaCompleta(linea({ cantidad: 10, servida: 4, a_enviar: 6 }))
//     ).toBe(true);
//   });

//   test("verdadera cuando a_enviar = cantidad completa", () => {
//     expect(
//       lineaAprobadaCompleta(linea({ cantidad: 10, servida: 0, a_enviar: 10 }))
//     ).toBe(true);
//   });

//   test("falsa cuando es parcial", () => {
//     expect(
//       lineaAprobadaCompleta(linea({ cantidad: 10, servida: 0, a_enviar: 3 }))
//     ).toBe(false);
//   });

//   test("falsa cuando no hay nada a enviar", () => {
//     expect(lineaAprobadaCompleta(linea({ cantidad: 10, a_enviar: 0 }))).toBe(false);
//   });
// });

// describe("aprobarLinea", () => {
//   const contexto = (lineas: LineaAlbaranarPedido[]): ContextoAlbaranarPedido =>
//     ({
//       estado: "LISTO",
//       pedido: { id: "P1" },
//       lineas: { lista: lineas, idActivo: null },
//     }) as unknown as ContextoAlbaranarPedido;

//   test("pone a_enviar = cantidad - servida y un único tramo completo", async () => {
//     const ctx = contexto([linea({ id: "L1", cantidad: 10, servida: 3 })]);
//     const res = (await aprobarLinea(ctx, "L1")) as ContextoAlbaranarPedido;
//     const l = res.lineas.lista[0];
//     expect(l.a_enviar).toBe(7);
//     expect(l.tramos).toEqual([{ id: "L1-aprobado", cantidad: 7 }]);
//   });

//   test("solo modifica la línea indicada", async () => {
//     const ctx = contexto([
//       linea({ id: "L1", cantidad: 10, servida: 0 }),
//       linea({ id: "L2", cantidad: 5, servida: 0, a_enviar: 2 }),
//     ]);
//     const res = (await aprobarLinea(ctx, "L1")) as ContextoAlbaranarPedido;
//     expect(res.lineas.lista[0].a_enviar).toBe(10);
//     expect(res.lineas.lista[1].a_enviar).toBe(2);
//   });
// });
