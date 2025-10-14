import { Historia, MetaHistorias } from "../historias/diseño.ts";
import { QBoton } from "./qboton.tsx";

export default {
  grupo: "atomos",
  titulo: "qboton",
  Componente: QBoton,
} as MetaHistorias;

export const Base: Historia = {
  children: "Botón Base",
};

export const Variantes: Historia = [
  {
    variante: "solido",
    children: "Sólido",
  },
  {
    variante: "borde",
    children: "Borde",
  },
  {
    variante: "texto",
    children: "Texto",
  },
];

export const Destructivo: Historia = [
  {
    destructivo: "true",
    variante: "solido",
    children: "Sólido",
  },
  {
    destructivo: "true",
    variante: "borde",
    children: "Borde",
  },
  {
    destructivo: "true",
    variante: "texto",
    children: "Texto",
  },
];

export const Deshabilitado: Historia = [
  {
    deshabilitado: "true",
    variante: "solido",
    children: "Sólido",
  },
  {
    deshabilitado: "true",
    variante: "borde",
    children: "Borde",
  },
  {
    deshabilitado: "true",
    variante: "texto",
    children: "Texto",
  },
];

export const Tamaños: Historia = [
  {
    tamaño: "pequeño",
    children: "Pequeño",
  },
  {
    tamaño: "mediano",
    children: "Mediano",
  },
  {
    tamaño: "grande",
    children: "Grande",
  },
];
