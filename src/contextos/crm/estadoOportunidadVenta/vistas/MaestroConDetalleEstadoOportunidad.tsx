import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
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

type Estado = "lista" | "alta";

export const MaestroConDetalleEstadoOportunidad = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const estados = useLista<EstadoOportunidad>([]);

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
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarEstadoOportunidad = async () => {
    if (!estados.seleccionada) {
      return;
    }
    await deleteEstadoOportunidad(estados.seleccionada.id);
    estados.eliminar(estados.seleccionada);
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
