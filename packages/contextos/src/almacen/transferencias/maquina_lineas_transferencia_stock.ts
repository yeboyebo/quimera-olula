
import { ListaSeleccionable } from "@olula/lib/diseño.ts";
import { cambiarItem, cargar, incluirItem, listaSeleccionableVacia, quitarItem, seleccionarItem } from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.ts";
import {
    ConfigMaquina4,
    Maquina3,
    useMaquina4
} from "@olula/lib/useMaquina.ts";
import { LineaTransferenciaStock } from "./diseño.ts";

type Estado = "Lista" | "Alta" | "Edicion" | "ConfirmarBorrado";

type Contexto = {
    lineas: ListaSeleccionable<LineaTransferenciaStock>;
};

const setLineasTransferencia =
    (
        aplicable: (
            lineas: ListaSeleccionable<LineaTransferenciaStock>
        ) => ListaSeleccionable<LineaTransferenciaStock>
    ) =>
        (maquina: Maquina3<Estado, Contexto>) => {
            return {
                ...maquina,
                contexto: {
                    ...maquina.contexto,
                    lineas: aplicable(maquina.contexto.lineas),
                },
            };
        };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
    inicial: {
        estado: "Lista",
        contexto: {
            lineas: listaSeleccionableVacia<LineaTransferenciaStock>(),
        },
    },
    estados: {
        Alta: {
            linea_creada: ({ maquina, payload, setEstado }) =>
                pipe(
                    maquina,
                    setEstado("Lista" as Estado),
                    setLineasTransferencia(incluirItem(payload as LineaTransferenciaStock, {}))
                ),
            creacion_cancelada: "Lista",
        },
        Edicion: {
            linea_transferencia_cambiada: ({ maquina, payload, setEstado }) =>
                pipe(
                    maquina,
                    setEstado("Lista" as Estado),
                    setLineasTransferencia(cambiarItem(payload as LineaTransferenciaStock))
                ),
            edicion_cancelada: "Lista",
        },
        Lista: {
            alta_solicitada: "Alta",
            edicion_solicitada: "Edicion",
            linea_seleccionada: ({ maquina, payload }) =>
                pipe(
                    maquina,
                    setLineasTransferencia(seleccionarItem(payload as LineaTransferenciaStock))
                ),
            lineas_cargadas: ({ maquina, payload, setEstado }) =>
                pipe(
                    maquina,
                    setEstado("Lista" as Estado),
                    setLineasTransferencia(cargar(payload as LineaTransferenciaStock[]))
                ),
            borrado_solicitado: "ConfirmarBorrado",
        },
        ConfirmarBorrado: {
            linea_transferencia_borrada: ({ maquina, setEstado }) => {
                const { lineas } = maquina.contexto;
                if (!lineas.idActivo) {
                    return maquina;
                }
                return pipe(
                    maquina,
                    setEstado("Lista" as Estado),
                    setLineasTransferencia(quitarItem(lineas.idActivo))
                );
            },
            borrado_cancelado: "Lista",
        },
    }
};

export const useMaquinaLineasTransferenciasStock = () => useMaquina4<Estado, Contexto>({
    config: configMaquina,
});