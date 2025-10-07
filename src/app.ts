import { ElementoMenu } from "@quimera/comp/menu/menu.ts";

const APP = import.meta.env.VITE_APP_NAME || "olula";

let Factory = null;
try {
    Factory = (await import(`./apps/${APP}/factory.ts`)).default;
} catch {
    console.error(`Error al cargar la fábrica de la aplicación: ${APP}`);
}

const factory = new Factory();

type ContextFactory = { menu: ElementoMenu };

export const appFactory = () => factory;
export const menuFactory = () => {
    const formatearNombre = (i: ElementoMenu) => ({ ...i, nombre: i.nombre.split('/').pop()?.trim() });
    const agruparPorNombre = (i: ElementoMenu) => i.nombre.split('/')[0];

    const factorias = Object.values(factory);
    const menus = factorias.map(v => (v as ContextFactory)?.menu).filter(Boolean).flat();
    const items = menus.map(m => Object.entries(m).map(([k, v]) => ({ nombre: k, ...v }))).flat();
    const itemsAgrupados = Object.entries(Object.groupBy(items, agruparPorNombre)).map(([k, v]) => ({ ...((v ?? []).filter(i => i.nombre === k)[0]), subelementos: (v ?? []).filter(i => i.nombre !== k).map(formatearNombre) }));
    return itemsAgrupados as ElementoMenu[];
};
