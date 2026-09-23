import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { ReciboVenta } from "../../diseño.js";
import { metaTablaReciboVenta } from "../../maestro/metatabla_recibo_venta.js";

export const RecibosAgrupados = ({ recibos }: { recibos: ReciboVenta[] }) => (
  <div className="RecibosAgrupados">
    <h3>Recibos agrupados</h3>

    <ListadoSemiControlado
      metaTabla={metaTablaReciboVenta}
      entidades={recibos}
      totalEntidades={recibos.length}
      cargando={false}
      seleccionada={null}
      onSeleccion={() => null}
      criteriaInicial={criteriaDefecto}
      onCriteriaChanged={() => null}
      modo="tabla"
    />
  </div>
);
