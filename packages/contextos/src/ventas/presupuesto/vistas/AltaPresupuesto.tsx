import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { metaNuevoPresupuesto, nuevoPresupuestoVacio } from "../dominio.ts";
import { getPresupuesto, postPresupuesto } from "../infraestructura.ts";
import "./AltaPresupuesto.css";
export const AltaPresupuesto = ({
  publicar = () => {},
}: {
  publicar?: EmitirEvento;
}) => {
  const nuevoPresupuesto = useModelo(
    metaNuevoPresupuesto,
    nuevoPresupuestoVacio
  );
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postPresupuesto(nuevoPresupuesto.modelo));
    const presupuestoCreado = await getPresupuesto(id);
    publicar("presupuesto_creado", presupuestoCreado);
  };

  return (
    <div className="AltaPresupuesto">
      <h2>Nuevo Presupuesto</h2>
      <quimera-formulario>
        <Cliente
          {...nuevoPresupuesto.uiProps("cliente_id", "nombre")}
          nombre="clientePresupuesto"
        />
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
        <QBoton
          onClick={() => publicar("creacion_presupuesto_cancelada")}
          variante="texto"
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
