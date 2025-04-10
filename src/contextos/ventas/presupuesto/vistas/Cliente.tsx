import { useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QForm } from "../../../../componentes/atomos/qform.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { Presupuesto, Cliente as TipoCliente } from "../diseño.ts";
import { patchCambiarCliente } from "../infraestructura.ts";

interface ClienteProps {
  presupuesto: Presupuesto;
  onClienteCambiadoCallback: (cliente: TipoCliente) => void;
}

export const Cliente = ({
  presupuesto,
  onClienteCambiadoCallback,
}: ClienteProps) => {
  const [modoLectura, setModoLectura] = useState(true);

  useEffect(() => {
    setModoLectura(true);
  }, [presupuesto]);

  return modoLectura ? (
    <ClienteLectura
      presupuesto={presupuesto}
      onEditarCallback={() => setModoLectura(false)}
    />
  ) : (
    <ClienteEdicion
      presupuesto={presupuesto}
      onClienteCambiadoCallback={onClienteCambiadoCallback}
      canceladoCallback={() => setModoLectura(true)}
    />
  );
};

const ClienteLectura = ({
  presupuesto,
  onEditarCallback,
}: {
  presupuesto: Presupuesto;
  onEditarCallback: () => void;
}) => {
  return (
    <>
      <label>
        {presupuesto.cliente_id}: {presupuesto.nombre_cliente}
      </label>
      <label>
        {presupuesto.direccion.nombre_via}: {presupuesto.direccion.ciudad}
      </label>
      <button onClick={onEditarCallback}>Editar</button>
    </>
  );
};

const ClienteEdicion = ({
  presupuesto,
  onClienteCambiadoCallback,
  canceladoCallback,
}: {
  presupuesto: Presupuesto;
  onClienteCambiadoCallback: (cliente: TipoCliente) => void;
  canceladoCallback: () => void;
}) => {
  const guardarClienteClicked = async ({
    cliente_id,
    direccion_id,
  }: Record<string, string>) => {
    patchCambiarCliente(presupuesto.id, cliente_id, direccion_id).then(() => {
      onClienteCambiadoCallback({ cliente_id, direccion_id });
    });
  };

  // const obtenerOpcionesCliente = async () => [
  //   { valor: "1", descripcion: "Antonio 1" },
  //   { valor: "2", descripcion: "Juanma 2" },
  //   { valor: "3", descripcion: "Pozu 3" },
  // ];

  return (
    <QForm onSubmit={guardarClienteClicked} onReset={canceladoCallback}>
      <section>
        {/* <QAutocompletar
          label="ID Cliente"
          nombre="cliente_id"
          valor={presupuesto.cliente_id}
          obtenerOpciones={obtenerOpcionesCliente}
        /> */}
        <QInput
          label="ID Dirección"
          nombre="direccion_id"
          valor={presupuesto.direccion_id}
        />
      </section>
      <section>
        <QBoton tipo="submit">Guardar</QBoton>
        <QBoton tipo="reset" variante="texto">
          Cancelar
        </QBoton>
      </section>
    </QForm>
  );
};
