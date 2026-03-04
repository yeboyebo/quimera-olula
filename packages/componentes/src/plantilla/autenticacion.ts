export const estaAutentificado = (): boolean => {
    return !!(
        localStorage.getItem("token-acceso") ||
        localStorage.getItem("token-refresco")
    );
};