import { useState } from "react";
import { QCheckbox } from "../../../../../../../componentes/atomos/qcheckbox.tsx";
import { QDate } from "../../../../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../../../../componentes/atomos/qinput.tsx";
import { QTextArea } from "../../../../../../../componentes/atomos/qtextarea.tsx";
import { Proveedor } from "../../../../../../../contextos/compras/comun/componentes/proveedor.tsx";
import { HookModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Empresa } from "../../../../../../../contextos/crm/comun/componentes/empresa.tsx";
import { Cliente } from "../../../../../../../contextos/ventas/comun/componentes/cliente.tsx";
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

  // console.log('mimensaje_aaaaaaaaaaaaaa', evento);


  return (
    <div className="TabDatos">
      <quimera-formulario>
        <div className="columna-principal">
            <div className="fila-1">
                <Producto 
                  valor={evento.modelo.referencia || ""}
                  descripcion={evento.modelo.descripcion_ref || ""}
                  onChange={uiProps("referencia", "descripcion_ref").onChange}
                  nombre="codproyecto"
                />
                <QInput label="Nombre" {...uiProps("descripcion")} />
            </div>
            <div className="fila-2">
                <div className="fecha-lugar">
                    <QDate label="Fecha" {...uiProps("fecha_inicio")} />
                    <QInput label="Lugar" {...uiProps("lugar")} />
                </div>
                <QInput label="Dirección" {...uiProps("direccion")} />
            </div>
            <div className="fila-3">
                <QInput label="Hora montaje" {...uiProps("hora_montaje")} />
                <QInput label="Hora prueba sonido" {...uiProps("hora_prueba_sonido")} />
                <QInput label="Hora inicio" {...uiProps("hora_inicio")} />
            </div>
            <div className="fila-4">
                <Empresa
                  label="Empresa que factura"
                  {...evento.uiProps("empresa_id", "nombre_empresa")}
                />  
                <Cliente
                  {...evento.uiProps("cliente_id", "nombre_cliente")}
                />                
                {/* <QInput label="Proveedor" {...uiProps("proveedor_id")} /> */}
                <Proveedor
                  {...evento.uiProps("proveedor_id", "nombre_proveedor")}
                />                  
            </div>
            <div className="fila-5">
                <QInput label="CCF" {...uiProps("ccf")} />
                <div className="precios-margen">
                    <QInput label="Precio cliente" {...uiProps("total_ingresos")} />
                    <QInput label="Precio proveedor" {...uiProps("total_costes")} />
                    <QInput label="Margen" {...uiProps("total_beneficio")} />
                </div>
            </div>
        </div>
        <div className="columna-checkbox col-1">
          <QCheckbox 
            label="C. cliente enviado" 
            nombre="enviado_a_cliente" 
            valor={evento.modelo.enviado_a_cliente} 
            onChange={uiProps("enviado_a_cliente").onChange} 
          />
          <QCheckbox 
            label="C. proveedor enviado" 
            nombre="enviado_a_proveedor" 
            valor={evento.modelo.enviado_a_proveedor} 
            onChange={uiProps("enviado_a_proveedor").onChange} 
          />
          <QCheckbox 
            label="Hoja ruta hecha" 
            nombre="hoja_ruta_hecha" 
            valor={evento.modelo.hoja_ruta_hecha} 
            onChange={uiProps("hoja_ruta_hecha").onChange} 
          />
          <QCheckbox 
            label="Presupuesto" 
            nombre="presupuesto" 
            valor={evento.modelo.presupuesto} 
            onChange={uiProps("presupuesto").onChange} 
          />
          <QCheckbox 
            label="Alta de seguridad social" 
            nombre="altas_ss" 
            valor={evento.modelo.altas_ss} 
            onChange={uiProps("altas_ss").onChange} 
          />
          <QCheckbox 
            label="Liquidación" 
            nombre="liquidacion" 
            valor={evento.modelo.liquidacion} 
            onChange={uiProps("liquidacion").onChange} 
          />
        </div>
        <div className="columna-checkbox col-2">
          <QCheckbox 
            label="C. cliente recibido" 
            nombre="recibido_por_cliente" 
            valor={evento.modelo.recibido_por_cliente} 
            onChange={uiProps("recibido_por_cliente").onChange} 
          />
          <QCheckbox 
            label="C. proveedor recibido" 
            nombre="recibido_por_proveedor" 
            valor={evento.modelo.recibido_por_proveedor} 
            onChange={uiProps("recibido_por_proveedor").onChange} 
          />
          <QCheckbox 
            label="Hoja ruta enviada" 
            nombre="hoja_ruta_enviada" 
            valor={evento.modelo.hoja_ruta_enviada} 
            onChange={uiProps("hoja_ruta_enviada").onChange} 
          />
          <QCheckbox 
            label="Factura enviada" 
            nombre="factura_enviada" 
            valor={evento.modelo.factura_enviada} 
            onChange={uiProps("factura_enviada").onChange} 
          />
          <QCheckbox 
            label="Cartelería" 
            nombre="carteleria" 
            valor={evento.modelo.carteleria} 
            onChange={uiProps("carteleria").onChange} 
          />
          <div className="marcador-checkbox"></div>
        </div>
        <div className="fila-observaciones">
          <QTextArea label="Observaciones" {...uiProps("observaciones")} />
        </div>
      </quimera-formulario>
      {/* <QModal nombre="modal" abierto={mostrarModal} onCerrar={onCancelar}>
        <h2>Dar de baja</h2>
      </QModal> */}
    </div>
  );
};