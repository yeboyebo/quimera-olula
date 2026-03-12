import { MetaTabla, QIcono } from "@olula/componentes/index.ts";
import { ListadoActivoControlado } from "@olula/componentes/maestro/ListadoActivoControlado.js";
import { MaestroDetalleActivoControlado } from "@olula/componentes/maestro/MaestroDetalleActivoControlado.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useCallback, useContext, useEffect, useState } from "react";
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
  const [criteria, setCriteria] = useState<Criteria>(criteriaDefecto);
  const [cargando, setCargando] = useState(false);
  const [totalTrabajadoresEvento, setTotalTrabajadoresEvento] = useState(0);
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

  const recargar = useCallback(
    async (nuevaCriteria: Criteria) => {
      setCriteria(nuevaCriteria);
      setCargando(true);
      const { datos, total } = await getTrabajadoresEvento(
        nuevaCriteria.filtro,
        nuevaCriteria.orden,
        nuevaCriteria.paginacion
      );
      trabajadoresEvento.setLista(datos);
      setTotalTrabajadoresEvento(total);
      setCargando(false);
    },
    [trabajadoresEvento]
  );

  useEffect(() => {
    void recargar(criteriaDefecto);
  }, []);

  // Función para cambiar el estado de liquidado
  const cambiarEstadoLiquidado = async (trabajadorEvento: TrabajadorEvento) => {
    const nuevoValor = !trabajadorEvento.liquidado;
    await intentar(() =>
      patchTrabajadorEvento(trabajadorEvento.id, {
        ...trabajadorEvento,
        liquidado: nuevoValor,
      })
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
      <MaestroDetalleActivoControlado<TrabajadorEvento>
        seleccionada={trabajadoresEvento.seleccionada?.id}
        Maestro={
          <>
            <h2>Trabajadores por evento</h2>
            {/* <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton> 
              <QBoton onClick={() => emitir("DESCARGA_EXCEL_INICIADA")}>Descargar</QBoton>
            </div> */}
            <ListadoActivoControlado<TrabajadorEvento>
              metaTabla={metaTablaTrabajadorEvento}
              criteria={criteria}
              criteriaInicial={criteriaDefecto}
              cargando={cargando}
              entidades={trabajadoresEvento.lista}
              totalEntidades={totalTrabajadoresEvento}
              seleccionada={trabajadoresEvento.seleccionada?.id}
              onSeleccion={(id) => {
                const trabajadorEvento = trabajadoresEvento.lista.find(
                  (item) => item.id === id
                );
                if (trabajadorEvento)
                  trabajadoresEvento.seleccionar(trabajadorEvento);
              }}
              onCriteriaChanged={(nuevaCriteria) =>
                void recargar(nuevaCriteria)
              }
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
