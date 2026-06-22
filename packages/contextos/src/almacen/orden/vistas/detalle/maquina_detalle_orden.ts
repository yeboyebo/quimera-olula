import { ConfigMaquina4, ProcesarEvento, useMaquina4 } from "@olula/lib/useMaquina.ts";

type Estado = "Editando" | "Borrando";

type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
    inicial: {
        estado: "Editando",
        contexto: {},
    },
    estados: {
        Editando: {
            borrar: "Borrando",
            orden_guardada: ({ publicar }) =>
                publicar("orden_guardada"),
        },
        Borrando: {
            borrado_cancelado: "Editando",
            orden_borrada: ({ publicar }) =>
                publicar("orden_borrada"),
        },
    },
};

export const useMaquinaDetalleOrden = (publicar?: ProcesarEvento) =>
    useMaquina4<Estado, Contexto>({
        config: configMaquina,
        publicar,
    });
