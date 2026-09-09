import { ListaSeleccionable } from "@olula/lib/diseño.js";
import { Presupuesto } from "../../presupuesto/diseño.ts";
import { LineaAprobarPresupuesto, PedidoCreado } from "../diseño.ts";

export type EstadoAprobarPresupuesto =
    | "INICIAL"
    | "VACIO"
    | "CARGANDO"
    | "LISTO"
    | "CONFIRMANDO_APROBACION"
    | "PEDIDO_CREADO";

export type ContextoAprobarPresupuesto = {
    estado: EstadoAprobarPresupuesto;
    presupuesto: Presupuesto;
    lineas: ListaSeleccionable<LineaAprobarPresupuesto>;
    pedidoCreado?: PedidoCreado;
};
