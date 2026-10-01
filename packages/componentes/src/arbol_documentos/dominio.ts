import { DocumentosAPI, NodoArbol } from "@olula/lib/api/documentos.ts";
import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ConfiguracionArbolDocumentos, ContextoArbolDocumentos, EstadoArbolDocumentos } from "./diseño.ts";

type ProcesarArbolDocumentos = ProcesarContexto<EstadoArbolDocumentos, ContextoArbolDocumentos>;

export const cargarArbol: ProcesarArbolDocumentos = async (contexto, payload) => {
    const configuracion = (payload as ConfiguracionArbolDocumentos | undefined) ?? contexto.configuracion;
    const nodos = await DocumentosAPI.obtenerArbol(configuracion.tipoObjeto, configuracion.objetoId);

    return {
        ...contexto,
        configuracion,
        nodos,
        nodoAEliminar: null,
    };
};

export const seleccionarCarpetaPadre: ProcesarArbolDocumentos = async (contexto, payload) => {
    return {
        ...contexto,
        carpetaPadreId: (payload as string | null) ?? null,
    };
};

export const seleccionarNodoAEliminar: ProcesarArbolDocumentos = async (contexto, payload) => {
    return {
        ...contexto,
        nodoAEliminar: (payload as NodoArbol | undefined) ?? null,
    };
};
