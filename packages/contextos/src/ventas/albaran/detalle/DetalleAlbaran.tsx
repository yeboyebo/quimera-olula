import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useCallback } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../venta/vistas/TotalesVenta.tsx";
import { BorrarAlbaran } from "../borrar/BorrarAlbaran.tsx";
import { Albaran } from "../diseño.ts";
import { editable } from "../dominio.ts";
import "./DetalleAlbaran.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";
import { useAlbaran } from "./hooks/useAlbaran.ts";

export const DetalleAlbaran = ({
  albaranInicial = null,
  publicar = () => {},
}: {
  albaranInicial?: Albaran | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();

  const albaran = useAlbaran({
    albaranId: albaranInicial?.id ?? params.id,
    albaranInicial,
    publicar,
  });

  const { modelo, estado, lineaActiva, emitir } = albaran;

  const titulo = (albaran: Albaran) => albaran.codigo || "Nuevo Albarán";

  const handleBorrar = useCallback(() => {
    emitir("borrar_solicitado");
  }, [emitir]);

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_albaran_lista", modelo);
  }, [emitir, modelo]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_albaran_cancelada");
  }, [emitir]);

  return (
    <Detalle
      id={albaranInicial?.id ?? params.id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={modelo}
      cerrarDetalle={() => emitir("albaran_deseleccionado", null)}
    >
      {!!(albaranInicial?.id ?? params.id) && (
        <>
          <div className="acciones-rapidas">
            <QBoton tipo="reset" variante="texto" onClick={handleBorrar}>
              Borrar
            </QBoton>
          </div>

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

          {editable(modelo) && (
            <div className="botones maestro-botones">
              <QBoton onClick={handleGuardar}>Guardar Cambios</QBoton>
              <QBoton tipo="reset" variante="texto" onClick={handleCancelar}>
                Cancelar
              </QBoton>
            </div>
          )}

          <TotalesVenta
            neto={Number(modelo.neto ?? 0)}
            totalIva={Number(modelo.total_iva ?? 0)}
            total={Number(modelo.total ?? 0)}
            divisa={String(modelo.divisa_id || "EUR")}
          />

          <Lineas
            albaran={modelo}
            lineaActiva={lineaActiva}
            publicar={emitir}
            estadoAlbaran={estado}
          />

          {estado === "BORRANDO_ALBARAN" && (
            <BorrarAlbaran albaran={modelo} publicar={emitir} />
          )}
        </>
      )}
    </Detalle>
  );
};
