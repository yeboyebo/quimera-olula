import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "@olula/componentes/maestro/MaestroDetalleResponsive.tsx";
import { getSeleccionada } from "@olula/lib/entidad.ts";
import { useCallback } from "react";
import { TransferenciaStock } from "../diseño.ts";
import { obtenerTransferenciasStock } from "../infraestructura.ts";
import { useMaquinaTransferenciasStock } from "../maquina_listado_transferencias_stock.ts";
import { CrearTransferenciaStock } from "./CrearTransferenciaStock.tsx";
import { DetalleTransferenciaStock } from "./DetalleTransferenciaStock.tsx";

const metaTablaTransferenciaStock: MetaTabla<TransferenciaStock> = [
  { id: "id", cabecera: "ID" },
  { id: "nombre_origen", cabecera: "Origen" },
  { id: "nombre_destino", cabecera: "Destino" },
  {
    id: "fecha",
    cabecera: "Fecha",
    render: (v) =>
      new Date(v.fecha).toLocaleString(undefined, {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];

export const MaestroDetalleTransferenciasStock = () => {
  const [
    emitir,
    {
      estado,
      contexto: { transferencias },
    },
  ] = useMaquinaTransferenciasStock();

  const setEntidades = useCallback(
    (payload: TransferenciaStock[]) =>
      emitir("transferencias_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: TransferenciaStock) =>
      emitir("transferencia_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(transferencias);

  return (
    <div className="TransferenciaStock">
      <MaestroDetalleResponsive<TransferenciaStock>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Transferencias</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaTransferenciaStock}
              entidades={transferencias.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={obtenerTransferenciasStock}
            />
          </>
        }
        Detalle={
          <DetalleTransferenciaStock
            key={seleccionada?.id}
            inicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <CrearTransferenciaStock
        publicar={emitir}
        activo={estado === "Creando"}
      />
    </div>
  );
};
