import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtablacontrolada.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { MovimientoRemesa, Remesa } from "../../diseño.js";
import { remesaConPago, remesaPagable } from "../../dominio.js";

const metaTablaPagos: MetaTabla<MovimientoRemesa> = [
  { id: "fecha", cabecera: "Fecha", tipo: "fecha" },
  { id: "tipo", cabecera: "Tipo" },
];

export const PagosRemesa = ({
  remesa,
  publicar,
}: {
  remesa: Remesa;
  publicar: EmitirEvento;
}) => (
  <div className="PagosRemesa">
    <ListadoSemiControlado
      metaTabla={metaTablaPagos}
      entidades={remesa.pagos}
      totalEntidades={remesa.pagos.length}
      cargando={false}
      seleccionada={null}
      onSeleccion={() => null}
      criteriaInicial={criteriaDefecto}
      onCriteriaChanged={() => null}
      modo="tabla"
      renderAcciones={() => (
        <div className="maestro-botones">
          {remesaPagable(remesa) && (
            <QBoton onClick={() => publicar("pago_solicitado")}>Pagar</QBoton>
          )}
          {remesaConPago(remesa) && (
            <QBoton
              advertencia
              onClick={() => publicar("deshacer_pago_solicitado")}
            >
              Deshacer pago
            </QBoton>
          )}
        </div>
      )}
    />
  </div>
);
