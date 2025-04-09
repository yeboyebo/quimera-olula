import { Historia, MetaHistorias } from "../historias/diseño.ts";
import { QInput } from "./qinput.tsx";

export default {
  grupo: "atomos",
  titulo: "qinput",
  attrs: {
    nombre: "nombre",
    label: "Nombre",
    placeholder: "Introduce tu nombre",
    textoValidacion: "Mínimo 8 caracteres",
  },
  Componente: QInput,
} as unknown as MetaHistorias;

export const Base: Historia = {};

export const Validaciones: Historia = [
  {
    textoValidacion: "Este campo es requerido",
    erroneo: "true",
  },
  {
    valor: "Joze Baría",
    textoValidacion: "Vamos, puedes hacerlo mejor",
    advertido: "true",
  },
  {
    valor: "Jose María",
    textoValidacion: "Bien! Nombre correcto",
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
