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
  finalizarAccion,
  getAccion,
  patchAccion
} from "../../infraestructura.ts";
import { BajaAccion } from "../BajaAccion.tsx";
import "./DetalleAccion.css";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

type Estado = "Inactivo" | "Borrando" | "confimarFinalizar";

export const DetalleAccion = ({
  accionInicial = null,
  emitir = () => {},
}: {
  accionInicial?: Accion | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();
  const [estado, setEstado] = useState<Estado>("Inactivo");
  const accionId = accionInicial?.id ?? params.id;
  const titulo = (accion: Entidad) => accion.descripcion as string;

  const accion = useModelo(metaAccion, accionVacia);
  const { modelo, init } = accion;

  const maquina: Maquina<Estado> = {
    Inactivo: {
      borrar: "Borrando",
      guardar: async () => {
        await patchAccion(modelo.id, modelo);
        recargarCabecera();
      },
      cancelar: () => {
        init();
      }
    },
    Borrando: {
      borrado_cancelado: "Inactivo",
      accion_borrada: async () => {
        emitir("accion_borrada", modelo);
      },
    },
    confimarFinalizar: {},
  };
  const emitirAccion = useMaquina(maquina, estado, setEstado);

  const recargarCabecera = async () => {
    const nuevaAccion = await getAccion(modelo.id);
    init(nuevaAccion);
    emitir("accion_cambiada", nuevaAccion);
  };

  const finalizarConfirmado = async () => {
    await finalizarAccion(modelo.id);
    const accion_finalizada = await getAccion(modelo.id);
    init(accion_finalizada);
    emitir("accion_cambiada", accion_finalizada);
  };

  return (
    <Detalle
      id={accionId}
      obtenerTitulo={titulo}
      setEntidad={(a) => init(a)}
      entidad={modelo}
      cargar={getAccion}
      cerrarDetalle={() => emitir("seleccion_cancelada")}
    >
      {!!accionId && (
        <>
          <div className="botones maestro-botones ">
            <QBoton onClick={() => setEstado("confimarFinalizar")}>
              Finalizar
            </QBoton>
            <QBoton onClick={() => emitir("borrar")}>
              Borrar
            </QBoton>
            {estado}
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
                onClick={() => emitirAccion("crear")}
                deshabilitado={!accion.valido}
              >
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => emitirAccion("cancelar")}>
                Cancelar
              </QBoton>
            </div>
          )}
          <QModalConfirmacion
            nombre="finalizarAccion"
            abierto={estado === "confimarFinalizar"}
            titulo="Finalizar acción"
            mensaje="¿Está seguro de que desea finalizar esta acción?"
            onCerrar={() => setEstado("Inactivo")}
            onAceptar={finalizarConfirmado}
          />
          {/* <QModalConfirmacion
            nombre="borrarAccion"
            abierto={estado === "confirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar esta acción?"
            onCerrar={() => setEstado("defecto")}
            onAceptar={onBorrarAccion}
          /> */}
          <BajaAccion 
            emitir={emitirAccion}
            activo={estado === "Borrando"}
            idAccion={modelo.id}
          />
        </>
      )}
    </Detalle>
  );
};
