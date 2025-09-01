import { useContext } from "react";

import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { Mostrar } from "../../../../../componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { EmitirEvento } from "../../../../comun/diseño.ts";
import { HookModelo, useModelo } from "../../../../comun/useModelo.ts";
import { Cliente } from "../../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../../comun/componentes/dirCliente.tsx";
import { NuevoPresupuesto } from "../../diseño.ts";
import { metaNuevoPresupuesto, nuevoPresupuestoVacio } from "../../dominio.ts";
import { getPresupuesto, postPresupuesto } from "../../infraestructura.ts";
import "./CrearPresupuesto.css";


export const CrearPresupuesto = ({
  publicar = () => {},
  activo= false
}: {
  publicar?: EmitirEvento;
  activo: boolean;
}) => {

  const presupuesto = useModelo(metaNuevoPresupuesto, {
    ...nuevoPresupuestoVacio,
  });

  const cancelar = () => {
    presupuesto.init();
    publicar("creacion_presupuesto_cancelada");
  };


  return (
    <Mostrar modo="modal" activo={activo}
      onCerrar={cancelar}
    >
      <FormAltaPresupuesto
        publicar={publicar}
        presupuesto={presupuesto}
        />
    </Mostrar>
  );
};

const FormAltaPresupuesto = ({
  publicar = () => {},
  presupuesto,
}: {
  publicar?: EmitirEvento;
  presupuesto: HookModelo<NuevoPresupuesto>;
}) => {

  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = {
      ...presupuesto.modelo,
    };
    const id = await intentar(() => postPresupuesto(modelo));
    const presupuestoCreada = await getPresupuesto(id);
    publicar("presupuesto_creado", presupuestoCreada);
    presupuesto.init();
  };

  const cancelar = () => { 
    publicar("creacion_presupuesto_cancelada");
    presupuesto.init();
  };

  return (
    <div className="CrearPresupuesto">
      <h2>Nueva Presupuesto</h2>
      <quimera-formulario>
        <Cliente
          {...presupuesto.uiProps("cliente_id", "nombre")}
          nombre="clientePresupuesto" 
        />
        <DirCliente
          clienteId={presupuesto.modelo.cliente_id}
          {...presupuesto.uiProps("direccion_id")}
        />
        <QInput label="Empresa" {...presupuesto.uiProps("empresa_id")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!presupuesto.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};

