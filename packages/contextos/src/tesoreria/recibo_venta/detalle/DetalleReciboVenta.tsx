import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useEffect } from "react";
import { ReciboVenta } from "../diseño.js";
import {
  contextoDetalleReciboVentaInicial,
  metaReciboVenta,
} from "./detalle.js";
import "./DetalleReciboVenta.css";
import { getMaquina } from "./maquina.js";
import { PagarReciboVenta } from "./pagar/PagarReciboVenta.tsx";
import { TabGeneral } from "./TabGeneral.js";

export const DetalleReciboVenta = ({
  id,
  publicar = async () => {},
}: {
  id?: string;
  publicar?: EmitirEvento;
}) => {
  const { ctx, emitir } = useMaquina(
    getMaquina,
    contextoDetalleReciboVentaInicial,
    publicar
  );

  const formModelo = useModelo(metaReciboVenta, ctx.recibo);

  useEffect(() => {
    emitir("recibo_id_cambiado", id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!ctx.recibo.id) return null;

  const titulo = (r: ReciboVenta) => r.codigo || `Recibo ${r.id}`;

  const acciones = [
    {
      texto: "Pagar",
      onClick: () => emitir("pagar_solicitado"),
    },
  ];

  return (
    <Detalle
      id={id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.recibo}
      cerrarDetalle={() => emitir("recibo_deseleccionado", null, true)}
    >
      <div className="DetalleReciboVenta">
        <QuimeraAcciones acciones={acciones} vertical />
        <Tabs
          children={[
            <Tab
              label="General"
              key="tab-general"
              children={<TabGeneral form={formModelo} />}
            />,
          ]}
        />

        {ctx.estado === "PAGANDO" && <PagarReciboVenta publicar={emitir} />}
      </div>
    </Detalle>
  );
};
