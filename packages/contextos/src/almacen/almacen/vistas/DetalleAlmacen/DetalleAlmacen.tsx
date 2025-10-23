import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { Almacen } from "../../diseño.ts";
import { almacenVacio, metaAlmacen } from "../../dominio.ts";
import { getAlmacen, patchAlmacen } from "../../infraestructura.ts";
import { BorrarAlmacen } from "./BorrarAlmacen";
import "./DetalleAlmacen.css";

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
      almacen_guardado: ({ publicar }) => publicar("almacen_cambiado"),
      cancelar_seleccion: ({ publicar }) => publicar("cancelar_seleccion"),
    },
    borrando: {
      borrado_cancelado: "editando",
      almacen_borrado: ({ publicar }) => publicar("almacen_borrado"),
    },
  },
};

const titulo = (almacen: Entidad) => almacen.nombre as string;

export const DetalleAlmacen = ({
  almacenInicial = null,
  emitir = () => {},
}: {
  almacenInicial?: Almacen | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const almacenId = almacenInicial?.id ?? params.id;
  const { intentar } = useContext(ContextoError);

  const almacen = useModelo(metaAlmacen, almacenVacio);
  const { modelo, uiProps, init, modificado, valido } = almacen;

  const [emitirAlmacen, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: emitir,
  });

  const guardar = async () => {
    await intentar(() => patchAlmacen(modelo.id, modelo));
    const almacen_guardado = await getAlmacen(modelo.id);
    init(almacen_guardado);
    emitirAlmacen("almacen_guardado", almacen_guardado);
  };

  return (
    <Detalle
      id={almacenId}
      obtenerTitulo={titulo}
      setEntidad={(m) => init(m)}
      entidad={modelo}
      cargar={getAlmacen}
      cerrarDetalle={() => {
        console.log("mimensaje_ssssssssssssss_emito");

        emitirAlmacen("cancelar_seleccion");
      }}
    >
      {!!almacenId && (
        <div className="DetalleAlmacen">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitirAlmacen("borrar")}>Borrar</QBoton>
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
          <BorrarAlmacen
            emitir={emitirAlmacen}
            activo={estado === "borrando"}
            almacen={modelo}
          />
        </div>
      )}
    </Detalle>
  );
};
