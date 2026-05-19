import { FactoryComponentesOlula } from "@olula/componentes/factory.js";
import { CabeceraGan } from "./componentes/Cabecera/Cabecera.tsx";
import { MenuUsuarioGan } from "./componentes/MenuUsuario/MenuUsuario.tsx";
import { FactoryAlmacenLegacy } from "./contextos/almacen/factory.ts";
import { FactoryAuthLegacy } from "./contextos/auth/factory.ts";
import { FactoryVentasLegacy } from "./contextos/ventas/factory.ts";

class FactoryComponentesGan extends FactoryComponentesOlula {
    static cabecera = CabeceraGan;
    static MenuUsuario = MenuUsuarioGan;
}

export class FactoryLegacy {
    Ventas = FactoryVentasLegacy;
    Almacen = FactoryAlmacenLegacy;
    Auth = FactoryAuthLegacy;
    Componentes = FactoryComponentesGan;
}

export default FactoryLegacy;