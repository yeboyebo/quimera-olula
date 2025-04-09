import { Historia, MetaHistorias } from "../historias/diseño.ts";
import { QCheckbox } from "./qcheckbox.tsx";

export default {
  grupo: "atomos",
  titulo: "qcheckbox",
  attrs: {
    nombre: "privacidad",
    label: "He leído y acepto la política de privacidad",
    textoValidacion: "Debe aceptar la política de privacidad",
  },
  Componente: QCheckbox,
} as unknown as MetaHistorias;

export const Base: Historia = {};

export const Validaciones: Historia = [
  {
    textoValidacion: "Este campo es requerido",
    erroneo: "true",
  },
  {
    textoValidacion: "Vamos, es recomendable que lo aceptes",
    advertido: "true",
  },
  {
    valor: true,
    textoValidacion: "Bien! Te hemos engañado",
    valido: "true",
  },
];

export const Opcional: Historia = {
  opcional: "true",
};

export const Deshabilitado: Historia = {
  deshabilitado: "true",
  valor: true,
  textoValidacion: "",
};

export const Condensado: Historia = {
  condensado: "true",
};
