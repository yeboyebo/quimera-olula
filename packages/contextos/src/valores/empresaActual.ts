type WhoAmI = {
    empresas?: { id: string; nombre: string }[];
};

const EMPRESA_ACTUAL_KEY = "empresa_actual";

/**
 * Empresa con la que trabaja el usuario.
 *
 * - Si solo tiene una empresa, devuelve siempre esa.
 * - Si tiene varias, devuelve la guardada en localStorage (empresa_actual),
 *   o la primera si todavía no se ha seleccionado ninguna.
 *
 * Se lee de localStorage en cada llamada, no al cargar el módulo: el login hace
 * `navigate("/")` sin recargar, así que cualquier valor capturado al importar se
 * quedaría congelado con lo de antes de iniciar sesión.
 */
export const empresaActual = (): string => {
    const raw = localStorage.getItem("whoami");
    if (!raw) return "";

    try {
        const whoAmI = JSON.parse(raw) as WhoAmI;
        const empresas = whoAmI.empresas ?? [];
        if (empresas.length === 0) return "";
        if (empresas.length === 1) return String(empresas[0].id);
        return localStorage.getItem(EMPRESA_ACTUAL_KEY) ?? String(empresas[0].id);
    } catch {
        return "";
    }
};

export const setEmpresaActual = (id: string): void => {
    localStorage.setItem(EMPRESA_ACTUAL_KEY, id);
};
