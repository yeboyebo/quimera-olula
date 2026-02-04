import {
  Listado,
  MaestroDetalleResponsive,
  MetaTabla,
  QIcono,
} from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useContext, useState } from "react";
import { TextoConTooltip } from "../../../comun/componentes/TextoConTooltip";
import { TrabajadorEvento } from "../diseño.ts";
import {
  getTrabajadoresEvento,
  patchTrabajadorEvento,
} from "../infraestructura.ts";
import { DetalleTrabajadorEvento } from "./DetalleTrabajadorEvento/DetalleTrabajadorEvento.tsx";
import "./MaestroConDetalleTrabajadorEvento.css";

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

  // Función para cambiar el estado de liquidado
  const cambiarEstadoLiquidado = async (trabajadorEvento: TrabajadorEvento) => {
    const nuevoValor = !trabajadorEvento.liquidado;
    await intentar(() =>
      patchTrabajadorEvento(trabajadorEvento.id, { liquidado: nuevoValor })
    );
    // Actualizar la UI
    emitir("TRABAJADOR_EVENTO_CAMBIADO", {
      ...trabajadorEvento,
      liquidado: nuevoValor,
    });
  };

  const metaTablaTrabajadorEvento: MetaTabla<TrabajadorEvento> = [
    // { id: "id", cabecera: "Código" },
    {
      id: "nombre",
      cabecera: "Nombre",
      tipo: "texto",
      ancho: "200px",
      render: (t) => <TextoConTooltip texto={t.nombre} />,
    },
    {
      id: "descripcion",
      cabecera: "Evento",
      tipo: "texto",
      ancho: "250px",
      render: (t) => <TextoConTooltip texto={t.descripcion} />,
    },
    {
      id: "fecha",
      cabecera: "Fecha",
      tipo: "fecha",
      ancho: "80px",
      render: (t) => {
        if (!t.fecha) return "";
        const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
        return fecha.toISOString().split("T")[0];
      },
    },
    { id: "coste", cabecera: "Coste/Hora", tipo: "moneda", ancho: "100px" },
    {
      id: "liquidado",
      cabecera: "Liquidado",
      tipo: "booleano",
      ancho: "80px",
      render: (trabajadorEvento) => (
        <div
          className="accion-celda"
          onClick={() => {
            cambiarEstadoLiquidado(trabajadorEvento);
          }}
        >
          {trabajadorEvento.liquidado ? (
            <QIcono nombre="verdadero" color="green" />
          ) : (
            <QIcono nombre="falso" color="red" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="TrabajadorEvento">
      <MaestroDetalleResponsive<TrabajadorEvento>
        seleccionada={trabajadoresEvento.seleccionada}
        Maestro={
          <>
            <h2>Trabajadores por evento</h2>
            {/* <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton> 
              <QBoton onClick={() => emitir("DESCARGA_EXCEL_INICIADA")}>Descargar</QBoton>
            </div> */}
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
