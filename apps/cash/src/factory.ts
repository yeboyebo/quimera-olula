import { FactoryAuthOlula } from "#/auth/factory.ts";
import { FactoryAlmacenLegacy } from "./contextos/almacen/factory.ts";
import { FactoryVentasLegacy } from "./contextos/ventas/factory.ts";

export class FactoryLegacy {
    Ventas = FactoryVentasLegacy;
    Almacen = FactoryAlmacenLegacy;
    Auth = FactoryAuthOlula;
}

export default FactoryLegacy;