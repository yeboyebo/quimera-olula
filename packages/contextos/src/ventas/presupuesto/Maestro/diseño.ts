import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ContextoMaestroPresupuesto, EstadoMaestroPresupuesto, Presupuesto } from "../diseño.ts";

export type { ContextoMaestroPresupuesto, EstadoMaestroPresupuesto, Presupuesto };

export const metaTablaPresupuesto: MetaTabla<Presupuesto> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];
