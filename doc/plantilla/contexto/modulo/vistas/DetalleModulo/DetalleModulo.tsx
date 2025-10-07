import { useContext } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../../src/componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../src/componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../../../src/componentes/detalle/Detalle.tsx";
import {
  Tab,
  Tabs,
} from "../../../../../../src/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "../../../../../../src/contextos/comun/contexto.ts";
import {
  EmitirEvento,
  Entidad,
} from "../../../../../../src/contextos/comun/diseño.ts";
import {
  ConfigMaquina4,
  useMaquina4,
} from "../../../../../../src/contextos/comun/useMaquina.ts";
import { useModelo } from "../../../../../../src/contextos/comun/useModelo.ts";
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
  emitir = () => {},
}: {
  moduloInicial?: Modulo | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const moduloId = moduloInicial?.id ?? params.id;
  const { intentar } = useContext(ContextoError);

  const modulo = useModelo(metaModulo, moduloVacio);
  const { modelo, uiProps, init, modificado, valido } = modulo;

  const [emitirModulo, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar: emitir,
  });

  const guardar = async () => {
    await intentar(() => patchModulo(modelo.id, modelo));
    const modulo_guardado = await getModulo(modelo.id);
    init(modulo_guardado);
    emitirModulo("modulo_guardado", modulo_guardado);
  };

  return (
    <Detalle
      id={moduloId}
      obtenerTitulo={titulo}
      setEntidad={(m) => init(m)}
      entidad={modelo}
      cargar={getModulo}
      cerrarDetalle={() => emitirModulo("cancelar_seleccion")}
    >
      {!!moduloId && (
        <div className="DetalleModulo">
          <div className="maestro-botones ">
            <QBoton onClick={() => emitirModulo("borrar")}>Borrar</QBoton>
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
            emitir={emitirModulo}
            activo={estado === "borrando"}
            modulo={modelo}
          />
        </div>
      )}
    </Detalle>
  );
};
