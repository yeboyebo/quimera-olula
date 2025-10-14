import { FactoryAlmacenOlula } from '#/almacen/factory.ts';
import { FactoryAuthOlula } from '#/auth/factory.ts';
import { FactoryCrmOlula } from '#/crm/factory.ts';
import { FactoryVentasOlula } from '#/ventas/factory.ts';


export class FactoryOlula {
    Inicio = { menu: { "Inicio": { url: "/", icono: "inicio" } } };
    Ventas = FactoryVentasOlula;
    Almacen = FactoryAlmacenOlula;
    Crm = FactoryCrmOlula;
    Auth = FactoryAuthOlula;
}

export default FactoryOlula;