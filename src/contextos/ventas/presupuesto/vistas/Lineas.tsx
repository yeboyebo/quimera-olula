import { useCallback, useEffect, useState } from "react";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { refrescarSeleccionada } from "../../../comun/dominio.ts";
import { LineaPresupuesto as Linea, LineaPresupuesto, NuevaLinea } from "../diseño.ts";
import { deleteLinea, getLineas, patchArticuloLinea, patchCantidadLinea, postLinea } from "../infraestructura.ts";
import { AltaLinea } from "./AltaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";
export const Lineas = ({
  onCabeceraModificada,
  presupuestoId,
}: {
  onCabeceraModificada: () => void;
  presupuestoId: string;
}) => {
  const [modo, setModo] = useState("lista");
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [seleccionada, setSeleccionada] = useState<string | undefined>(undefined);
  
  const quitarElemento = <T extends Entidad>(lista: T[], id: string): T[] => {
    return lista.filter((e) => e.id !== id);
  };
  const getElemento = <T extends Entidad>(lista: T[], id: string): T => {
    const elementos = lista.filter((e) => e.id === id);
    if (elementos.length === 1) {
      return elementos[0];
    }
    throw new Error(`No se encontró el elemento con id ${id}`);
  };

  const refrescarLineas = async (idSeleccionada: string) => {
    const lineas = await getLineas(presupuestoId);
    setLineas(lineas);
    onCabeceraModificada();
    refrescarSeleccionada(lineas, idSeleccionada, setSeleccionada);
    // setModo("lista");
  };

  const cargar = useCallback(async () => {
    const lineas = await getLineas(presupuestoId);
    setLineas(lineas);
    refrescarSeleccionada(lineas, seleccionada, setSeleccionada);
  }, [presupuestoId, setLineas, seleccionada, setSeleccionada]);

  useEffect(() => {
    if (presupuestoId) cargar();
  }, [presupuestoId, cargar]);
  
  const publicar = async (evento: string, payload: unknown) => {
    console.log("publicar", evento, payload, 'estado actual', modo);

    switch(modo) {
      case 'alta': {
        switch(evento) {
          case 'nueva_linea_lista': {
            const idLinea = await postLinea(presupuestoId, payload as NuevaLinea);
            refrescarLineas(idLinea);
            setModo("lista");
            break;
          }
        }
        break;
      }
      case 'edicion': {
        switch(evento) {
          case 'linea_edicion_lista': {
            const linea = payload as LineaPresupuesto;
            await patchArticuloLinea(presupuestoId, linea.id, linea.referencia);
            refrescarLineas(linea.id);
            setModo("lista");
            break;
          }
        }
        break;
      }
      case 'lista': {
        switch(evento) {
          case 'linea_seleccionada': {
            const idLinea = payload as string;
            setSeleccionada(idLinea);
            break;
          }
          case 'crear_linea': {
            setModo("alta");
            break;
          }
          case 'editar_linea': {
            setModo("edicion");
            break;
          }
          case "cambiar_cantidad": {
            const { linea, cantidad } = payload as { linea: LineaPresupuesto; cantidad: number };
            await patchCantidadLinea(presupuestoId, linea, cantidad);
            refrescarLineas(linea.id);
            break
          }
          case 'borrar_linea': {
            if (!seleccionada) {
              return;
            }
            const lineaId = seleccionada
            setSeleccionada(undefined);
            setLineas(quitarElemento(lineas, lineaId));
            await deleteLinea(presupuestoId, seleccionada);
            onCabeceraModificada();
            break;
          }
        }
        break;
      }
    }
  }

  return (
    <>
      <LineasLista
        lineas={lineas}
        seleccionada={seleccionada}
        publicar={publicar}
      />
      {
        seleccionada && (
          <QModal nombre="modal" abierto={modo==='edicion'} onCerrar={() => setModo("lista")}>
            <EdicionLinea publicar={publicar} lineaInicial={getElemento(lineas, seleccionada)}/>
          </QModal>
        )
      }
      <QModal nombre="modal" abierto={modo==='alta'} onCerrar={() => setModo("lista")}>
        <AltaLinea publicar={publicar} />
      </QModal>
    </>
  );
};
