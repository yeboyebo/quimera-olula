import { useState } from "react";

import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../../contextos/comun/useMaquina.ts";
import { TrabajadorEvento } from "../diseño.ts";
import {
  getTrabajadoresEvento
} from "../infraestructura.ts";
// import { AltaTrabajadorEvento } from "./AltaTrabajadorEventoEvento.tsx";
import { DetalleTrabajadorEvento } from "./DetalleTrabajadorEvento/DetalleTrabajadorEvento.tsx";
// import "./MaestroConDetalleTrabajadorEvento.css";

import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";

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
      trabajadorEvento.liquidado ? 
        <QIcono nombre="verdadero" color="green" /> : 
        <QIcono nombre="falso" color="red" />
    )
  }
];
type Estado = "lista" | "alta";

export const MaestroConDetalleTrabajadorEvento = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const trabajadoresEvento = useLista<TrabajadorEvento>([]);

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
        console.log('mimensaje_TRABAJADOR_EVENTO_CAMBIADO');
        
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