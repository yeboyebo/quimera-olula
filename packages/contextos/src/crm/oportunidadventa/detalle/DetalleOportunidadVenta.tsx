import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useParams } from "react-router";
import { BorrarOportunidadVenta } from "../borrar/BorrarOportunidadVenta.tsx";
import { OportunidadVenta } from "../diseño.ts";
import { Acciones } from "./acciones/Acciones.tsx";
import { metaOportunidadVenta, oportunidadVentaVacia } from "./detalle.ts";
import "./DetalleOportunidadVenta.css";
import { getMaquina } from "./maquina.ts";
import { Presupuestos } from "./presupuestos/Presupuestos.tsx";
import { TabDatos } from "./tabs/TabDatos.tsx";
import { TabObservaciones } from "./tabs/TabObservaciones.tsx";

export const DetalleOportunidadVenta = ({
  inicial = null,
  publicar,
}: {
  inicial: OportunidadVenta | null;
  publicar: EmitirEvento;
}) => {
  const params = useParams();

  const oportunidadId = inicial?.id ?? params.id;
  const titulo = (oportunidad: Entidad) => oportunidad.descripcion as string;

  const oportunidad = useModelo(metaOportunidadVenta, oportunidadVentaVacia);
  const { modelo, modeloInicial, modificado, valido, init } = oportunidad;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      oportunidad: modelo,
      inicial: modeloInicial,
    },
    publicar
  );

  if (ctx.oportunidad !== modeloInicial) {
    init(ctx.oportunidad);
  }

  if (oportunidadId && oportunidadId !== modelo.id) {
    emitir("oportunidad_id_cambiado", oportunidadId);
  }

  return (
    <Detalle
      id={oportunidadId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("edicion_oportunidad_cancelada", null)}
    >
      {!!oportunidadId && (
        <div className="DetalleOportunidad">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrado_oportunidad_solicitado")}>
              Borrar
            </QBoton>
          </div>

          <Tabs>
            <Tab label="Datos">
              <TabDatos oportunidad={oportunidad} />
            </Tab>

            <Tab label="Observaciones">
              <TabObservaciones oportunidad={oportunidad} />
            </Tab>

            <Tab label="Acciones">
              <Acciones oportunidad={oportunidad} />
            </Tab>

            <Tab label="Presupuestos">
              <Presupuestos oportunidad={oportunidad} />
            </Tab>
          </Tabs>

          {modificado && (
            <div className="botones maestro-botones">
              <QBoton
                onClick={() => emitir("oportunidad_cambiada", modelo)}
                deshabilitado={!valido}
              >
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => emitir("edicion_oportunidad_cancelada")}
              >
                Cancelar
              </QBoton>
            </div>
          )}

          {ctx.estado === "BORRANDO" && (
            <BorrarOportunidadVenta publicar={emitir} oportunidad={modelo} />
          )}
        </div>
      )}
    </Detalle>
  );
};
