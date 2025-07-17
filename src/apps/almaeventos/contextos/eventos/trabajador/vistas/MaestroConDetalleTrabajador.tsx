import { useState } from "react";

import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../../contextos/comun/useMaquina.ts";
import { Trabajador } from "../diseño.ts";
import {
  deleteTrabajador,
  getTrabajadores,
} from "../infraestructura.ts";
import { AltaTrabajador } from "./AltaTrabajador.tsx";
import { DetalleTrabajador } from "./DetalleTrabajador/DetalleTrabajador.tsx";
// import "./MaestroConDetalleTrabajador.css";

const metaTablaTrabajador: MetaTabla<Trabajador> = [
  { id: "id", cabecera: "Código" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "coste", cabecera: "Coste/Hora" }
];
type Estado = "lista" | "alta";

export const MaestroConDetalleTrabajador = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const trabajadores = useLista<Trabajador>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      TRABAJADOR_CREADO: (payload: unknown) => {
        const trabajador = payload as Trabajador;
        trabajadores.añadir(trabajador);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      TRABAJADOR_CAMBIADO: (payload: unknown) => {
        const trabajador = payload as Trabajador;
        trabajadores.modificar(trabajador);
      },
      TRABAJADOR_BORRADO: (payload: unknown) => {
        const trabajador = payload as Trabajador;
        trabajadores.eliminar(trabajador);
      },
      CANCELAR_SELECCION: () => {
        trabajadores.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarTrabajador = async () => {
    if (!trabajadores.seleccionada) {
      return;
    }
    await deleteTrabajador(trabajadores.seleccionada.id);
    trabajadores.eliminar(trabajadores.seleccionada);
  };

  return (
    <div className="Trabajador">
      <MaestroDetalleResponsive<Trabajador>
        seleccionada={trabajadores.seleccionada}
        Maestro={
          <>
            <h2>Trabajadores</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaTrabajador}
              entidades={trabajadores.lista}
              setEntidades={trabajadores.setLista}
              seleccionada={trabajadores.seleccionada}
              setSeleccionada={trabajadores.seleccionar}
              cargar={getTrabajadores}
            />
          </>
        }
        Detalle={
          <DetalleTrabajador
            trabajadorInicial={trabajadores.seleccionada}
            emitir={emitir}
          />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaTrabajador emitir={emitir} />
      </QModal>
    </div>
  );
};