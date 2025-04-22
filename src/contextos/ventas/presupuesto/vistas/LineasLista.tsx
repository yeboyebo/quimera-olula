import { useCallback, useEffect, useState } from "react";
import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { refrescarSeleccionada } from "../../../comun/dominio.ts";
import { LineaPresupuesto as Linea } from "../diseño.ts";
import {
  deleteLinea,
  getLineas,
  patchCantidadLinea,
} from "../infraestructura.ts";
import { EditarCantidadLineaPresupuesto } from "./EditarCantidadLineaPresupuesto.tsx";

const getMetaTablaLineas = (
  cambiarCantidad: (linea: Linea, cantidad: number) => void
) => {
  return [
    {
      id: "linea",
      cabecera: "Línea",
      render: (linea: Linea) => `${linea.referencia}: ${linea.descripcion}`,
    },
    {
      id: "cantidad",
      cabecera: "Cantidad",
      render: (linea: Linea) => (
        <EditarCantidadLineaPresupuesto
          linea={linea}
          onCantidadEditada={cambiarCantidad}
        />
      ),
    },
    { id: "pvp_unitario", cabecera: "P. Unitario" },
    { id: "pvp_total", cabecera: "Total" },
  ];
};

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

  const borrarLinea = async () => {
    if (!seleccionada) {
      return;
    }
    setLineas(quitarElemento(lineas, seleccionada));
    await deleteLinea(presupuestoId, seleccionada.id);
    onLineaBorrada();
  };

  const cambiarCantidad = async (linea: Linea, cantidad: number) => {
    await patchCantidadLinea(presupuestoId, linea, cantidad);
    onLineaCambiada(linea);
  };

  const quitarElemento = <T extends Entidad>(lista: T[], elemento: T): T[] => {
    return lista.filter((e) => e.id !== elemento.id);
  };

  const cargar = useCallback(async () => {
    setCargando(true);
    const lineas = await getLineas(presupuestoId);
    setLineas(lineas);
    refrescarSeleccionada(lineas, seleccionada?.id, setSeleccionada);
    setCargando(false);
  }, [presupuestoId, setLineas, seleccionada?.id, setSeleccionada]);

  useEffect(() => {
    if (presupuestoId) cargar();
  }, [presupuestoId, cargar]);

  return (
    <>
      <button onClick={onCrearLinea}> Nueva</button>
      <button
        onClick={() => seleccionada && onEditarLinea(seleccionada)}
        disabled={!seleccionada}
      >
        {" "}
        Editar
      </button>
      <button disabled={!seleccionada} onClick={borrarLinea}>
        {" "}
        Borrar
      </button>

      <QTabla
        metaTabla={getMetaTablaLineas(cambiarCantidad)}
        datos={lineas}
        cargando={cargando}
        seleccionadaId={seleccionada?.id}
        onSeleccion={setSeleccionada}
        orden={{ id: "ASC" }}
        onOrdenar={
          (_: string) => null
          //   setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
        }
      />
    </>
  );
};
