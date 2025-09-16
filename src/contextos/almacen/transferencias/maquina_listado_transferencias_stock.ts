
import { ListaSeleccionable } from "../../comun/diseño.ts";
import {
    cambiarItem,
    cargar,
    incluirItem,
    listaSeleccionableVacia,
    quitarItem,
    quitarSeleccion,
    seleccionarItem
} from "../../comun/entidad.ts";
import { pipe } from "../../comun/funcional.ts";
import {
    ConfigMaquina4,
    Maquina3,
    useMaquina4
} from "../../comun/useMaquina.ts";
import { TransferenciaStock } from "./diseño.ts";

type Estado = "Inactivo" | "Creando";

type Contexto = {
    transferencias: ListaSeleccionable<TransferenciaStock>;
};

const setTransferencias =
    (
        aplicable: (
            transferencias: ListaSeleccionable<TransferenciaStock>
        ) => ListaSeleccionable<TransferenciaStock>
    ) =>
        (maquina: Maquina3<Estado, Contexto>) => {
            return {
                ...maquina,
                contexto: {
                    ...maquina.contexto,
                    transferencias: aplicable(maquina.contexto.transferencias),
                },
            };
        };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
    inicial: {
        estado: "Inactivo",
        contexto: {
            transferencias: listaSeleccionableVacia<TransferenciaStock>(),
        },
    },
    estados: {
        Inactivo: {
            crear: "Creando",
            transferencia_cambiada: ({ maquina, payload }) =>
                pipe(
                    maquina,
                    setTransferencias(cambiarItem(payload as TransferenciaStock))
                ),
            transferencia_seleccionada: ({ maquina, payload }) =>
                pipe(
                    maquina,
                    setTransferencias(seleccionarItem(payload as TransferenciaStock))
                ),
            cancelar_seleccion: ({ maquina }) =>
                pipe(
                    maquina,
                    setTransferencias(quitarSeleccion())
                ),
            transferencia_borrada: ({ maquina }) => {
                const { transferencias } = maquina.contexto;
                if (!transferencias.idActivo) {
                    return maquina;
                }
                return pipe(
                    maquina,
                    setTransferencias(quitarItem(transferencias.idActivo))
                );
            },
            transferencias_cargadas: ({ maquina, payload, setEstado }) =>
                pipe(
                    maquina,
                    setEstado("Inactivo" as Estado),
                    setTransferencias(cargar(payload as TransferenciaStock[]))
                ),
        },
        Creando: {
            transferencia_creada: ({ maquina, payload, setEstado }) =>
                pipe(
                    maquina,
                    setEstado("Inactivo" as Estado),
                    setTransferencias(incluirItem(payload as TransferenciaStock, {}))
                ),
            creacion_cancelada: "Inactivo",
        },
    },
};

export const useMaquinaTransferenciasStock = () => useMaquina4<Estado, Contexto>({
    config: configMaquina,
});