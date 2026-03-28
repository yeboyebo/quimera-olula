import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import {
    Presupuesto
} from "./diseño.ts";

export const metaTablaPresupuesto: MetaTabla<Presupuesto> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
        render: (p) => p.cliente.nombre_cliente,
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

