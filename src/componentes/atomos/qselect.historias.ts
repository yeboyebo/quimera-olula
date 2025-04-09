import { Historia, MetaHistorias } from "../historias/diseño.ts";
import { QSelect } from "./qselect.tsx";

const opciones = [
  { valor: "ES", descripcion: "España" },
  { valor: "PT", descripcion: "Portugal" },
  { valor: "FR", descripcion: "Francia" },
  { valor: "IT", descripcion: "Italia" },
  { valor: "DE", descripcion: "Alemania" },
  { valor: "GB", descripcion: "Reino Unido" },
  { valor: "US", descripcion: "Estados Unidos" },
  { valor: "AR", descripcion: "Argentina" },
  { valor: "BR", descripcion: "Brasil" },
  { valor: "MX", descripcion: "México" },
];

export default {
  grupo: "atomos",
  titulo: "qselect",
  attrs: {
    nombre: "codpais",
    label: "País",
    placeholder: "Elige un país de destino",
    textoValidacion: "Se recomienda un país europeo",
    opciones: opciones,
  },
  Componente: QSelect,
} as unknown as MetaHistorias;

export const Base: Historia = {};

export const Validaciones: Historia = [
  {
    textoValidacion: "Debes elegir un país",
    erroneo: "true",
  },
  {
    valor: "MX",
    advertido: "true",
  },
  {
    valor: "IT",
    textoValidacion: "Bien! Buen sitio",
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
