import {
  Listado,
  MaestroDetalleResponsive,
  MetaTabla,
  QBoton,
  QModal,
} from "@olula/componentes/index.ts";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useState } from "react";
import { Trabajador } from "../diseño.ts";
import { getTrabajadores } from "../infraestructura.ts";
import { AltaTrabajador } from "./AltaTrabajador.tsx";
import { DetalleTrabajador } from "./DetalleTrabajador/DetalleTrabajador.tsx";
// import "./MaestroConDetalleTrabajador.css";

const metaTablaTrabajador: MetaTabla<Trabajador> = [
  // { id: "id", cabecera: "Código" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "coste", cabecera: "Coste/Hora" },
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
