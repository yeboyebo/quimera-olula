import { Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, useStateValue, util } from "quimera";

import { AgenteSmartsales } from "../../../comps";

function FilterClientes() {
  const [{ showFilter, clientes }] = useStateValue();
  const agenteSmartsalesEnabled =
    util.getUser()?.superuser ||
      util.getUser().group === "MKT" ||
      util.getUser().group === "Responsable de marketing"
      ? true
      : false;

  return (
    <Quimera.Template id="FilterClientes">
      <FilterBox id="clientes.filter" schema={getSchemas().clientes} open={showFilter}>
        <Filter.Schema id="nombre" />
        <Filter.Schema id="codCliente" label="Código" />
        <Filter.Schema id="cifNif" />
        {agenteSmartsalesEnabled && (
          <AgenteSmartsales id="codagente" label="Agente" filterField={true} fullWidth async />
        )}
      </FilterBox>
    </Quimera.Template>
  );
}

export default FilterClientes;
