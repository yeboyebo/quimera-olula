import { RouterFactoryAlmacenOlula } from '#/almacen/router_factory.ts';
import { RouterFactoryAuthOlula } from '#/auth/router_factory.ts';
import { RouterFactoryCrmOlula } from '#/crm/router_factory.ts';
import { RouterFactoryVentasOlula } from '#/ventas/router_factory.ts';
import { Historias } from '@olula/componentes/index.ts';
import { FondoInicio } from '@olula/lib/FondoInicio.tsx';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';

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

export const router = crearRouter(new RouterFactoryOlula() as unknown as Record<string, { router: RouteObject }>);