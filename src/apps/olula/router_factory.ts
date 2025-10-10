import { Historias } from '@quimera/comp/historias/historias.tsx';
import { RouterFactoryAlmacenOlula } from '@quimera/ctx/almacen/router_factory.ts';
import { RouterFactoryAuthOlula } from '@quimera/ctx/auth/router_factory.ts';
import { RouterFactoryCrmOlula } from '@quimera/ctx/crm/router_factory.ts';
import { RouterFactoryVentasOlula } from '@quimera/ctx/ventas/router_factory.ts';
import { FondoInicio } from '@quimera/lib/FondoInicio.tsx';

export class RouterFactoryOlula {
    Inicio = { router: { "": FondoInicio } };
    Auth = RouterFactoryAuthOlula;
    Ventas = RouterFactoryVentasOlula;
    Almacen = RouterFactoryAlmacenOlula;
    Crm = RouterFactoryCrmOlula;
    Otros = {
        router: {
            "docs/componentes": Historias,
        }
    }
}

export default RouterFactoryOlula;