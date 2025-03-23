import { useEffect, useState } from "react";
import { Tabla } from "../../../../componentes/wrappers/tabla2.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { LineaPresupuesto as Linea } from "../diseño.ts";
import { deleteLinea, getLineas } from "../infraestructura.ts";


const metaTablaLineas = [
    { id: "linea", cabecera: "Línea", get: (linea: Linea) => `${linea.referencia}: ${linea.descripcion}` },
    { id: "total", cabecera: "Total", get: (linea: Linea) => `${linea.pvp_total}` },
  ]

export const LineasLista = ({
    presupuestoId,
    onEditarLinea,
    onCrearLinea,
    onLineaBorrada,
    lineas,
    setLineas,
    seleccionada,
    setSeleccionada,
  }: {
    presupuestoId: string;
    onEditarLinea: (linea: Linea) => void;
    onCrearLinea: () => void;
    onLineaBorrada: () => void;
    lineas: Linea[];
    setLineas: (lineas: Linea[]) => void;
    seleccionada: Linea | null;
    setSeleccionada: (linea: Linea | null) => void;
  }) => {

    const [cargando, setCargando] = useState(true);

    const cargar = async() => {
        setCargando(true);
        lineas = await getLineas(presupuestoId);
        setLineas(lineas);
        refrescarSeleccionada();
        setCargando(false);
    }

    const borrarLinea = async() => {
        if (!seleccionada) {
            return;
        }
        setLineas(quitarElemento(lineas, seleccionada));
        await deleteLinea(presupuestoId, seleccionada.id);
        onLineaBorrada();
    }

    const quitarElemento = <T extends Entidad>(lista: T[], elemento: T): T[] => {
        return lista.filter((e) => e.id !== elemento.id);
    }

    const refrescarSeleccionada = () => {
        if (!seleccionada) {
            return;
        }
        const nuevaSeleccionada = lineas.find((d) => d.id === seleccionada.id);
        if (nuevaSeleccionada) {
            setSeleccionada(nuevaSeleccionada);
        } else {
            setSeleccionada(null);
        }
    }


    useEffect(() => {
        presupuestoId && cargar();
    }, [presupuestoId]);
      
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
                metaTabla={metaTablaLineas}
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