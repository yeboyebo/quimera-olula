import { FactoryAlmacenOlula } from '#/almacen/factory.ts';
import { FactoryAuthOlula } from '#/auth/factory.ts';
import { FactoryCrmOlula } from '#/crm/factory.ts';
import { FactoryRrhhOlula } from '#/rrhh/factory.ts';
import { FactoryTpvOlula } from '#/tpv/factory.ts';
import { FactoryVentasOlula } from '#/ventas/factory.ts';
import { FactoryComponentesOlula } from '@olula/componentes/factory.ts';

export class FactoryOlula {
    Inicio = { menu: { "Inicio": { url: "/", icono: "inicio" } } };
    Componentes = FactoryComponentesOlula;
    Almacen = FactoryAlmacenOlula;
    Crm = FactoryCrmOlula;
    Ventas = FactoryVentasOlula;
    TPV = FactoryTpvOlula;
    Auth = FactoryAuthOlula;
    Rrhh = FactoryRrhhOlula
}

export default FactoryOlula;