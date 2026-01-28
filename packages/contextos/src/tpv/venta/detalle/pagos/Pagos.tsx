import { PagoVentaTpv } from "#/tpv/venta/diseño.ts";
import { QBoton } from "@olula/componentes/index.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { EstadoVentaTpv } from "../detalle.ts";
import { PagosLista } from "./PagosLista.tsx";
export const Pagos = ({
  pagos,
  pagoActivo,
  estado,
  publicar= async () => { },
}: {
  pagos: PagoVentaTpv[];
  pagoActivo: PagoVentaTpv | null;
  estado: EstadoVentaTpv;
  publicar?: EmitirEvento;

}) => {

  return (
    <>
      {estado !== "EMITIDA" && (
        <div className="botones maestro-botones ">
          <QBoton onClick={() => publicar("pago_efectivo_solicitado")}>Nuevo</QBoton>
          <QBoton
            deshabilitado={!pagoActivo}
            onClick={() => publicar("editar_pago_solicitado")}
          >
            Editar
          </QBoton>
          <QBoton
            deshabilitado={!pagoActivo}
            onClick={() => publicar("borrar_pago_solicitado")}
          >
            Borrar
          </QBoton>
        </div>
      )}
      <PagosLista
        pagos={pagos}
        pagoActivo={pagoActivo}
        publicar={publicar}
      />
    </>
  );
};
