import { FactoryOlula } from "../olula/factory.ts";
import { FactoryVentasGUA } from "./contextos/ventas/factory.ts";

export class FactoryGUA extends FactoryOlula {
    Ventas = FactoryVentasGUA;
}

export default FactoryGUA;