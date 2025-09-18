const APP = import.meta.env.VITE_APP_NAME || "olula";

console.log(`Iniciando aplicación: <-${APP}->`);

let factory = null;
try {
    factory = await import(`./apps/${APP}/factory.ts`);
} catch {
    console.error(`Error al cargar la fábrica de la aplicación: ${APP}`);
}

export const appFactory = () => factory.default
