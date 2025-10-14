import { crearRouter } from "@olula/lib/router.ts";
import { RouterFactoryOlula } from "@olula/olula/router_factory.ts";
import { RouteObject } from "react-router";

export class RouterFactoryGuanabana extends RouterFactoryOlula { }

export const router = crearRouter(new RouterFactoryGuanabana() as unknown as Record<string, { router: RouteObject }>);
