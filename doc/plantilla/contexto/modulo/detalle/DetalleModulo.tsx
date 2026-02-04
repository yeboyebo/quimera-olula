import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback } from "react";
import { useParams } from "react-router";
import { Modulo } from "../diseño.ts";
import "./DetalleModulo.css";
import { metaModulo, moduloVacio } from "./dominio.ts";
import { getMaquina } from "./maquina.ts";
import { TabGeneral } from "./TabGeneral.tsx";
import { TabInformacion } from "./TabInformacion.tsx";

/**
 * Componente que muestra el detalle de un módulo con tabs
 */
export const DetalleModulo = ({
  moduloInicial = null,
  publicar = async () => {},
}: {
  moduloInicial?: Modulo | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const moduloId = moduloInicial?.id ?? params.id;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      modulo: moduloInicial || moduloVacio(),
      moduloInicial: moduloInicial || moduloVacio(),
    },
    publicar
  );

  const modulo = useModelo(metaModulo, ctx.modulo);

  // Detectar cambio de ID de forma sincrónica (patrón simple)
  if (moduloId && moduloId !== ctx?.modulo.id) {
    emitir("modulo_id_cambiado", moduloId, true);
  }

  const { estado } = ctx;
  const { modificado, valido } = modulo;

  const titulo = (m: Modulo) => m.nombre as string;

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_modulo_lista", ctx.modulo);
  }, [emitir, ctx.modulo]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_modulo_cancelada");
  }, [emitir]);

  if (!moduloInicial) return null;

  return (
    <div className="DetalleModulo">
      <Detalle
        id={moduloId}
        obtenerTitulo={titulo}
        setEntidad={() => {}}
        entidad={ctx.modulo}
        cerrarDetalle={() => emitir("modulo_deseleccionado", null)}
      >
        {!!moduloId && (
          <div className="DetalleModulo">
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("borrado_solicitado")}>
                Borrar
              </QBoton>
            </div>
            <Tabs
              children={[
                <Tab
                  key="tab-1"
                  label="General"
                  children={<TabGeneral form={modulo} />}
                />,
                <Tab
                  key="tab-2"
                  label="Información"
                  children={<TabInformacion modulo={ctx.modulo} />}
                />,
              ]}
            />
            <div className="detalle-botones">
              {modificado && (
                <>
                  <QBoton onClick={handleGuardar} deshabilitado={!valido}>
                    Guardar
                  </QBoton>
                  <QBoton onClick={handleCancelar}>Cancelar</QBoton>
                </>
              )}
            </div>
          </div>
        )}
      </Detalle>
    </div>
  );
};
