import { useCallback, useEffect, useState } from "react";
import { InputNumerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Tabla } from "../../../../componentes/wrappers/tabla2.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { refrescarSeleccionada } from "../../../comun/dominio.ts";
import { LineaPresupuesto as Linea } from "../diseño.ts";
import { camposLinea, deleteLinea, getLineas, patchCantidadLinea } from "../infraestructura.ts";

const EditarCantidad = ({
    linea,
    onCantidadEditada,
  }: {
    linea: Linea;
    onCantidadEditada: (linea: Linea, cantidad: number) => void;
  }) => {
    return (
      <InputNumerico
        campo={camposLinea.cantidad}
        onCampoCambiado={(_, valor) => onCantidadEditada(linea, valor)}
        valorEntidad={linea.cantidad}
      />
    );
  }

const getMetaTablaLineas = (cambiarCantidad: (linea: Linea, cantidad: number) => void) => {
    return [
        { id: "linea", cabecera: "Línea", render: (linea: Linea) => `${linea.referencia}: ${linea.descripcion}` },
        { id: "cantidad", cabecera: "Cantidad", render: (linea: Linea) => EditarCantidad({
            linea,
            onCantidadEditada: cambiarCantidad
        })},
        { id: "pvp_unitario", cabecera: "P. Unitario" },
        { id: "pvp_total", cabecera: "Total" },
    ]
}


export const LineasLista = ({
    presupuestoId,
    onEditarLinea,
    onCrearLinea,
    onLineaBorrada,
    onLineaCambiada,
    lineas,
    setLineas,
    seleccionada,
    setSeleccionada,
  }: {
    presupuestoId: string;
    onEditarLinea: (linea: Linea) => void;
    onCrearLinea: () => void;
    onLineaBorrada: () => void;
    onLineaCambiada: (linea: Linea) => void;
    lineas: Linea[];
    setLineas: (lineas: Linea[]) => void;
    seleccionada: Linea | null;
    setSeleccionada: (linea: Linea | null) => void;
  }) => {

    const [cargando, setCargando] = useState(true);

    const borrarLinea = async() => {
        if (!seleccionada) {
            return;
        }
        setLineas(quitarElemento(lineas, seleccionada));
        await deleteLinea(presupuestoId, seleccionada.id);
        onLineaBorrada();
    }

    const cambiarCantidad = async(linea: Linea, cantidad: number) => {
        await patchCantidadLinea(presupuestoId, linea.id, cantidad);
        onLineaCambiada(linea);
    }

    const quitarElemento = <T extends Entidad>(lista: T[], elemento: T): T[] => {
        return lista.filter((e) => e.id !== elemento.id);
    }

    const cargar = useCallback(async() => {
        setCargando(true);
        const lineas = await getLineas(presupuestoId);
        setLineas(lineas);
        refrescarSeleccionada(lineas, seleccionada?.id, setSeleccionada);
        setCargando(false);
    }, [presupuestoId, setLineas, seleccionada, setSeleccionada]);

    useEffect(() => {
        if (presupuestoId) cargar();
    }, [presupuestoId, cargar]);
      
    return (<>
            <button
                onClick={onCrearLinea}
            > Nueva
            </button>
            <button
                onClick={() => seleccionada && onEditarLinea(seleccionada)}
                disabled={!seleccionada}
            > Editar
            </button>
            <button
                disabled={!seleccionada}
                onClick={borrarLinea}
            > Borrar
            </button>
           
            <Tabla
                metaTabla={getMetaTablaLineas(cambiarCantidad)}
                datos={lineas}
                cargando={cargando}
                seleccionadaId={seleccionada?.id}
                onSeleccion={setSeleccionada}
                orden={{ id: 'ASC'}}
                onOrdenar={(_: string) =>
                    null
                //   setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
                }
            />
    </>)
  }