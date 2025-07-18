import { useContext, useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { ContextoError } from "../../../../../../contextos/comun/contexto.ts";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../../contextos/comun/useMaquina.ts";
import { Evento } from "../diseño.ts";
import { getEvento, getEventos, patchEvento } from "../infraestructura.ts";
import { AltaEvento } from "./AltaEvento.tsx";

// Define Estado type for use in MaestroEvento
type Estado = "lista" | "alta";

// Componente para mostrar y cambiar el estado de un campo booleano
const AccionCampoEvento = ({
  campo,
  valor,
  evento,
  onClick,
}: {
  campo: keyof Evento;
  valor: boolean;
  evento: Evento;
  onClick: (eventoActualizado: Evento, nuevoValor: boolean) => void;
}) => (
  <span
    style={{ cursor: "pointer", display: "flex", justifyContent: "center" }}
    onClick={() => {
      const actualizado = { ...evento, [campo]: !valor };
      onClick(actualizado, !valor);
    }}
    title={`Cambiar ${campo}`}
  >
    {valor ? <span style={{ color: "green" }}>✔️</span> : "❌"}
  </span>
);

const getMetaTablaEvento = (
  campoEventoChanged: (evento: Evento, valor: boolean) => void,
  emitir: (accion: string, payload: unknown) => void
) => [
  {
    id: "estado_id",
    cabecera: "Estado",
    render: (e: Evento) => (
      <span
        style={{
          display: "inline-block",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: e.estado_id === "Confirmado" ? "green" : "red",
          border: "1px solid #ccc",
        }}
        title={e.estado_id ?? undefined}
      />
    ),
  },
  {
    id: "descripcion",
    cabecera: "Nombre",
    render: (e: Evento) => (
      <span
        style={{
          color: "#1976d2",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        onClick={() => window.location.href = `/eventos/evento/${e.id}`}
        title="Ver detalle"
      >
        {e.descripcion}
      </span>
    ),
  },
  { id: "fecha_inicio", cabecera: "Fecha" },
  { id: "lugar", cabecera: "Lugar" },
  { id: "hora_inicio", cabecera: "Horario" },
  { id: "cliente_id", cabecera: "P. Cliente" },
  { id: "proveedor_id", cabecera: "P. Prov." },
  { id: "empresa_id", cabecera: "Empresa fact." },
  {
    id: "presupuesto",
    cabecera: "Presupuesto",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="presupuesto"
        valor={e.presupuesto}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "enviado_a_cliente",
    cabecera: "C. cli. enviado",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="enviado_a_cliente"
        valor={e.enviado_a_cliente}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "recibido_por_cliente",
    cabecera: "C. cli. recibido",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="recibido_por_cliente"
        valor={e.recibido_por_cliente}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "enviado_a_proveedor",
    cabecera: "C. prov. enviado",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="enviado_a_proveedor"
        valor={e.enviado_a_proveedor}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "recibido_por_proveedor",
    cabecera: "C. prov. recibido",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="recibido_por_proveedor"
        valor={e.recibido_por_proveedor}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "factura_enviada",
    cabecera: "F. enviada",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="factura_enviada"
        valor={e.factura_enviada}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "hoja_ruta_hecha",
    cabecera: "H.R hecha",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="hoja_ruta_hecha"
        valor={e.hoja_ruta_hecha}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "hoja_ruta_enviada",
    cabecera: "H.R. mandada",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="hoja_ruta_enviada"
        valor={e.hoja_ruta_enviada}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "altas_ss",
    cabecera: "Altas SS.SS",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="altas_ss"
        valor={e.altas_ss}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "carteleria",
    cabecera: "Carteleria",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="carteleria"
        valor={e.carteleria}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
  {
    id: "liquidacion",
    cabecera: "Liquidacion",
    render: (e: Evento) => (
      <AccionCampoEvento
        campo="liquidacion"
        valor={e.liquidacion}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  },
];

// ...rest of MaestroEvento...

export const MaestroEvento = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const eventos = useLista<Evento>([]);
  const { intentar } = useContext(ContextoError);

  useEffect(() => {
    const fetchEventos = async () => {
      const eventosData = await getEventos([], []);
      eventos.setLista(eventosData);
    };
    fetchEventos();
  }, []);

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

function init(evento: Evento) {
  // Actualiza la lista local de eventos con el evento actualizado
  eventos.modificar(evento);
}

const campoEventoChanged = async (eventoActualizado: Evento, nuevoValor: boolean) => {
  await intentar(() => patchEvento(eventoActualizado.id, eventoActualizado));
  const evento_guardado = await getEvento(eventoActualizado.id);
  init(evento_guardado);
  emitir("EVENTO_CAMBIADO", evento_guardado);
};

  return (
    <div className="Evento" style={{ minHeight: "100vh", overflowY: "auto" }}>
      <div style={{display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <h2>Eventos</h2>
        <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
      </div>
      <QTabla
        metaTabla={getMetaTablaEvento(campoEventoChanged, emitir)}
        datos={eventos.lista}
        cargando={false}
        seleccionadaId={eventos.seleccionada?.id}
        // onSeleccion={(evento) => emitir("EVENTO_CAMBIADO", evento)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaEvento emitir={emitir} />
      </QModal>
    </div>
  );
};