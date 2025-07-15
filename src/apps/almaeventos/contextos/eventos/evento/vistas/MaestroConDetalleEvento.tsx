import { useState } from "react";

import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../../contextos/comun/useMaquina.ts";
import { Evento } from "../diseño.ts";
import {
  deleteEvento,
  getEventos,
} from "../infraestructura.ts";
import { DetalleEvento } from "./DetalleEvento/DetalleEvento.tsx";
// import "./MaestroConDetalleEvento.css";

const metaTablaEvento: MetaTabla<Evento> = [
  { id: "id", cabecera: "Código" },
  { id: "referencia", cabecera: "Referencia" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "fecha_inicio", cabecera: "Fecha inicio" },
  { id: "cliente_id", cabecera: "Cliente" },
];
type Estado = "lista" | "alta";

export const MaestroConDetalleEvento = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const eventos = useLista<Evento>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      EVENTO_CREADO: (payload: unknown) => {
        const evento = payload as Evento;
        eventos.añadir(evento);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      EVENTO_CAMBIADO: (payload: unknown) => {
        const evento = payload as Evento;
        eventos.modificar(evento);
      },
      EVENTO_BORRADO: (payload: unknown) => {
        const evento = payload as Evento;
        eventos.eliminar(evento);
      },
      CANCELAR_SELECCION: () => {
        eventos.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarEvento = async () => {
    if (!eventos.seleccionada) {
      return;
    }
    await deleteEvento(eventos.seleccionada.id);
    eventos.eliminar(eventos.seleccionada);
  };

  return (
    <div className="Evento">
      <MaestroDetalleResponsive<Evento>
        seleccionada={eventos.seleccionada}
        Maestro={
          <>
            <h2>Eventos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
              <QBoton
                deshabilitado={!eventos.seleccionada}
                onClick={onBorrarEvento}
              >
                Borrar
              </QBoton>
            </div>
            <Listado
              metaTabla={metaTablaEvento}
              entidades={eventos.lista}
              setEntidades={eventos.setLista}
              seleccionada={eventos.seleccionada}
              setSeleccionada={eventos.seleccionar}
              cargar={getEventos}
            />
          </>
        }
        Detalle={
          <DetalleEvento
            eventoInicial={eventos.seleccionada}
            emitir={emitir}
          />
        }
      />
    </div>
  );
};