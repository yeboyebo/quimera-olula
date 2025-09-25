import { ElementoMenu } from "@quimera/comp/menu/menu.ts";

const APP = import.meta.env.VITE_APP_NAME || "olula";

let Factory = null;
try {
    Factory = (await import(`./apps/${APP}/factory.ts`)).default;
} catch {
    console.error(`Error al cargar la fábrica de la aplicación: ${APP}`);
}

const factory = new Factory();

type ContextFactory = { menu?: ElementoMenu[] };

export const appFactory = () => factory;
export const menuFactory = () => Object.values(factory).map(v => (v as ContextFactory)?.menu).filter(Boolean).flat() as ElementoMenu[];
