import { useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../../contextos/comun/useMaquina.ts";
import { Evento } from "../diseño.ts";
import { deleteEvento, getEventos } from "../infraestructura.ts";
import { AltaCliente } from "./AltaEvento.tsx";

// Componente para mostrar y cambiar el estado de un campo booleano
const AccionCampoEvento = ({
  campo,
  valor,
  evento,
  emitir,
}: {
  campo: keyof Evento;
  valor: boolean;
  evento: Evento;
  emitir: (accion: string, payload: unknown) => void;
}) => (
  <span
    style={{ cursor: "pointer", display: "flex", justifyContent: "center" }}
    onClick={() => {
      const actualizado = { ...evento, [campo]: !valor };
      emitir("EVENTO_CAMBIADO", actualizado);
      console.log(`Campo ${campo} cambiado a ${!valor}`);
    }}
    title={`Cambiar ${campo}`}
  >
    {valor ? "✔️" : "❌"}
  </span>
);

const getMetaTablaEvento = (emitir: (accion: string, payload: unknown) => void) => [
  { id: "estado_id", cabecera: "Estado", render: (e: Evento) => <AccionCampoEvento campo="estado_id" valor={e.estado_id === "Confirmado"} evento={e} emitir={emitir} /> },
  { id: "descripcion", cabecera: "Nombre", render: (e: Evento) => (
      <span
        style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
        onClick={() => window.location.href = `/eventos/evento/${e.id}`}
        title="Ver detalle"
      >
        {e.descripcion}
      </span>
    )
  },
  { id: "fecha_inicio", cabecera: "Fecha" },
  { id: "lugar", cabecera: "Lugar" },
  { id: "hora_inicio", cabecera: "Horario" },
  { id: "cliente_id", cabecera: "P. Cliente" },
  { id: "proveedor_id", cabecera: "P. Prov." },
  { id: "empresa_id", cabecera: "Empresa fact." },
  { id: "presupuesto", cabecera: "Presupuesto", render: (e: Evento) => <AccionCampoEvento campo="presupuesto" valor={e.presupuesto} evento={e} emitir={emitir} /> },
  { id: "enviado_a_cliente", cabecera: "C. cli. enviado", render: (e: Evento) => <AccionCampoEvento campo="enviado_a_cliente" valor={e.enviado_a_cliente} evento={e} emitir={emitir} /> },
  { id: "recibido_por_cliente", cabecera: "C. cli. recibido", render: (e: Evento) => <AccionCampoEvento campo="recibido_por_cliente" valor={e.recibido_por_cliente} evento={e} emitir={emitir} /> },
  { id: "enviado_a_proveedor", cabecera: "C. prov. enviado", render: (e: Evento) => <AccionCampoEvento campo="enviado_a_proveedor" valor={e.enviado_a_proveedor} evento={e} emitir={emitir} /> },
  { id: "recibido_por_proveedor", cabecera: "C. prov. recibido", render: (e: Evento) => <AccionCampoEvento campo="recibido_por_proveedor" valor={e.recibido_por_proveedor} evento={e} emitir={emitir} /> },
  { id: "factura_enviada", cabecera: "F. enviada", render: (e: Evento) => <AccionCampoEvento campo="factura_enviada" valor={e.factura_enviada} evento={e} emitir={emitir} /> },
  { id: "hoja_ruta_hecha", cabecera: "H.R hecha", render: (e: Evento) => <AccionCampoEvento campo="hoja_ruta_hecha" valor={e.hoja_ruta_hecha} evento={e} emitir={emitir} /> },
  { id: "hoja_ruta_enviada", cabecera: "H.R. mandada", render: (e: Evento) => <AccionCampoEvento campo="hoja_ruta_enviada" valor={e.hoja_ruta_enviada} evento={e} emitir={emitir} /> },
  { id: "altas_ss", cabecera: "Altas SS.SS", render: (e: Evento) => <AccionCampoEvento campo="altas_ss" valor={e.altas_ss} evento={e} emitir={emitir} /> },
  { id: "carteleria", cabecera: "Carteleria", render: (e: Evento) => <AccionCampoEvento campo="carteleria" valor={e.carteleria} evento={e} emitir={emitir} /> },
  { id: "liquidacion", cabecera: "Liquidacion", render: (e: Evento) => <AccionCampoEvento campo="liquidacion" valor={e.liquidacion} evento={e} emitir={emitir} /> },
];

type Estado = "lista" | "alta";

export const MaestroEvento = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const eventos = useLista<Evento>([]);

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

  const onBorrarEvento = async () => {
    if (!eventos.seleccionada) {
      return;
    }
    await deleteEvento(eventos.seleccionada.id);
    eventos.eliminar(eventos.seleccionada);
  };

  return (
    <div className="Evento" style={{ minHeight: "100vh", overflowY: "auto" }}>
      <div style={{border: "1px solid #ccc"}}>
        <h2>Eventos</h2>
        <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
      </div>
      <QTabla
        metaTabla={getMetaTablaEvento(emitir)}
        datos={eventos.lista}
        cargando={false}
        seleccionadaId={eventos.seleccionada?.id}
        onSeleccion={(evento) => emitir("EVENTO_CAMBIADO", evento)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaCliente emitir={emitir} />
      </QModal>
    </div>
  );
};