import { useContext } from "react";
import { Contexto } from "../../../../contextos/comun/contexto.ts";
import { AccionesLineaPresupuesto, LineaPresupuesto } from "../../presupuesto/diseño.ts";

export const useAccionesLineaPresupuesto = (acciones: AccionesLineaPresupuesto) => {
    const {
        actualizarUno,
        crearUno,
        obtenerTodos,
        obtenerUno,
        eliminarUno,
        onCambiarCantidadLinea
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
        onCambiarCantidadLinea(cambiada.id, cambiada)
            .then(() => {
                actualizarLineaPresupuesto(cambiada as LineaPresupuesto);
            })
            .catch((error: Error) => {
                console.error("Error al actualizar la línea de presupuesto:", error);
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
        data: LineaPresupuesto
    ) => {
        if (!data.id) {
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