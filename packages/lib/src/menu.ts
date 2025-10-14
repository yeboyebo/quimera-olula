export interface ElementoMenuPadre {
    nombre: string;
    icono?: string;
    subelementos: ElementoMenu[];
    regla?: string;
}

export interface ElementoMenuHijo {
    nombre: string;
    icono?: string;
    url: string;
    regla?: string;
}

export type ElementoMenu = ElementoMenuPadre | ElementoMenuHijo;

export type MenuContextFactory = { menu: ElementoMenu };

export const crearMenu = (factory: Record<string, MenuContextFactory>) => {
    const formatearNombre = (i: ElementoMenu) => ({ ...i, nombre: i.nombre.split('/').pop()?.trim() });
    const agruparPorNombre = (i: ElementoMenu) => i.nombre.split('/')[0];

    const factorias = Object.values(factory);
    const menus = factorias.map(v => (v as MenuContextFactory)?.menu).filter(Boolean).flat();
    const items = menus.map(m => Object.entries(m).map(([k, v]) => ({ nombre: k, ...v }))).flat();
    const itemsAgrupados = Object.entries(Object.groupBy(items, agruparPorNombre)).map(([k, v]) => ({ ...((v ?? []).filter(i => i.nombre === k)[0]), subelementos: (v ?? []).filter(i => i.nombre !== k).map(formatearNombre) }));

    return itemsAgrupados as ElementoMenu[];
};