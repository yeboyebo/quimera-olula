import { EmitirEvento } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";


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
            transferencia_guardada: ({ publicar }) =>
                publicar("transferencia_guardada"),
        },
        Borrando: {
            borrado_cancelado: "Editando",
            transferencia_borrada: ({ publicar }) =>
                publicar("transferencia_borrada"),
        },
    },
};

export const useMaquinaTransferenciaStock = (publicar?: EmitirEvento) => useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar,
});
