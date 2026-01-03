import { EstadoVentaTpv, PagoVentaTpv, VentaTpv } from "#/tpv/ventaTpv/diseño.ts";
import { QBoton } from "@olula/componentes/index.ts";
import { EmitirEvento, ListaSeleccionable } from "@olula/lib/diseño.js";
import {
  getSeleccionada
} from "@olula/lib/entidad.ts";
import { HookModelo } from "@olula/lib/useModelo.js";
import { PagosLista } from "./PagosLista.tsx";
export const Pagos = ({
  pagos,
  venta,
  estado,
  publicar= () => { },
}: {
  pagos: ListaSeleccionable<PagoVentaTpv>;
  venta: HookModelo<VentaTpv>;
  estado: EstadoVentaTpv;
  publicar?: EmitirEvento;

}) => {

  const seleccionado = getSeleccionada(pagos);

  return (
    <>
      {estado !== "EMITIDA" && (
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
        publicar={publicar}
        // idVenta={venta.modelo.id}
      />

    </>
  );
};
