import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import { cambioClienteVacio, metaCambioCliente } from "../../../dominio.ts";
import {
  getPresupuesto,
  patchCambiarCliente,
} from "../../../infraestructura.ts";
import "./CambioCliente.css";

export const CambioCliente = ({
  presupuestoId,
  publicar = () => {},
}: {
  presupuestoId: string;
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const { modelo, uiProps, valido } = useModelo(
    metaCambioCliente,
    cambioClienteVacio()
  );

  const guardar = async () => {
    await patchCambiarCliente(
      presupuestoId,
      modelo.cliente_id,
      modelo.direccion_id
    );
    const nuevoPresupuesto = await getPresupuesto(presupuestoId);
    publicar("cambio_cliente_listo", nuevoPresupuesto);
  };

  return (
    <div className="CambioCliente">
      <h2>Cambiar cliente</h2>

      <quimera-formulario>
        <Cliente
          {...uiProps("cliente_id", "nombre_cliente")}
          nombre="cliente_id_cambio"
        />
        <DirCliente
          clienteId={modelo.cliente_id}
          {...uiProps("direccion_id")}
        />
      </quimera-formulario>

      <div className="botones maestro-botones ">
        <QBoton onClick={guardar} deshabilitado={!valido}>
          Guardar
        </QBoton>
      </div>
    </div>
  );
};
