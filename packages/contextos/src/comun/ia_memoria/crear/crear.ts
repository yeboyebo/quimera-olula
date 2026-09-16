import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevaIaMemoria } from "../diseño.js";

/**
 * Constante (no función) para evitar que useModelo resetee el formulario
 * en cada render: ver patrón "formularios de alta" en la guía del proyecto.
 */
export const nuevaIaMemoriaVacia: NuevaIaMemoria = {
    titulo: "",
    contenido: "",
};

export const metaNuevaIaMemoria: MetaModelo<NuevaIaMemoria> = {
    campos: {
        titulo: {
            requerido: true,
            validacion: (m: NuevaIaMemoria) => stringNoVacio(m.titulo),
        },
        contenido: {
            requerido: true,
            validacion: (m: NuevaIaMemoria) => stringNoVacio(m.contenido),
        },
    },
};

/**
 * Lee un fichero como base64 (sin el prefijo "data:<mime>;base64,") para
 * mandarlo al backend en el alta/reemplazo de una memoria por fichero.
 */
export const leerComoBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
