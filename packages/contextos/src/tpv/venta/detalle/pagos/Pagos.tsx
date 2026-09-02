import { PagoVentaTpv } from "#/tpv/venta/diseño.ts";
import { QBoton } from "@olula/componentes/index.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { imprimirVale } from "../detalle.ts";
import { PagosLista } from "./PagosLista.tsx";
export const Pagos = ({
  pagos,
  pagoActivo,
  publicar= async () => { },
}: {
  pagos: PagoVentaTpv[];
  pagoActivo: PagoVentaTpv | null;
  publicar?: EmitirEvento;

}) => {

  return (
    <>
      <div className="botones maestro-botones ">
        {pagoActivo?.arqueoAbierto && (
          <QBoton texto='Borrar'
            deshabilitado={!pagoActivo}
            onClick={() => publicar("borrar_pago_solicitado")}
          />
        )}
        <QBoton texto='Reimprimir vale'
          deshabilitado={!(pagoActivo?.saldoVale != null && pagoActivo.saldoVale > 0)}
          onClick={() => imprimirVale(pagoActivo!.vale!)}
        />
      </div>
      <PagosLista
        pagos={pagos}
        pagoActivo={pagoActivo}
        publicar={publicar}
      />
    </>
  );
};
