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

export const AutoSeleccion: Historia = [{
  valor: "Jose Luis Martínez",
  textoValidacion: "Sin autoselección",
}, {
  valor: "Jose Luis Martínez",
  textoValidacion: "Con autoselección",
  autoSeleccion: "true",
}];

export const Tipos: Historia = [{
  nombre: "numero",
  tipo: "numero",
  label: "Número",
  textoValidacion: undefined,
  placeholder: "Introduce un número",
}, {
  nombre: "contraseña",
  tipo: "contraseña",
  label: "Contraseña",
  textoValidacion: undefined,
  placeholder: "Introduce tu contraseña",
}, {
  nombre: "color",
  tipo: "color",
  label: "Color",
  textoValidacion: undefined,
  placeholder: undefined,
}, {
  nombre: "fichero",
  tipo: "fichero",
  label: "Fichero",
  textoValidacion: undefined,
  placeholder: undefined,
},];
