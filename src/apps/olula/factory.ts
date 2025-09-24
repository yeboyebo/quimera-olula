import { FactoryAlmacenOlula } from '@quimera/ctx/almacen/factory.ts';
import { FactoryCrmOlula } from '@quimera/ctx/crm/factory.ts';
import { FactoryVentasOlula } from '@quimera/ctx/ventas/factory.ts';


export class FactoryOlula {
    Inicio = { menu: { nombre: "Inicio", url: "/", icono: "inicio" } };
    Ventas = FactoryVentasOlula;
    Almacen = FactoryAlmacenOlula;
    Crm = FactoryCrmOlula;
}

export default FactoryOlula;