import { FactoryVentasBase } from "../../../../contextos/ventas/factory.ts";
import { TabDatos } from "../../../../contextos/ventas/presupuesto/vistas/TabDatos.tsx";

export class FactoryVentasGua extends FactoryVentasBase {
    static PresupuestoTabDatos = TabDatos
}