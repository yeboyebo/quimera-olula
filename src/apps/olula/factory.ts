import { FactoryAlmacenOlula } from '@quimera/ctx/almacen/factory.ts';
import { FactoryAuthOlula } from '@quimera/ctx/auth/factory.ts';
import { FactoryCrmOlula } from '@quimera/ctx/crm/factory.ts';
import { FactoryVentasOlula } from '@quimera/ctx/ventas/factory.ts';


export class FactoryOlula {
    Inicio = { menu: { "Inicio": { url: "/", icono: "inicio" } } };
    Auth = FactoryAuthOlula;
    Ventas = FactoryVentasOlula;
    Almacen = FactoryAlmacenOlula;
    Crm = FactoryCrmOlula;
}

export default FactoryOlula;