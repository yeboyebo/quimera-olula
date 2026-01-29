import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Entidad } from "@olula/lib/diseño.ts";
import { ConfigMaquina4, ProcesarEvento, useMaquina4 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { useParams } from "react-router";
import { Familia } from "../../diseño.ts";
import { familiaVacia, metaFamilia } from "../../dominio.ts";
import { getFamilia, patchFamilia } from "../../infraestructura.ts";
import { BorrarFamilia } from "./BorrarFamilia.tsx";
import "./DetalleFamilia.css";

type Estado = "Editando" | "Borrando";
type Contexto = Record<string, unknown>;
const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Editando",
    contexto: {},
  },
  estados: {
    Editando: {
      borrar: "Borrando",
      familia_guardada: ({ publicar }) => publicar("familia_guardada"),
      cancelar_seleccion: ({ publicar }) => publicar("seleccion_cancelada"),
    },
    Borrando: {
      borrado_cancelado: "Editando",
      familia_borrada: ({ publicar }) => publicar("familia_borrada"),
    },
  },
};

const titulo = (familia: Entidad) => familia.descripcion as string;

export const DetalleFamilia = ({
  familiaInicial = null,
  publicar = async () => {},
}: {
  familiaInicial?: Familia | null;
  publicar?: ProcesarEvento;
}) => {
  const params = useParams();
  const { intentar } = useContext(ContextoError);

  const familia = useModelo(metaFamilia, familiaVacia);
  const { modelo, uiProps, init } = familia;

  const guardar = async () => {
    await intentar(() => patchFamilia(modelo.id, modelo));
    recargarCabecera();
    emitir("familia_guardada");
  };

  const cancelar = () => {
    init();
  };

  const [emitir, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
    publicar,
  });

  const recargarCabecera = async () => {
    const nuevaFamilia = await intentar(() => getFamilia(modelo.id));
    init(nuevaFamilia);
    publicar("familia_cambiada", nuevaFamilia);
  };

  const familiaId = familiaInicial?.id ?? params.id;

  return (
    <Detalle
      id={familiaId}
      obtenerTitulo={titulo}
      setEntidad={(accionInicial) => init(accionInicial)}
      entidad={modelo}
      cargar={getFamilia}
      cerrarDetalle={() => publicar("seleccion_cancelada")}
    >
      {!!familiaId && (
        <>
          <div className="maestro-botones ">
            <QBoton onClick={() => emitir("borrar")}>Borrar</QBoton>
          </div>
          <div className="DetalleFamilia">
            <Tabs
              children={[
                <Tab key="general" label="General">
                  <quimera-formulario>
                    <QInput label="Código" {...uiProps("id")} />
                    <QInput label="Descripción" {...uiProps("descripcion")} />
                  </quimera-formulario>
                </Tab>,
              ]}
            ></Tabs>
          </div>
          {familia.modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={guardar} deshabilitado={!familia.valido}>
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={cancelar}
                deshabilitado={!familia.modificado}
              >
                Cancelar
              </QBoton>
            </div>
          )}
          <BorrarFamilia
            publicar={emitir}
            activo={estado === "Borrando"}
            familia={modelo}
          />
        </>
      )}
    </Detalle>
  );
};
