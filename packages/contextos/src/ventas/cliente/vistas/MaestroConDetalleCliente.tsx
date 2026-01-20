import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect } from "react";
import { Cliente } from "../diseño.ts";
import { metaTablaCliente } from "../dominio.ts";
import { getMaquina } from "../maquinaMaestro.ts";
import { AltaCliente } from "./AltaCliente.tsx";
import { DetalleCliente } from "./DetalleCliente/DetalleCliente.tsx";
import "./MaestroConDetalleCliente.css";

export const MaestroConDetalleCliente = () => {
  const { ctx, emitir } = useMaestro(getMaquina, {
    estado: "INICIAL",
    clientes: [],
    totalClientes: 0,
    clienteActivo: null,
  });

  const setSeleccionada = useCallback(
    (payload: Cliente) => void emitir("cliente_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    (criteria: Criteria) => {
      void emitir("recarga_de_clientes_solicitada", criteria);
    },
    [emitir]
  );

  useEffect(() => {
    emitir("recarga_de_clientes_solicitada", criteriaDefecto);
  }, []);

  return (
    <div className="Cliente">
      <MaestroDetalleControlado<Cliente>
        Maestro={
          <>
            <h2>Clientes</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("creacion_de_cliente_solicitada")}>
                Nuevo Cliente
              </QBoton>
            </div>
            <ListadoControlado<Cliente>
              metaTabla={metaTablaCliente}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              entidades={ctx.clientes}
              totalEntidades={ctx.totalClientes}
              seleccionada={ctx.clienteActivo}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleCliente
            clienteInicial={ctx.clienteActivo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.clienteActivo}
        modoDisposicion="maestro-50"
      />

      <AltaCliente
        publicar={emitir}
        onCancelar={() => emitir("creacion_cancelada")}
        activo={ctx.estado === "CREANDO_CLIENTE"}
      />
    </div>
  );
};
