import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroArqueosTpv, EstadoMaestroArqueosTpv } from "./diseño.ts";
import { activarArqueo, cambiarArqueoEnLista, crearArqueo, desactivarArqueoActivo, recargarArqueos } from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoMaestroArqueosTpv, ContextoMaestroArqueosTpv> = () => {

    return {

        INICIAL: {

            arqueo_cambiado: cambiarArqueoEnLista,

            arqueo_seleccionado: activarArqueo,

            arqueo_deseleccionado: desactivarArqueoActivo,

            // venta_borrada: quitarArqueoDeLista,

            // venta_creada: incluirArqueoEnLista,

            recarga_de_arqueos_solicitada: recargarArqueos,

            creacion_de_arqueo_solicitada: crearArqueo,
        },
    }
}

