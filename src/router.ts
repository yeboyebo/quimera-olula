import { RouteObject } from "react-router";

const APP = import.meta.env.VITE_APP_NAME || "olula";

let Factory = null;
try {
    Factory = (await import(`./apps/${APP}/router_factory.ts`)).default;
} catch (e) {
    console.log(e)
    console.error(`Error al cargar la fábrica de la aplicación: ${APP}`);
}

const factory = new Factory();

type ContextFactory = { router: RouteObject };

export const routerFactory = () => {
    const factorias = Object.values(factory);
    const routers = factorias.map(v => (v as ContextFactory)?.router).filter(Boolean).flat();
    const rutas = routers.map(r => Object.entries(r).map(([k, v]) => ({ path: k, Component: v }))).flat();
    return rutas as RouteObject[];
}