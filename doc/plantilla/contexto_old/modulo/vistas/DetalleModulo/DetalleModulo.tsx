import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { QInput } from "@olula/componentes/index.js";
import { QBoton } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { Modulo } from "../../diseño";
import { metaModulo, moduloVacio } from "../../dominio";
import { getModulo, patchModulo } from "../../infraestructura";
import { BorrarModulo } from "./BorrarModulo";

// Máquina de estados y contexto

type Estado = "editando" | "borrando";
type Contexto = Record<string, unknown>;

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "editando",
    contexto: {},
  },
  estados: {
    editando: {
      borrar: "borrando",
      modulo_guardado: ({ publicar }) => publicar("modulo_cambiado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    borrando: {
      borrado_cancelado: "editando",
      modulo_borrado: ({ publicar }) => publicar("modulo_borrado"),
    },
  },
};

const titulo = (modulo: Entidad) => modulo.nombre as string;

export const DetalleModulo = ({
  moduloInicial = null,
  publicar = async () => {},
}: {
  moduloInicial?: Modulo | null;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const moduloId = moduloInicial?.id ?? params.id;
  const { intentar } = useContext(ContextoError);

  const modulo = useModelo(metaModulo, moduloVacio);
  const { modelo, uiProps, init, modificado, valido } = modulo;

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: publicar,
  });

  const guardar = async () => {
    await intentar(() => patchModulo(modelo.id, modelo));
    const modulo_guardado = await getModulo(modelo.id);
    init(modulo_guardado);
    emitir("modulo_guardado", modulo_guardado);
  };

  return (
    <Detalle
      id={moduloId}
      obtenerTitulo={titulo}
      setEntidad={(m) => init(m)}
      entidad={modelo}
      cargar={getModulo}
      cerrarDetalle={() => publicar("seleccion_cancelada")}
    >
      {!!moduloId && (
        <div className="DetalleModulo">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Datos"
                children={
                  <>
                    {/* <quimera-formulario> */}
                    <QInput label="Nombre" {...uiProps("nombre")} />
                    <QInput label="Descripción" {...uiProps("descripcion")} />
                    <QInput label="Estado" {...uiProps("estado")} />
                    {/* </quimera-formulario> */}
                  </>
                }
              />,
              //   <Tab
              //     key="tab-2"
              //     label="Observaciones"
              //     children={<TabObservaciones oportunidad={oportunidad} />}
              //   />,
            ]}
          ></Tabs>

          {modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <BorrarModulo
            publicar={emitir}
            activo={estado === "borrando"}
            modulo={modelo}
          />
        </div>
      )}
    </Detalle>
  );
};
