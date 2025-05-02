import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { HookModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../comun/componentes/dirCliente.tsx";
import { Presupuesto, CambioCliente as TipoCambioCliente } from "../diseño.ts";
import { getPresupuesto, patchCambiarCliente, patchPresupuesto } from "../infraestructura.ts";
import { CambioCliente } from "./CambioCliente.tsx";
import "./TabCliente.css";


interface TabClienteProps {
  ctxPresupuesto: HookModelo<Presupuesto>; 
  onEntidadActualizada: (entidad: Presupuesto) => void;
}

export const TabCliente = ({
  ctxPresupuesto,
  onEntidadActualizada,
}: TabClienteProps) => {

  const [mostrarModalCambioCliente, setMostrarModalCambioCliente] = useState(false);

  const [presupuesto, uiProps, init] = ctxPresupuesto;

  const onGuardarClicked = async () => {
    await patchPresupuesto(presupuesto.valor.id, presupuesto.valor);
    refrescar();
  };

  const cambiarCliente = async (nuevoCliente: TipoCambioCliente) => {
    setMostrarModalCambioCliente(false);
    await patchCambiarCliente(presupuesto.valor.id, 
      nuevoCliente.cliente_id,
      nuevoCliente.direccion_id);
    await refrescar();
  };

  const refrescar = async () => {
    const presupuesto_guardado = await getPresupuesto(presupuesto.valor.id);
    init(presupuesto_guardado);
    onEntidadActualizada(presupuesto.valor);
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
          onClick={onCambiarClienteClicked}
        >C</QBoton>
        </div>
        <DirCliente
          clienteId={presupuesto.valor.cliente_id}
          {...uiProps("direccion_id")}
        />
      </quimera-formulario>
      {/* <div className="botones maestro-botones">
        <QBoton
          onClick={onGuardarClicked}
          deshabilitado={!modeloEsValido(presupuesto)}
        >
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => init(presupuesto.valor_inicial)}
          deshabilitado={!modeloModificado(presupuesto)}
        >
          Cancelar
        </QBoton>
      </div> */}
      <QModal nombre="modal" abierto={mostrarModalCambioCliente} onCerrar={() => setMostrarModalCambioCliente(false)}>
        <CambioCliente onListo={cambiarCliente} 
          />
      </QModal>
    </>
  );
};
