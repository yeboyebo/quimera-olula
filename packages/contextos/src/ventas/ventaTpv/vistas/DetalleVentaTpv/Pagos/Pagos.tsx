import { PagoVentaTpv, VentaTpv } from "#/ventas/ventaTpv/diseño.ts";
import { QBoton } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, ListaSeleccionable } from "@olula/lib/diseño.js";
import {
  getSeleccionada
} from "@olula/lib/entidad.ts";
import { HookModelo } from "@olula/lib/useModelo.js";
import { useContext } from "react";
import { EstadoVentaTpv } from "../DetalleVentaTpv.tsx";
import { PagosLista } from "./PagosLista.tsx";
export const Pagos = ({
  pagos,
  venta,
  estado,
  publicar= () => { },
  // facturaEditable,
  // onCabeceraModificada,
}: {
  pagos: ListaSeleccionable<PagoVentaTpv>;
  venta: HookModelo<VentaTpv>;
  estado: EstadoVentaTpv;
  publicar?: EmitirEvento;
  // onCabeceraModificada: () => void;
  // facturaEditable?: boolean;
}) => {
  const { intentar } = useContext(ContextoError);


  // useEffect(() => {
  //   const cargarLineas = async () => {
  //     const nuevasLineas = await intentar(() => getLineas(facturaId));
  //     emitir("lineas_cargadas", nuevasLineas);
  //   };

  //   emitir("cargar");
  //   cargarLineas();
  // }, [facturaId, emitir, intentar]);

  const seleccionado = getSeleccionada(pagos);

  // const refrescarCabecera = async () => {
  //   const lineasCargadas = await getLineas(facturaId);
  //   emitir("lineas_cargadas", lineasCargadas);
  //   onCabeceraModificada();
  // };

  return (
    <>
      {venta.editable && (
        <div className="botones maestro-botones ">
          <QBoton onClick={() => publicar("pago_efectivo_solicitado")}>Nuevo</QBoton>
          <QBoton
            deshabilitado={!seleccionado}
            onClick={() => publicar("editar_pago_solicitado")}
          >
            Editar
          </QBoton>
          <QBoton
            deshabilitado={!seleccionado}
            onClick={() => publicar("borrar_pago_solicitado")}
          >
            Borrar
          </QBoton>
        </div>
      )}
      <PagosLista
        pagos={pagos}
        // seleccionado={seleccionado?.id}
        publicar={publicar}
        idVenta={venta.modelo.id}
        // refrescarCabecera={refrescarCabecera}
      />
      {/* <AltaPago
        publicar={publicar}
        activo={estado === "PAGANDO_EFECTIVO"}
        venta={venta.modelo}
        refrescarCabecera={refrescarCabecera}
      /> */}

      {/* {seleccionada && (
        <EdicionLinea
          publicar={emitir}
          activo={estado === "Editando" && seleccionada !== null}
          lineaSeleccionada={seleccionada}
          idFactura={facturaId}
          refrescarCabecera={refrescarCabecera}
        />
      )}
       */}
    </>
  );
};
