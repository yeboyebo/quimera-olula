import { useContext } from "react";
import { Contexto } from "../../../../contextos/comun/contexto.ts";
import { Acciones } from "../../../../contextos/comun/diseño.ts";
import { LineaPresupuesto } from "../../presupuesto/diseño.ts";

export const useAccionesLineaPresupuesto = (acciones: Acciones<LineaPresupuesto>) => {
    const {
        actualizarUnElemento,
        actualizarUno,
        crearUno,
        obtenerTodos,
        obtenerUno,
        eliminarUno,
    } = acciones;

    const context = useContext(Contexto);
    if (!context) {
        throw new Error("Contexto es nulo");
    }
    const { entidades, setEntidades, seleccionada } = context;

    const actualizarLineaPresupuesto = (lineaPresupuesto: LineaPresupuesto) => {
        setEntidades(
            entidades.map((entidad) => {
                if (entidad.id === lineaPresupuesto.id) {
                    return lineaPresupuesto;
                }
                return entidad;
            })
        );
    };

    const quitarLineaPresupuesto = (lineaPresupuestoId: string) => {
        setEntidades(
            entidades.filter((entidad) => entidad.id !== lineaPresupuestoId)
        );
    };

    const onCambiarLineaPresupuesto = () => {
        if (!seleccionada) {
            return;
        }
        const original = seleccionada as LineaPresupuesto;
        const cambiada = {
            ...original,
            // Realiza los cambios necesarios directamente aquí
        };
        actualizarUno(cambiada.id, cambiada)
            .then(() => {
                obtenerUno(cambiada.id).then((lineaPresupuesto) => {
                    actualizarLineaPresupuesto(lineaPresupuesto as LineaPresupuesto);
                });
            })
            .catch((error) => {
                console.error("Error al actualizar la línea de presupuesto:", error);
            });
    };

    const onCambiarCantidadLineaPresupuesto = () => {
        if (!seleccionada) {
            return;
        }
        const original = seleccionada as LineaPresupuesto;
        const cambiada = {
            ...original,
            cantidad: original.cantidad + 1,
        };
        console.log(cambiada);
        actualizarUnElemento(cambiada.id, cambiada, "cambiar_cantidad_lineas")
            .then(() => {
                actualizarLineaPresupuesto(cambiada as LineaPresupuesto);
            })
            .catch((error) => {
                console.error("Error al actualizar la línea de presupuesto:", error);
                console.log(cambiada);
                actualizarLineaPresupuesto(cambiada as LineaPresupuesto);
            });
    };

    const onBorrarLineaPresupuesto = () => {
        if (!seleccionada) {
            return;
        }
        const lineaPresupuestoId = seleccionada.id;

        eliminarUno(lineaPresupuestoId).then(() => {
            quitarLineaPresupuesto(lineaPresupuestoId);
        });
    };

    const handleCrearLineaPresupuesto = async (
        id: string,
        data: LineaPresupuesto
    ) => {
        if (!id) {
            crearUno(data).then(() => {
                obtenerTodos().then((lineasPresupuesto) => {
                    setEntidades(lineasPresupuesto);
                });
            });
        }
    };

    return {
        onCambiarLineaPresupuesto,
        onCambiarCantidadLineaPresupuesto,
        onBorrarLineaPresupuesto,
        handleCrearLineaPresupuesto,
    };
};