import { useContext } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../comun/componentes/dirCliente.tsx";
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
    publicar("FACTURA_CREADA", facturaCreada);
  };

  return (
    <div className="AltaFactura">
      <h2>Nueva Factura</h2>
      <quimera-formulario>
        <Cliente
          {...nuevaFactura.uiProps("cliente_id")}
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
        <QBoton onClick={() => publicar("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
