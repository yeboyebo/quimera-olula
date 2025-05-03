import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { refrescarSeleccionada } from "../../../comun/dominio.ts";
import { HookModelo } from "../../../comun/useModelo.ts";
import { LineaPresupuesto as Linea, LineaPresupuesto, NuevaLinea, Presupuesto } from "../diseño.ts";
import { deleteLinea, getLineas, patchCantidadLinea, patchLinea, postLinea } from "../infraestructura.ts";
import { AltaLinea } from "./AltaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";
export const Lineas = ({
  onCabeceraModificada,
  presupuesto,
}: {
  onCabeceraModificada: () => void;
  presupuesto: HookModelo<Presupuesto>;
}) => {
  const [modo, setModo] = useState("lista");
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [seleccionada, setSeleccionada] = useState<string | undefined>(undefined);
  const presupuestoId = presupuesto?.modelo?.id ;
  
  const getElemento = <T extends Entidad>(lista: T[], id: string): T => {
    const elementos = lista.filter((e) => e.id === id);
    if (elementos.length === 1) {
      return elementos[0];
    }
    throw new Error(`No se encontró el elemento con id ${id}`);
  };

  const refrescarLineas = async (idSeleccionada?: string) => {
    const lineas = await getLineas(presupuestoId);
    setLineas(lineas);
    onCabeceraModificada();
    refrescarSeleccionada(lineas, idSeleccionada, setSeleccionada);
    if (idSeleccionada) {
      refrescarSeleccionada(lineas, idSeleccionada, setSeleccionada);
    }
  };

  const cargar = useCallback(async () => {
    const lineas = await getLineas(presupuestoId);
    setLineas(lineas);
    const lineaSeleccionada = seleccionada ? seleccionada : lineas.length > 0 ? lineas[0].id : undefined
    refrescarSeleccionada(lineas, lineaSeleccionada, setSeleccionada);
  }, [presupuestoId, setLineas, seleccionada, setSeleccionada]);

  useEffect(() => {
    if (presupuestoId) cargar();
  }, [presupuestoId, cargar]);
  
  const procesarEvento = async (evento: string, payload?: unknown) => {
    console.log("procesarEvento", evento, payload, 'estado actual', modo);

    switch(modo) {
      case 'alta': {
        switch(evento) {
          case 'ALTA_LISTA': {
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
          case 'EDICION_LISTA': {
            const linea = payload as LineaPresupuesto;
            await patchLinea(presupuestoId, linea);
            refrescarLineas(linea.id);
            setModo("lista");
            break;
          }
          case 'EDICION_CANCELADA': {
            setModo("lista");
            break;
          }
        }
        break;
      }
      case 'lista': {
        switch(evento) {
          case 'LINEA_SELECCIONADA': {
            const idLinea = payload as string;
            setSeleccionada(idLinea);
            break;
          }
          case 'ALTA_SOLICITADA': {
            setModo("alta");
            break;
          }
          case 'EDICION_SOLICITADA': {
            setModo("edicion");
            break;
          }
          case "CAMBIO_CANTIDAD_SOLICITADO": {
            const { linea, cantidad } = payload as { linea: LineaPresupuesto; cantidad: number };
            await patchCantidadLinea(presupuestoId, linea, cantidad);
            refrescarLineas(linea.id);
            break
          }
          case 'BORRADO_SOLICITADO': {
            if (!seleccionada) {
              return;
            }
            setSeleccionada(undefined);
            await deleteLinea(presupuestoId, seleccionada);
            refrescarLineas();
            break;
          }
        }
        break;
      }
    }
  }
  const emitir = procesarEvento

  return (
    <>
      {presupuesto.editable && 
        (
          <div className="botones maestro-botones ">
            <QBoton onClick={() => emitir('ALTA_SOLICITADA')}>
              Nueva
            </QBoton>
            <QBoton
              onClick={() => seleccionada && emitir('EDICION_SOLICITADA')}
              deshabilitado={!seleccionada}
            >
              Editar
            </QBoton>
            <QBoton deshabilitado={!seleccionada} onClick={() => seleccionada && emitir('BORRADO_SOLICITADO')}>
              Borrar
            </QBoton>
          </div>
        )
      }
      <LineasLista
        lineas={lineas}
        seleccionada={seleccionada}
        emitir={emitir}
      />
      {
        seleccionada && (
          <QModal nombre="modal" abierto={modo==='edicion'} onCerrar={() => emitir("EDICION_CANCELADA")}>
            <EdicionLinea emitir={emitir} lineaInicial={getElemento(lineas, seleccionada)}/>
          </QModal>
        )
      }
      <QModal nombre="modal" abierto={modo==='alta'} onCerrar={() => setModo("lista")}>
        <AltaLinea emitir={emitir} />
      </QModal>
    </>
  );
};
