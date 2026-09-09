import { QBoton, QModal } from "@olula/componentes/index.ts";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import "./DetalleAprobarPresupuesto.css";
import { contextoVacio } from "./dominio.ts";
import { Lineas } from "./Lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";

type UrlPorId = (id: string) => string;

export const DetalleAprobarPresupuesto = () => {
  const params = useParams();
  const navigate = useNavigate();
  const presupuestoId = params.id;
  const presupuestoIdCargadoRef = useRef<string | null>(null);

  // Las rutas de retorno dependen de la app: olula usa rutas propias
  // (singular), mientras que las apps con legacy (p.ej. cabrera) navegan a las
  // vistas legacy (plural). Se resuelven por factory con fallback a olula.
  const { app } = useContext(FactoryCtx);
  const urlPresupuesto =
    (app.Ventas?.presupuesto_url_presupuesto as UrlPorId | undefined) ??
    ((id: string) => `/ventas/presupuesto?id=${id}`);
  const urlPedido =
    (app.Ventas?.presupuesto_url_pedido as UrlPorId | undefined) ??
    ((id: string) => `/ventas/pedido?id=${id}`);

  const { ctx, emitir } = useMaquina(getMaquina, contextoVacio, async () => {});

  const { presupuesto, lineas, pedidoCreado } = ctx;

  useEffect(() => {
    if (presupuestoId && presupuestoId !== presupuestoIdCargadoRef.current) {
      presupuestoIdCargadoRef.current = presupuestoId;
      emitir("cargar", presupuestoId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presupuestoId]);

  if (
    ctx.estado === "INICIAL" ||
    ctx.estado === "VACIO" ||
    ctx.estado === "CARGANDO"
  ) {
    return <div className="AprobarPresupuesto">Cargando...</div>;
  }

  return (
    <div className="AprobarPresupuesto">
      <div className="DetalleAprobarPresupuesto">
        <h2>
          Aprobar Presupuesto: {presupuesto.cliente.nombre_cliente} - {presupuesto.codigo}
        </h2>
        <Lineas
          presupuesto={presupuesto}
          lineas={lineas}
          estado={ctx.estado}
          publicar={emitir}
        />
      </div>

      <QModal
        nombre="pedidoCreado"
        abierto={ctx.estado === "PEDIDO_CREADO" && Boolean(pedidoCreado)}
        titulo="Pedido generado"
        onCerrar={() => emitir("pedido_creado_cerrado")}
      >
        <div className="mensaje" style={{ whiteSpace: "pre-line" }}>
          El pedido se ha generado correctamente.
        </div>
        <div className="botones">
          <QBoton
            variante="texto"
            onClick={() => presupuestoId && navigate(urlPresupuesto(presupuestoId))}
          >
            Volver al presupuesto
          </QBoton>
          <QBoton
            onClick={() =>
              pedidoCreado && navigate(urlPedido(pedidoCreado.id))
            }
          >
            Ir al pedido {pedidoCreado?.codigo}
          </QBoton>
        </div>
      </QModal>
    </div>
  );
};
