import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoActivoControlado } from "@olula/componentes/maestro/ListadoActivoControlado.js";
import { MaestroDetalleActivoControlado } from "@olula/componentes/maestro/MaestroDetalleActivoControlado.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { DetalleCliente } from "../detalle/DetalleCliente.tsx";
import { Cliente } from "../diseño.ts";
import { metaTablaCliente } from "./maestro.ts";
import "./MaestroClientes.css";
import { getMaquina } from "./maquina.ts";

export const MaestroClientes = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    clientes: listaActivaEntidadesInicial<Cliente>(id, criteria),
  });

  useUrlParams(ctx.clientes.activo, ctx.clientes.criteria);

  useEffect(() => {
    emitir("recarga_de_clientes_solicitada", ctx.clientes.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Cliente">
      <MaestroDetalleActivoControlado<Cliente>
        Maestro={
          <>
            <h2>Clientes</h2>

            <ListadoActivoControlado<Cliente>
              metaTabla={metaTablaCliente}
              criteria={ctx.clientes.criteria}
              modo={"tabla"}
              entidades={ctx.clientes.lista}
              totalEntidades={ctx.clientes.total}
              seleccionada={ctx.clientes.activo}
              onSeleccion={(payload) => emitir("cliente_seleccionado", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={<DetalleCliente id={ctx.clientes.activo} publicar={emitir} />}
        seleccionada={ctx.clientes.activo}
        modoDisposicion="maestro-50"
      />
    </div>
  );
};
