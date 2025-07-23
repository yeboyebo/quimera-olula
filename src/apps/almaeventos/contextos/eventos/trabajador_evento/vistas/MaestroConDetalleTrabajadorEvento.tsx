import { useContext, useState } from "react";

import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { MetaTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { ContextoError } from "../../../../../../contextos/comun/contexto.ts";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../../contextos/comun/useMaquina.ts";
import { TrabajadorEvento } from "../diseño.ts";
import {
  getTrabajadoresEvento,
  patchTrabajadorEvento
} from "../infraestructura.ts";
import { DetalleTrabajadorEvento } from "./DetalleTrabajadorEvento/DetalleTrabajadorEvento.tsx";
import "./MaestroConDetalleTrabajadorEvento.css";

// Componente para cambiar el estado de liquidado
const AccionLiquidado = ({
  valor,
  onClick,
}: {
  valor: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <span
    className="accion-celda"
    onClick={onClick}
    title="Cambiar estado de liquidación"
  >
    {valor ? 
      <QIcono nombre="verdadero" color="green" /> : 
      <QIcono nombre="falso" color="red" />}
  </span>
);

type Estado = "lista" | "alta";

export const MaestroConDetalleTrabajadorEvento = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const trabajadoresEvento = useLista<TrabajadorEvento>([]);
  const { intentar } = useContext(ContextoError);

  const maquina: Maquina<Estado> = {
    alta: {
      TRABAJADOR_EVENTO_CREADO: (payload: unknown) => {
        const trabajadorEvento = payload as TrabajadorEvento;
        trabajadoresEvento.añadir(trabajadorEvento);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      TRABAJADOR_EVENTO_CAMBIADO: (payload: unknown) => {        
        const trabajadorEvento = payload as TrabajadorEvento;
        trabajadoresEvento.modificar(trabajadorEvento);
      },
      TRABAJADOR_EVENTO_BORRADO: (payload: unknown) => {
        const trabajadorEvento = payload as TrabajadorEvento;
        trabajadoresEvento.eliminar(trabajadorEvento);
      },
      CANCELAR_SELECCION: () => {
        trabajadoresEvento.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onLiquidadoToggle = async (trabajadorEvento: TrabajadorEvento) => {
    const nuevoValor = !trabajadorEvento.liquidado;
    await intentar(() => patchTrabajadorEvento(trabajadorEvento.id, { liquidado: nuevoValor }));
    // Actualizar la UI
    emitir("TRABAJADOR_EVENTO_CAMBIADO", {...trabajadorEvento, liquidado: nuevoValor});
  };

  const metaTablaTrabajadorEvento: MetaTabla<TrabajadorEvento> = [
    // { id: "id", cabecera: "Código" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "descripcion", cabecera: "Evento" },
    { id: "fecha", cabecera: "Fecha" },
    { id: "coste", cabecera: "Coste/Hora" },
    { 
      id: "liquidado", 
      cabecera: "Liquidado",
      tipo: "booleano",
      render: (trabajadorEvento) => (
        <AccionLiquidado 
          valor={trabajadorEvento.liquidado}
          onClick={(e) => {
            e.stopPropagation();
            onLiquidadoToggle(trabajadorEvento);
          }}
        />
      )
    }
  ];

  return (
    <div className="TrabajadorEvento">
      <MaestroDetalleResponsive<TrabajadorEvento>
        seleccionada={trabajadoresEvento.seleccionada}
        Maestro={
          <>
            <h2>Trabajadores por evento</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaTrabajadorEvento}
              entidades={trabajadoresEvento.lista}
              setEntidades={trabajadoresEvento.setLista}
              seleccionada={trabajadoresEvento.seleccionada}
              setSeleccionada={trabajadoresEvento.seleccionar}
              cargar={getTrabajadoresEvento}
            />
          </>
        }
        Detalle={
          <DetalleTrabajadorEvento
            trabajadorEventoInicial={trabajadoresEvento.seleccionada}
            emitir={emitir}
          />
        }
      />
    </div>
  );
};