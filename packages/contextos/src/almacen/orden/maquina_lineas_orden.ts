import { ListaSeleccionable } from "@olula/lib/diseño.ts";
import { cambiarItem, cargar, incluirItem, listaSeleccionableVacia, quitarItem, seleccionarItem } from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.ts";
import {
    ConfigMaquina4,
    Maquina3,
    useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { LineaOrdenAlmacen } from "./diseño.ts";

type Estado = "Lista" | "Alta" | "Edicion" | "ConfirmarBorrado";

type Contexto = {
    lineas: ListaSeleccionable<LineaOrdenAlmacen>;
};

const setLineasOrden =
    (
        aplicable: (
            lineas: ListaSeleccionable<LineaOrdenAlmacen>
        ) => ListaSeleccionable<LineaOrdenAlmacen>
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
            lineas: listaSeleccionableVacia<LineaOrdenAlmacen>(),
        },
    },
    estados: {
        Alta: {
            linea_creada: ({ maquina, payload, setEstado }) =>
                pipe(
                    maquina,
                    setEstado("Lista" as Estado),
                    setLineasOrden(incluirItem(payload as LineaOrdenAlmacen, {}))
                ),
            creacion_cancelada: "Lista",
        },
        Edicion: {
            linea_orden_cambiada: ({ maquina, payload, setEstado }) =>
                pipe(
                    maquina,
                    setEstado("Lista" as Estado),
                    setLineasOrden(cambiarItem(payload as LineaOrdenAlmacen))
                ),
            edicion_cancelada: "Lista",
        },
        Lista: {
            alta_solicitada: "Alta",
            edicion_solicitada: "Edicion",
            linea_seleccionada: ({ maquina, payload }) =>
                pipe(
                    maquina,
                    setLineasOrden(seleccionarItem(payload as LineaOrdenAlmacen))
                ),
            lineas_cargadas: ({ maquina, payload, setEstado }) =>
                pipe(
                    maquina,
                    setEstado("Lista" as Estado),
                    setLineasOrden(cargar(payload as LineaOrdenAlmacen[]))
                ),
            borrado_solicitado: "ConfirmarBorrado",
        },
        ConfirmarBorrado: {
            linea_orden_borrada: ({ maquina, setEstado }) => {
                const { lineas } = maquina.contexto;
                if (!lineas.idActivo) {
                    return maquina;
                }
                return pipe(
                    maquina,
                    setEstado("Lista" as Estado),
                    setLineasOrden(quitarItem(lineas.idActivo))
                );
            },
            borrado_cancelado: "Lista",
        },
    },
};

export const useMaquinaLineasOrden = () => useMaquina4<Estado, Contexto>({
    config: configMaquina,
});
