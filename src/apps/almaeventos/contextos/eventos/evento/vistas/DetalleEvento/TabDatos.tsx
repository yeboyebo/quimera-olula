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

export const TabDatos = ({ evento }: TabDatosProps) => {
  const { uiProps } = evento;

  // Helper para convertir valores a boolean
  const toBool = (valor: boolean | string): boolean => {
    return valor === true || valor === "true";
  };

  // Helper para manejar onChange de checkboxes
  const handleCheckboxChange = (campo: keyof Evento) => (valor: string) => {
    uiProps(campo as string).onChange(valor === "true" ? "true" : "false");
  };


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
            valor={toBool(evento.modelo.enviado_a_cliente)}
            onChange={handleCheckboxChange("enviado_a_cliente")} 
          />
          <QCheckbox 
            label="C. proveedor enviado" 
            nombre="enviado_a_proveedor" 
            valor={toBool(evento.modelo.enviado_a_proveedor)}
            onChange={handleCheckboxChange("enviado_a_proveedor")} 
          />
          <QCheckbox 
            label="Hoja ruta hecha" 
            nombre="hoja_ruta_hecha" 
            valor={toBool(evento.modelo.hoja_ruta_hecha)}
            onChange={handleCheckboxChange("hoja_ruta_hecha")} 
          />
          <QCheckbox 
            label="Presupuesto" 
            nombre="presupuesto" 
            valor={toBool(evento.modelo.presupuesto)}
            onChange={handleCheckboxChange("presupuesto")} 
          />
          <QCheckbox 
            label="Alta de seguridad social" 
            nombre="altas_ss" 
            valor={toBool(evento.modelo.altas_ss)}
            onChange={handleCheckboxChange("altas_ss")} 
          />
          <QCheckbox 
            label="Liquidación" 
            nombre="liquidacion" 
            valor={toBool(evento.modelo.liquidacion)}
            onChange={handleCheckboxChange("liquidacion")} 
          />
        </div>
        <div className="columna-checkbox col-2">
          <QCheckbox 
            label="C. cliente recibido" 
            nombre="recibido_por_cliente" 
            valor={toBool(evento.modelo.recibido_por_cliente)}
            onChange={handleCheckboxChange("recibido_por_cliente")} 
          />
          <QCheckbox 
            label="C. proveedor recibido" 
            nombre="recibido_por_proveedor" 
            valor={toBool(evento.modelo.recibido_por_proveedor)}
            onChange={handleCheckboxChange("recibido_por_proveedor")} 
          />
          <QCheckbox 
            label="Hoja ruta enviada" 
            nombre="hoja_ruta_enviada" 
            valor={toBool(evento.modelo.hoja_ruta_enviada)}
            onChange={handleCheckboxChange("hoja_ruta_enviada")} 
          />
          <QCheckbox 
            label="Factura enviada" 
            nombre="factura_enviada" 
            valor={toBool(evento.modelo.factura_enviada)}
            onChange={handleCheckboxChange("factura_enviada")} 
          />
          <QCheckbox 
            label="Cartelería" 
            nombre="carteleria" 
            valor={toBool(evento.modelo.carteleria)}
            onChange={handleCheckboxChange("carteleria")} 
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