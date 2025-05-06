import { FactoryBase } from "../base/factory.ts";
import { FactoryVentasGUA } from "./contextos/ventas/factory.ts";

export class FactoryGUA extends FactoryBase {
    static Ventas = FactoryVentasGUA
}