import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect, useState } from "react";
import { CrearCliente } from "../crear/CrearCliente.tsx";
import { DetalleCliente } from "../detalle/DetalleCliente.tsx";
import { Cliente } from "../diseño.ts";
import { metaTablaCliente } from "./diseño.ts";
import "./MaestroConDetalleCliente.css";
import { getMaquina } from "./maquina.ts";

export const MaestroConDetalleCliente = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    clientes: [],
    totalClientes: 0,
    clienteActivo: null,
  });

  const crear = useCallback(() => emitir("creacion_solicitada"), [emitir]);

  const setSeleccionada = useCallback(
    (payload: Cliente) => emitir("cliente_seleccionado", payload),
    [emitir]
  );

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
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nuevo Cliente</QBoton>
            </div>
            <ListadoControlado<Cliente>
              metaTabla={metaTablaCliente}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              cargando={cargando}
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

      <CrearCliente
        publicar={emitir}
        onCancelar={() => emitir("creacion_cancelada")}
        activo={ctx.estado === "CREANDO_CLIENTE"}
      />
    </div>
  );
};
