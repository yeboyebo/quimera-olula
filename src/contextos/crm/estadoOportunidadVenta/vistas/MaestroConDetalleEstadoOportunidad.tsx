import { useContext, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { EstadoOportunidad } from "../diseño.ts";
import {
  deleteEstadoOportunidad,
  getEstadosOportunidad,
} from "../infraestructura.ts";
import { AltaEstadoOportunidad } from "./AltaEstadoOportunidad.tsx";
import { DetalleEstadoOportunidad } from "./DetalleEstadoOportunidad/DetalleEstadoOportunidad.tsx";
// import "./MaestroConDetalleEstadoOportunidad.css";

const metaTablaEstadoOportunidad: MetaTabla<EstadoOportunidad> = [
  { id: "id", cabecera: "Código" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "probabilidad", cabecera: "Probabilidad", tipo: "numero" },
  { id: "valor_defecto", cabecera: "Por defecto" },
];

type Estado = "lista" | "alta" | "confirmarBorrado";

export const MaestroConDetalleEstadoOportunidad = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const estados = useLista<EstadoOportunidad>([]);
  const { intentar } = useContext(ContextoError);

  const maquina: Maquina<Estado> = {
    alta: {
      ESTADO_OPORTUNIDAD_CREADO: (payload: unknown) => {
        const estadoOportunidad = payload as EstadoOportunidad;
        estados.añadir(estadoOportunidad);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      ESTADO_OPORTUNIDAD_CAMBIADO: (payload: unknown) => {
        const estadoOportunidad = payload as EstadoOportunidad;
        estados.modificar(estadoOportunidad);
      },
      ESTADO_OPORTUNIDAD_BORRADO: (payload: unknown) => {
        const estadoOportunidad = payload as EstadoOportunidad;
        estados.eliminar(estadoOportunidad);
      },
      CANCELAR_SELECCION: () => {
        estados.limpiarSeleccion();
      },
    },
    confirmarBorrado: {
      borrado_confirmado: "lista",
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarConfirmado = async () => {
    if (!estados.seleccionada) {
      return;
    }
    const estadoId = estados.seleccionada.id;
    if (estadoId) {
      await intentar(() => deleteEstadoOportunidad(estadoId));
      estados.eliminar(estados.seleccionada);
    }
    emitir("borrado_confirmado");
  };

  const onBorrarEstadoOportunidad = async () => {
    setEstado("confirmarBorrado");
  };

  return (
    <div className="EstadoOportunidad">
      <MaestroDetalleResponsive<EstadoOportunidad>
        seleccionada={estados.seleccionada}
        Maestro={
          <>
            <h2>Estados de Oportunidad</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
              <QBoton
                deshabilitado={!estados.seleccionada}
                onClick={onBorrarEstadoOportunidad}
              >
                Borrar
              </QBoton>
            </div>
            <Listado
              metaTabla={metaTablaEstadoOportunidad}
              entidades={estados.lista}
              setEntidades={estados.setLista}
              seleccionada={estados.seleccionada}
              setSeleccionada={estados.seleccionar}
              cargar={getEstadosOportunidad}
            />
          </>
        }
        Detalle={
          <DetalleEstadoOportunidad
            estadoInicial={estados.seleccionada}
            emitir={emitir}
          />
        }
      />
      <QModalConfirmacion
        nombre="borrarEstadoOportunidad"
        abierto={estado === "confirmarBorrado"}
        titulo="Confirmar borrar"
        mensaje="¿Está seguro de que desea borrar este estado de oportunidad?"
        onCerrar={() => setEstado("lista")}
        onAceptar={onBorrarConfirmado}
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaEstadoOportunidad emitir={emitir} />
      </QModal>
    </div>
  );
};
