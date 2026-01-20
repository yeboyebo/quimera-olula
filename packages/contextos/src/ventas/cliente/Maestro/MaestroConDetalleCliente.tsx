import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto, procesarEvento } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { DetalleCliente } from "../Detalle/DetalleCliente.tsx";
import { Cliente } from "../diseño.ts";
import { ContextoMaestroCliente, metaTablaCliente } from "./diseño.ts";
import "./MaestroConDetalleCliente.css";
import { getMaquina } from "./maquina.ts";

export const MaestroConDetalleCliente = () => {
  const { intentar } = useContext(ContextoError);
  const [cargando, setCargando] = useState(false);

  const [ctx, setCtx] = useState<ContextoMaestroCliente>({
    estado: "INICIAL",
    clientes: [],
    totalClientes: 0,
    clienteActivo: null,
  });

  const maquina = getMaquina();

  const emitir = useCallback(
    async (evento: string, payload?: unknown) => {
      const [nuevoContexto, _] = await intentar(() =>
        procesarEvento(maquina, ctx, evento, payload)
      );
      setCtx(nuevoContexto);
    },
    [ctx, setCtx, intentar, maquina]
  );

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
    </div>
  );
};
