import { MetaTabla } from "@olula/componentes/atomos/qtablacontrolada.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { ReciboDeRemesa } from "../../diseño.js";

const metaTablaRecibos: MetaTabla<ReciboDeRemesa> = [
  { id: "codigo", cabecera: "Código" },
  { id: "nombreCliente", cabecera: "Cliente" },
  { id: "fechaVencimiento", cabecera: "F. Vencimiento", tipo: "fecha" },
  { id: "estado", cabecera: "Estado" },
  { id: "situacion", cabecera: "Situación" },
  { id: "importe", cabecera: "Importe", tipo: "moneda" },
];

export const RecibosRemesa = ({ recibos }: { recibos: ReciboDeRemesa[] }) => (
  <div className="RecibosRemesa">
    <ListadoSemiControlado
      metaTabla={metaTablaRecibos}
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
