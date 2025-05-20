import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../comun/componentes/dirCliente.tsx";
import { metaNuevoPresupuesto, presupuestoNuevoVacio } from "../dominio.ts";
import { getPresupuesto, postPresupuesto } from "../infraestructura.ts";
import "./AltaPresupuesto.css";
export const AltaPresupuesto = ({
  emitir = () => {},
}: {
  emitir?: EmitirEvento;
}) => {
  const nuevoPresupuesto = useModelo(
    metaNuevoPresupuesto,
    presupuestoNuevoVacio()
  );

  const guardar = async () => {
    const id = await postPresupuesto(nuevoPresupuesto.modelo);
    const presupuestoCreado = await getPresupuesto(id);
    emitir("PRESUPUESTO_CREADO", presupuestoCreado);
  };

  return (
    <div className="AltaPresupuesto">
      <h2>Nuevo Presupuesto</h2>
      <quimera-formulario>
        <Cliente {...nuevoPresupuesto.uiProps("cliente_id")} />
        <DirCliente
          clienteId={nuevoPresupuesto.modelo.cliente_id}
          {...nuevoPresupuesto.uiProps("direccion_id")}
        />
        <QInput label="Empresa" {...nuevoPresupuesto.uiProps("empresa_id")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevoPresupuesto.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
