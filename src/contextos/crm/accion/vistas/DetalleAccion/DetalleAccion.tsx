import { useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { EstadoAccion } from "../../../comun/componentes/estado_accion.tsx";
import { TipoAccion } from "../../../comun/componentes/tipo_accion.tsx";
import { Accion } from "../../diseño.ts";
import { accionVacia, metaAccion } from "../../dominio.ts";
import {
  deleteAccion,
  finalizarAccion,
  getAccion,
  patchAccion,
} from "../../infraestructura.ts";
import "./DetalleAccion.css";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type Estado = "defecto" | "confirmarBorrado" | "confimarFinalizar";

export const DetalleAccion = ({
  accionInicial = null,
  emitir = () => {},
}: {
  accionInicial?: Accion | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const [estado, setEstado] = useState<Estado>("defecto");
  const accionId = accionInicial?.id ?? params.id;
  const titulo = (accion: Entidad) => accion.descripcion as string;

  const accion = useModelo(metaAccion, accionVacia);
  const { modelo, init } = accion;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await patchAccion(modelo.id, modelo);
        recargarCabecera();
      },
    },
    confirmarBorrado: {},
    confimarFinalizar: {},
  };
  const emitirAccion = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevaAccion = await getAccion(modelo.id);
    init(nuevaAccion);
    emitir("ACCION_CAMBIADA", nuevaAccion);
  };

  const finalizarConfirmado = async () => {
    await finalizarAccion(modelo.id);
    const accion_finalizada = await getAccion(modelo.id);
    init(accion_finalizada);
    emitir("ACCION_CAMBIADA", accion_finalizada);
  };

  const onBorrarAccion = async () => {
    await deleteAccion(modelo.id);
    emitir("ACCION_BORRADA", modelo);
    return "defecto";
  };

  return (
    <Detalle
      id={accionId}
      obtenerTitulo={titulo}
      setEntidad={(a) => init(a)}
      entidad={modelo}
      cargar={getAccion}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!accionId && (
        <>
          <div className="botones maestro-botones ">
            <QBoton onClick={() => setEstado("confimarFinalizar")}>
              Finalizar
            </QBoton>
            <QBoton onClick={() => setEstado("confirmarBorrado")}>
              Borrar
            </QBoton>
          </div>

          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Datos"
                children={
                  <div className="TabDatos">
                    <quimera-formulario>
                      <EstadoAccion {...accion.uiProps("estado")} />
                      <TipoAccion {...accion.uiProps("tipo")} />
                      <QInput
                        label="Descripción"
                        {...accion.uiProps("descripcion")}
                      />
                      <QInput label="Fecha" {...accion.uiProps("fecha")} />
                    </quimera-formulario>
                  </div>
                }
              />,
              <Tab
                key="tab-2"
                label="Más datos"
                children={<TabDatos accion={accion} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones oportunidad={accion} />}
              />,
            ]}
          ></Tabs>
          {accion.modificado && (
            <div className="botones maestro-botones">
              <QBoton
                onClick={() => emitirAccion("GUARDAR_INICIADO")}
                deshabilitado={!accion.valido}
              >
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
                Cancelar
              </QBoton>
            </div>
          )}
          <QModalConfirmacion
            nombre="finalizarAccion"
            abierto={estado === "confimarFinalizar"}
            titulo="Finalizar acción"
            mensaje="¿Está seguro de que desea finalizar esta acción?"
            onCerrar={() => setEstado("defecto")}
            onAceptar={finalizarConfirmado}
          />
          <QModalConfirmacion
            nombre="borrarAccion"
            abierto={estado === "confirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar esta acción?"
            onCerrar={() => setEstado("defecto")}
            onAceptar={onBorrarAccion}
          />
        </>
      )}
    </Detalle>
  );
};
