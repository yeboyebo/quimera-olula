import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { TransferenciaStock } from "../diseño.ts";
import { metaTransferenciaStock, transferenciaStockVacia } from "../dominio.ts";
import {
  actualizarTransferenciaStock,
  obtenerTransferenciaStock,
} from "../infraestructura.ts";
import { useMaquinaTransferenciaStock } from "../maquina_detalle_transferencia_stock.ts";
import { BorrarTransferenciaStock } from "./BorrarTransferenciaStock.tsx";
import { LineasTransferenciaStock } from "./lineas/LineasTransferenciaStock.tsx";
import "./TransferenciasStock.css";

const titulo = (transferencia: TransferenciaStock) =>
  transferencia.origen + " -> " + transferencia.destino;

export const DetalleTransferenciaStock = ({
  inicial: inicial = null,
  publicar = async () => {},
}: {
  inicial?: TransferenciaStock | null;
  publicar?: ProcesarEvento;
}) => {
  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const transferencia = useModelo(
    metaTransferenciaStock,
    transferenciaStockVacia
  );
  const { modelo, uiProps, init } = transferencia;

  const guardar = async () => {
    await intentar(() => actualizarTransferenciaStock(modelo.id, modelo));
    recargarCabecera();
    emitir("transferencia_guardada");
  };

  const cancelar = () => {
    init();
  };

  const [emitir, { estado }] = useMaquinaTransferenciaStock(publicar);

  const recargarCabecera = async () => {
    const nuevaTransferenciaStock = await intentar(() =>
      obtenerTransferenciaStock(modelo.id)
    );
    init(nuevaTransferenciaStock);
    publicar("transferencia_cambiada", nuevaTransferenciaStock);
  };

  const transferenciaID = inicial?.id ?? params.id;

  return (
    <Detalle
      id={transferenciaID}
      obtenerTitulo={titulo}
      setEntidad={(accionInicial) => init(accionInicial)}
      entidad={modelo}
      cargar={obtenerTransferenciaStock}
      cerrarDetalle={() => publicar("cancelar_seleccion")}
    >
      {!!transferenciaID && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <div className="DetalleTransferenciaStock">
            <quimera-formulario>
              <Almacen label="Origen" {...uiProps("origen", "nombre_origen")} />
              <Almacen
                label="Destino"
                {...uiProps("destino", "nombre_destino")}
              />
              <QDate label="Fecha" {...uiProps("fecha")} />
            </quimera-formulario>
          </div>
          {transferencia.modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!transferencia.valido}>
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={cancelar}
                deshabilitado={!transferencia.modificado}
              >
                Cancelar
              </QBoton>
            </div>
          )}
          <LineasTransferenciaStock
            transferencia={transferencia}
            // onCabeceraModificada={recargarCabecera}
          />
          <BorrarTransferenciaStock
            publicar={emitir}
            activo={estado === "Borrando"}
            transferencia={modelo}
          />
        </>
      )}
    </Detalle>
  );
};
