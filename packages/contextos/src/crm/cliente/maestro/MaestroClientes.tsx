import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect, useState } from "react";
import { DetalleCliente } from "../detalle/DetalleCliente.tsx";
import { Cliente } from "../diseño.ts";
import { metaTablaCliente } from "./maestro.ts";
import "./MaestroClientes.css";
import { getMaquina } from "./maquina.ts";

export const MaestroClientes = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    clientes: listaEntidadesInicial<Cliente>(),
  });

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_clientes_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="Cliente">
      <MaestroDetalleControlado<Cliente>
        Maestro={
          <>
            <h2>Clientes</h2>

            <ListadoControlado<Cliente>
              metaTabla={metaTablaCliente}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              // setModo={handleSetModoVisualizacion}
              // tarjeta={tarjeta}
              entidades={ctx.clientes.lista}
              totalEntidades={ctx.clientes.total}
              seleccionada={ctx.clientes.activo}
              onSeleccion={(payload) => emitir("cliente_seleccionado", payload)}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleCliente inicial={ctx.clientes.activo} publicar={emitir} />
        }
        seleccionada={ctx.clientes.activo}
        modoDisposicion="maestro-50"
      />
    </div>
  );
};
