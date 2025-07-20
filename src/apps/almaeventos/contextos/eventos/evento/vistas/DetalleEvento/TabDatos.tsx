import { useState } from "react";
import { QCheckbox } from "../../../../../../../componentes/atomos/qcheckbox.tsx";
import { QDate } from "../../../../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../../../../componentes/atomos/qinput.tsx";
import { QTextArea } from "../../../../../../../componentes/atomos/qtextarea.tsx";
import { QModal } from "../../../../../../../componentes/moleculas/qmodal.tsx";
import { HookModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Producto } from "../../../../../contextos/comun/componentes/producto.tsx";
import { Evento } from "../../diseño.ts";
import "./TabDatos.css";

interface TabDatosProps {
  evento: HookModelo<Evento>;
  recargarEvento: () => void;
}

export const TabDatos = ({ evento, recargarEvento }: TabDatosProps) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const onCancelar = () => setMostrarModal(false);
  const { uiProps } = evento;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <div className="main-column">
            <div className="fila-1">
                <Producto {...evento.uiProps("codproyecto", "descripcion_producto")} nombre="evento/codproyecto"/>
                <QInput label="Nombre" {...uiProps("nombre")} />
            </div>
            <div className="fila-2">
                <QDate label="Fecha" {...uiProps("fecha_inicio")} />
                <QInput label="Lugar" {...uiProps("lugar")} />
                <QInput label="Dirección" {...uiProps("direccion")} />
            </div>
            <div className="fila-3">
                <QInput label="Hora montaje" {...uiProps("hora_montaje")} />
                <QInput label="Hora prueba sonido" {...uiProps("hora_prueba_sonido")} />
                <QInput label="Hora inicio" {...uiProps("hora_inicio")} />
            </div>
            <div className="fila-4">
                <QInput label="Empresa que factura" {...uiProps("empresa_id")} />
                <QInput label="Cliente" {...uiProps("cliente_id")} />
                <QInput label="Proveedor" {...uiProps("proveedor_id")} />
            </div>
            <div className="fila-5">
                <QInput label="CCF" {...uiProps("ccf")} />
                <QInput label="Precio cliente" {...uiProps("total_ingresos")} />
                <QInput label="Precio proveedor" {...uiProps("total_costes")} />
                <QInput label="Margen" {...uiProps("total_beneficio")} />
            </div>
        </div>
        <div className="checkbox-column col-1">
          <QCheckbox label="C. cliente enviado" nombre="enviado_a_cliente" valor={true} />
          <QCheckbox label="C. proveedor enviado" nombre="enviado_a_proveedor" valor={true} />
          <QCheckbox label="Hoja ruta hecha" nombre="hoja_ruta_hecha" valor={true} />
          <QCheckbox label="Presupuesto" nombre="presupuesto" valor={true} />
          <QCheckbox label="Alta de seguridad social" nombre="altas_ss" valor={true} />
          <QCheckbox label="Liquidación" nombre="liquidacion" valor={true} />
        </div>
        <div className="checkbox-column col-2">
          <QCheckbox label="C. cliente recibido" nombre="recibido_a_cliente" valor={true} />
          <QCheckbox label="C. proveedor recibido" nombre="recibido_por_proveedor" valor={true} />
          <QCheckbox label="Hoja ruta enviada" nombre="hoja_ruta_enviada" valor={true} />
          <QCheckbox label="Factura enviada" nombre="factura_enviada" valor={true} />
          <QCheckbox label="Cartelería" nombre="carteleria" valor={true} />
          <div className="checkbox-placeholder"></div>
        </div>
        <div className="row-observaciones">
          <QTextArea label="Observaciones" {...uiProps("observaciones")} />
        </div>
      </quimera-formulario>
      <QModal nombre="modal" abierto={mostrarModal} onCerrar={onCancelar}>
        <h2>Dar de baja</h2>
      </QModal>
    </div>
  );
};