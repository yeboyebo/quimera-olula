import { RouterFactoryAuthOlula } from '#/auth/router_factory.ts';
import { FondoInicio } from '@olula/lib/FondoInicio.tsx';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';
import { RouterFactoryEventosAlma } from './contextos/eventos/router_factory.ts';
import { RouterFactoryVentasNrj } from './contextos/ventas/router_factory.ts';

export class RouterFactoryNrj {
    Inicio = { router: { "": FondoInicio } };
    Eventos = RouterFactoryEventosAlma;
    Ventas = RouterFactoryVentasNrj;
    Auth = RouterFactoryAuthOlula;
};

export const router = crearRouter(new RouterFactoryNrj() as unknown as Record<string, { router: RouteObject }>);