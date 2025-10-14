import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import { getSeleccionada } from "@olula/lib/entidad.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { LineaTransferenciaStock, TransferenciaStock } from "../../diseño.ts";
import { obtenerLineasTransferenciaStock } from "../../infraestructura.ts";
import { useMaquinaLineasTransferenciasStock } from "../../maquina_lineas_transferencia_stock.ts";
import { BorrarLineaTransferenciaStock } from "./BorrarLineaTransferenciaStock.tsx";
import { CrearLineaTransferenciaStock } from "./CrearLineaTransferenciaStock.tsx";
import { DetalleLineaTransferenciaStock } from "./DetalleLineaTransferenciaStock.tsx";

const metaTablaLineasTransferenciaStock: MetaTabla<LineaTransferenciaStock> = [
  { id: "id", cabecera: "ID" },
  { id: "descripcion_producto", cabecera: "Artículo" },
  { id: "cantidad", cabecera: "Cantidad" },
];

export const LineasTransferenciaStock = ({
  transferencia,
}: {
  transferencia: HookModelo<TransferenciaStock>;
}) => {
  const [
    emitir,
    {
      estado,
      contexto: { lineas },
    },
  ] = useMaquinaLineasTransferenciasStock();

  const setEntidades = useCallback(
    (payload: LineaTransferenciaStock[]) => emitir("lineas_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: LineaTransferenciaStock) => emitir("linea_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(lineas);

  const obtenerLineas = useCallback(
    (...args: [Filtro, Orden, Paginacion]) =>
      obtenerLineasTransferenciaStock(transferencia.modelo.id, ...args),
    [transferencia]
  );

  return (
    <>
      {transferencia.editable && (
        <div className="botones maestro-botones ">
          <QBoton onClick={() => emitir("alta_solicitada")}>Nueva</QBoton>
          <QBoton
            deshabilitado={!seleccionada}
            onClick={() => emitir("edicion_solicitada")}
          >
            Editar
          </QBoton>
          <QBoton
            deshabilitado={!seleccionada}
            onClick={() => emitir("borrado_solicitado")}
          >
            Borrar
          </QBoton>
        </div>
      )}
      {!!transferencia.modelo.id && (
        <Listado
          metaTabla={metaTablaLineasTransferenciaStock}
          entidades={lineas.lista}
          setEntidades={setEntidades}
          seleccionada={seleccionada}
          setSeleccionada={setSeleccionada}
          cargar={obtenerLineas}
        />
      )}
      {seleccionada && (
        <QModal
          nombre="modal"
          abierto={estado === "Edicion"}
          onCerrar={() => emitir("edicion_cancelada")}
        >
          <DetalleLineaTransferenciaStock
            emitir={emitir}
            lineaInicial={seleccionada}
            transferenciaID={transferencia.modelo.id}
          />
        </QModal>
      )}
      <CrearLineaTransferenciaStock
        publicar={emitir}
        activo={estado === "Alta"}
        transferenciaID={transferencia.modelo.id}
      />
      <BorrarLineaTransferenciaStock
        publicar={emitir}
        activo={estado === "ConfirmarBorrado"}
        linea={seleccionada!}
        transferenciaID={transferencia.modelo.id}
      />
    </>
  );
};
