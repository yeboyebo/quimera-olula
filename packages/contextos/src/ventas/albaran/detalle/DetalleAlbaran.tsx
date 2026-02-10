import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../venta/vistas/TotalesVenta.tsx";
import { BorrarAlbaran } from "../borrar/BorrarAlbaran.tsx";
import { Albaran } from "../diseño.ts";
import { albaranVacio, editable, metaAlbaran } from "../dominio.ts";
import "./DetalleAlbaran.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

export const DetalleAlbaran = ({
  albaranInicial = null,
  publicar = async () => {},
}: {
  albaranInicial?: Albaran | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const albaranId = albaranInicial?.id ?? params.id;
  const albaranIdCargadoRef = useRef<string | null>(null);

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      albaran: albaranInicial || albaranVacio(),
      albaranInicial: albaranInicial || albaranVacio(),
      lineaActiva: null,
    },
    publicar
  );

  const albaran = useModelo(metaAlbaran, ctx.albaran);

  useEffect(() => {
    if (albaranId && albaranId !== albaranIdCargadoRef.current) {
      albaranIdCargadoRef.current = albaranId;
      emitir("albaran_id_cambiado", albaranId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albaranId]);

  const { estado, lineaActiva } = ctx;

  const titulo = (albaran: Albaran) => albaran.codigo || "Nuevo Albarán";

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_albaran_lista", albaran.modelo);
  }, [emitir, albaran]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_albaran_cancelada");
  }, [emitir]);

  const acciones = [
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("borrar_solicitado"),
    },
  ];

  return (
    <Detalle
      id={albaranId}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.albaran}
      cerrarDetalle={() => emitir("albaran_deseleccionado", null)}
    >
      {!!albaranId && (
        <>
          <QuimeraAcciones acciones={acciones} vertical />

          <Tabs>
            <Tab label="Cliente">
              <TabCliente albaran={albaran} estado={estado} publicar={emitir} />
            </Tab>

            <Tab label="Datos">
              <TabDatos albaran={albaran} />
            </Tab>

            <Tab label="Observaciones">
              <TabObservaciones albaran={albaran} />
            </Tab>
          </Tabs>

          {editable(ctx.albaran) && (
            <div className="botones maestro-botones">
              <QBoton onClick={handleGuardar}>Guardar Cambios</QBoton>
              <QBoton tipo="reset" variante="texto" onClick={handleCancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          <TotalesVenta
            neto={Number(ctx.albaran.neto ?? 0)}
            totalIva={Number(ctx.albaran.total_iva ?? 0)}
            total={Number(ctx.albaran.total ?? 0)}
            divisa={String(ctx.albaran.divisa_id || "EUR")}
          />

          <Lineas
            albaran={ctx.albaran}
            lineaActiva={lineaActiva}
            publicar={emitir}
            estadoAlbaran={estado}
          />

          {estado === "BORRANDO_ALBARAN" && (
            <BorrarAlbaran albaran={ctx.albaran} publicar={emitir} />
          )}
        </>
      )}
    </Detalle>
  );
};
