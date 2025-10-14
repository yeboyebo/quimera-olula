import { Historia, MetaHistorias } from "../historias/diseño.ts";
import { QDate } from "./qdate.tsx";

export default {
  grupo: "atomos",
  titulo: "qdate",
  attrs: {
    nombre: "fecha_inicio",
    label: "Fecha inicio",
    placeholder: "Introduce la fecha de inicio",
    textoValidacion: "Preferible a partir de 2026",
  },
  Componente: QDate,
} as unknown as MetaHistorias;

export const Base: Historia = {};

export const Validaciones: Historia = [
  {
    textoValidacion: "Debes elegir una fecha",
    erroneo: "true",
  },
  {
    valor: "2025-10-23",
    textoValidacion: "Vamos, puedes hacerlo mejor",
    advertido: "true",
  },
  {
    valor: "2026-04-14",
    textoValidacion: "Bien! Bonito día",
    valido: "true",
  },
];

export const Opcional: Historia = {
  opcional: "true",
};

export const Deshabilitado: Historia = {
  deshabilitado: "true",
};

export const Condensado: Historia = {
  condensado: "true",
};
