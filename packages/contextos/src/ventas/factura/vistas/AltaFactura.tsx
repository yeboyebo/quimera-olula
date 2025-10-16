import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { metaNuevaFactura, nuevaFacturaVacia } from "../dominio.ts";
import { getFactura, postFactura } from "../infraestructura.ts";
import "./AltaFactura.css";

export const AltaFactura = ({
  publicar = () => {},
}: {
  publicar?: EmitirEvento;
}) => {
  const nuevaFactura = useModelo(metaNuevaFactura, nuevaFacturaVacia);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postFactura(nuevaFactura.modelo));
    const facturaCreada = await getFactura(id);
    publicar("factura_creada", facturaCreada);
  };

  const cancelar = () => {
    publicar("alta_cancelada");
    nuevaFactura.init();
  };

  return (
    <div className="AltaFactura">
      <h2>Nueva Factura</h2>
      <quimera-formulario>
        <Cliente
          {...nuevaFactura.uiProps("cliente_id", "nombre")}
          nombre="factura_cliente_id"
        />
        <DirCliente
          clienteId={nuevaFactura.modelo.cliente_id}
          {...nuevaFactura.uiProps("direccion_id")}
        />
        <QInput label="Empresa" {...nuevaFactura.uiProps("empresa_id")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevaFactura.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
