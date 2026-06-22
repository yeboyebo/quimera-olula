import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { Ubicacion } from "../../diseño.ts";
import { patchUbicacion } from "../../infraestructura.ts";
import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { BorrarUbicacion } from "./BorrarUbicacion.tsx";
import { metaUbicacion, ubicacionVacia } from "./dominio.ts";
import { getMaquina } from "./maquina.ts";

const titulo = (ubicacion: Ubicacion) => ubicacion.id as string;

export const DetalleUbicacion = ({
  id,
  publicar = async () => {},
}: {
  id?: string;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const ubicacionId = id ?? params.id;
  const { intentar } = useContext(ContextoError);

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      ubicacion: ubicacionVacia(),
      ubicacionInicial: ubicacionVacia(),
    },
    publicar
  );

  const ubicacion = useModelo(metaUbicacion, ctx.ubicacion);

  useEffect(() => {
    emitir("ubicacion_id_cambiada", ubicacionId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ubicacionId]);

  const handleGuardar = useCallback(async () => {
    await intentar(() => patchUbicacion(ubicacion.modelo.id, ubicacion.modelo));
    emitir("ubicacion_guardada");
  }, [emitir, ubicacion, intentar]);

  const handleCancelar = useCallback(() => {
    emitir("cancelar_edicion");
  }, [emitir]);

  if (!ctx.ubicacion.id) return;

  return (
    <Detalle
      id={ctx.ubicacion.id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.ubicacion}
      cerrarDetalle={() => emitir("cancelar_seleccion")}
    >
      {!!ctx.ubicacion.id && (
        <>
          <div className="maestro-botones">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <Tabs
            children={[
              <Tab key="general" label="General">
                <quimera-formulario>
                  <QInput label="Código" {...ubicacion.uiProps("id")} />
                  <Almacen {...ubicacion.uiProps("almacenId")} />
                </quimera-formulario>
              </Tab>,
            ]}
          ></Tabs>
          {ubicacion.modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={handleGuardar} deshabilitado={!ubicacion.valido}>
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={handleCancelar}
                deshabilitado={!ubicacion.modificado}
              >
                Cancelar
              </QBoton>
            </div>
          )}
          <BorrarUbicacion
            publicar={emitir}
            activo={ctx.estado === "Borrando"}
            ubicacion={ctx.ubicacion}
          />
        </>
      )}
    </Detalle>
  );
};
