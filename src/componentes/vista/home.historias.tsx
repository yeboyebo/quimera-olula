import { ReactNode } from "react";
import "../../contextos/comun/historias.css";
import { Indice } from "../../contextos/comun/Indice";
import { Historia, MetaHistorias } from "../historias/diseño";
import { Vista } from "./Vista";

// Ahora Home utiliza los props recibidos y los pasa a Vista e Indice
const Home = (props: Record<string, unknown>): ReactNode => (
  <Vista {...props}>
    <Indice {...props} />
  </Vista>
);

const meta: MetaHistorias = {
  grupo: "vistas",
  titulo: "Home",
  attrs: {
    nombre: "privacidad",
    label: "He leído y acepto la política de privacidad",
    textoValidacion: "Debe aceptar la política de privacidad",
  },
  Componente: Home,
};

export default meta;

export const Base: Historia = {};
