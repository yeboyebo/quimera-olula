import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { HookModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../comun/componentes/dirCliente.tsx";
import { Presupuesto, CambioCliente as TipoCambioCliente } from "../diseño.ts";
import { editable } from "../dominio.ts";
import { getPresupuesto, patchCambiarCliente } from "../infraestructura.ts";

import { CambioCliente } from "./CambioCliente.tsx";
import "./TabCliente.css";


interface TabClienteProps {
  ctxPresupuesto: HookModelo<Presupuesto>; 
  onEntidadActualizada: (entidad: Presupuesto) => void;
  presupuesto?: Presupuesto;
}

export const TabCliente = ({
  ctxPresupuesto,
  onEntidadActualizada,
}: TabClienteProps) => {

  const [mostrarModalCambioCliente, setMostrarModalCambioCliente] = useState(false);

  const {modelo, uiProps, init} = ctxPresupuesto;
  
  const cambiarCliente = async (nuevoCliente: TipoCambioCliente) => {
    setMostrarModalCambioCliente(false);
    await patchCambiarCliente(modelo.id, 
      nuevoCliente.cliente_id,
      nuevoCliente.direccion_id);
    await refrescar();
  };

  const refrescar = async () => {
    const presupuesto_guardado = await getPresupuesto(modelo.id);
    init(presupuesto_guardado);
    onEntidadActualizada(modelo);
  }

  const onCambiarClienteClicked = async () => {
    setMostrarModalCambioCliente(true);
  };

  return (
    <>
      <quimera-formulario>
        <Cliente
          {...uiProps("cliente_id", "nombre_cliente")}
        />
        <QInput
          {...uiProps("id_fiscal")}
          label="ID Fiscal"
        />
        <div id='cambiar_cliente' className="botones maestro-botones">
        <QBoton
          deshabilitado={!editable(modelo)}
          onClick={onCambiarClienteClicked}
        >C</QBoton>
        </div>
        <DirCliente
          clienteId={modelo.cliente_id}
          {...uiProps("direccion_id")}
        />
      </quimera-formulario>
      <QModal nombre="modal" abierto={mostrarModalCambioCliente} onCerrar={() => setMostrarModalCambioCliente(false)}>
        <CambioCliente onListo={cambiarCliente} 
          />
      </QModal>
    </>
  );
};
