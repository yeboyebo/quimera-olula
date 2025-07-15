import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Accion } from "../diseño.ts";
import { deleteAccion, getAcciones } from "../infraestructura.ts";
import { AltaAccion } from "./AltaAccion.tsx";
import { DetalleAccion } from "./DetalleAccion/DetalleAccion.tsx";
// import "./MaestroConDetalleAccion.css";

const metaTablaAccion: MetaTabla<Accion> = [
  { id: "id", cabecera: "Código" },
  { id: "fecha", cabecera: "Fecha" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "tipo", cabecera: "Tipo" },
  { id: "estado", cabecera: "Estado" },
];

type Estado = "lista" | "alta";

export const MaestroConDetalleAccion = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const acciones = useLista<Accion>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      ACCION_CREADA: (payload: unknown) => {
        const accion = payload as Accion;
        acciones.añadir(accion);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      ACCION_CAMBIADA: (payload: unknown) => {
        const accion = payload as Accion;
        acciones.modificar(accion);
      },
      ACCION_BORRADA: (payload: unknown) => {
        const accion = payload as Accion;
        acciones.eliminar(accion);
      },
      CANCELAR_SELECCION: () => {
        acciones.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarAccion = async () => {
    if (!acciones.seleccionada) {
      return;
    }
    await deleteAccion(acciones.seleccionada.id);
    acciones.eliminar(acciones.seleccionada);
  };

  return (
    <div className="Accion">
      <MaestroDetalleResponsive
        seleccionada={acciones.seleccionada}
        Maestro={
          <>
            <h2>Acciones</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nueva</QBoton>
              <QBoton
                deshabilitado={!acciones.seleccionada}
                onClick={onBorrarAccion}
              >
                Borrar
              </QBoton>
            </div>
            <Listado
              metaTabla={metaTablaAccion}
              entidades={acciones.lista}
              setEntidades={acciones.setLista}
              seleccionada={acciones.seleccionada}
              setSeleccionada={acciones.seleccionar}
              cargar={getAcciones}
            />
          </>
        }
        Detalle={
          <DetalleAccion
            accionInicial={acciones.seleccionada}
            emitir={emitir}
          />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaAccion emitir={emitir} />
      </QModal>
    </div>
  );
};
