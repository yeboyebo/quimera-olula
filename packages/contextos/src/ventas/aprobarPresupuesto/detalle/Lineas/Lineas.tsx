import { Presupuesto } from "#/ventas/presupuesto/diseño.ts";
import { MetaTabla } from "@olula/componentes/atomos/qtablacontrolada.tsx";
import {
  QModalConfirmacion,
  QuimeraAcciones,
} from "@olula/componentes/index.ts";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { Criteria, ListaSeleccionable } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { getSeleccionada } from "@olula/lib/entidad.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { LineaAprobarPresupuesto as Linea } from "../../diseño.ts";
import { EstadoAprobarPresupuesto } from "../diseño.ts";
import { hayPendiente, puedeAprobar } from "../dominio.ts";
import { AccionesLinea } from "./AccionesLinea.tsx";
import { ExpansionCantidad } from "./ExpansionCantidad.tsx";

export const Lineas = ({
  presupuesto,
  lineas,
  estado,
  publicar,
}: {
  presupuesto: Presupuesto;
  lineas: ListaSeleccionable<Linea>;
  estado: EstadoAprobarPresupuesto;
  publicar: ProcesarEvento;
}) => {
  const seleccionada = getSeleccionada(lineas);
  const esConfirmandoAprobacion = estado === "CONFIRMANDO_APROBACION";

  const acciones = [
    // "Todos" es un atajo de relleno y debería pesar menos que "Generar
    // Pedido", pero QuimeraAcciones fuerza variante "solido" en toda acción
    // habilitada, así que de momento salen iguales.
    {
      texto: "Todos",
      onClick: () => publicar("todas_las_lineas_aprobadas"),
      deshabilitado: !hayPendiente(lineas),
    },
    {
      texto: "Generar Pedido",
      onClick: () => publicar("aprobacion_solicitada"),
      deshabilitado: !puedeAprobar({ presupuesto, lineas }),
    },
  ];

  const metaTabla: MetaTabla<Linea> = {
    cols: [
      {
        id: "linea",
        cabecera: "Línea",
        esTitulo: true,
        render: (l) => `${l.referencia || "-"} ${l.descripcion || ""}`.trim(),
      },
      { id: "cantidad", cabecera: "Cantidad", tipo: "numero" },
      {
        id: "aprobada",
        cabecera: "Servida",
        tipo: "numero",
        render: (l) => String(l.aprobada || 0),
      },
      {
        id: "a_aprobar",
        cabecera: "A pedir",
        tipo: "numero",
        render: (l) => String(l.a_aprobar || 0),
      },
      {
        id: "acciones",
        cabecera: "",
        render: (l) => (
          <AccionesLinea linea={l} presupuestoId={presupuesto.id} publicar={publicar} />
        ),
      },
    ],
    expansion: ({ entidad }) => (
      <ExpansionCantidad linea={entidad} publicar={publicar} />
    ),
  };

  return (
    <div className="DetalleAprobarPresupuesto">
      <div className="CabeceraPresupuesto">
        <div className="botones maestro-botones ">
          <QuimeraAcciones acciones={acciones} />
        </div>
      </div>
      <ListadoSemiControlado
        metaTabla={metaTabla}
        entidades={lineas.lista}
        totalEntidades={lineas.lista.length}
        cargando={false}
        seleccionada={seleccionada ?? null}
        onSeleccion={(l: Linea) => publicar("linea_seleccionada", l.id)}
        criteriaInicial={criteria_lineas}
        onCriteriaChanged={() => null}
        modo="tabla"
      />
      <QModalConfirmacion
        nombre="aprobarPresupuesto"
        abierto={esConfirmandoAprobacion}
        titulo="Confirmar"
        mensaje="¿Está seguro de que desea generar el pedido?"
        labelAceptar="Aceptar"
        mostrarCancelar={true}
        onCerrar={() => publicar("aprobacion_cancelada")}
        onAceptar={() => publicar("aprobacion_confirmada")}
      />
    </div>
  );
};

const criteria_lineas: Criteria = {
  ...criteriaDefecto,
  orden: ["id", "DESC"],
};
