import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { cambioClienteFacturaVacio, metaCambioClienteFactura } from "../detalle.ts";
import "./CambioCliente.css";

export const CambioCliente = ({
  publicar = () => {},
}: {
  publicar?: EmitirEvento;
}) => {
  const { modelo, uiProps, valido } = useModelo(
    metaCambioClienteFactura,
    cambioClienteFacturaVacio
  );

  return (
    <>
      <h2>Cambiar cliente</h2>

      <quimera-formulario>
        <Cliente
          {...uiProps("cliente_id", "nombre_cliente")}
          nombre="cambiar_cliente_presupuesto"
        />
        <DirCliente
          clienteId={modelo.cliente_id}
          {...uiProps("direccion_id")}
        />
      </quimera-formulario>

      <div className="botones maestro-botones ">
        <QBoton
          onClick={() => publicar("CAMBIO_CLIENTE_LISTO", modelo)}
          deshabilitado={!valido}
        >
          Guardar
        </QBoton>
      </div>
    </>
  );
};
