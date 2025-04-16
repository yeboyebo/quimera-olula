import { useState } from "react";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { Accion, EstadoObjetoValor } from "../../../comun/dominio.ts";
import { getClientes, getDirecciones } from "../../cliente/infraestructura.ts";
import { Presupuesto } from "../diseño.ts";

interface TabClienteProps {
  getProps: (campo: string) => Record<string, unknown>;
  setCampo: (campo: string) => (valor: unknown) => void;
  presupuesto: EstadoObjetoValor<Presupuesto>;
  dispatch: (action: Accion<Presupuesto>) => void;
  onEntidadActualizada: (entidad: Presupuesto) => void;
}

export const TabCliente = ({
  getProps,
  setCampo,
  presupuesto,
}: TabClienteProps) => {
  const [opcionesDireccion, setOpcionesDireccion] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  const obtenerOpcionesCliente = async (valor: string, id?: string) => {
    const criteria = {
      filtro: id
        ? {
            id: {
              LIKE: id,
            },
          }
        : {
            nombre: {
              LIKE: valor,
            },
          },
      orden: { id: "DESC" },
    };

    const clientes = await getClientes(
      criteria.filtro as unknown as Filtro,
      criteria.orden as Orden
    );

    return clientes.map((cliente) => ({
      valor: cliente.id,
      descripcion: cliente.nombre,
    }));
  };

  const onClienteBlurred = async (
    clienteId: {
      valor: string;
      descripcion: string;
    } | null
  ) => {
    if (!clienteId) return;
    setCampo("cliente_id")(clienteId.valor);

    const direcciones = await getDirecciones(clienteId.valor);
    const opciones = direcciones.map((direccion) => ({
      valor: direccion.id,
      descripcion: `${direccion.tipo_via} ${direccion.nombre_via}, ${direccion.ciudad}`,
    }));
    setOpcionesDireccion(opciones);
  };

  return (
    <quimera-formulario>
      <QAutocompletar
        label="Cliente"
        nombre="cliente_id"
        onBlur={onClienteBlurred}
        onChange={(opcion) => {
          console.log("Cliente cambiado:", opcion);
        }}
        valor={presupuesto.valor.cliente_id}
        obtenerOpciones={obtenerOpcionesCliente}
      />
      <QInput
        label="ID Fiscal"
        nombre="id_fiscal"
        onChange={setCampo("id_fiscal")}
        {...getProps("id_fiscal")}
      />
      <QSelect
        label="Dirección"
        nombre="direccion_id"
        opciones={opcionesDireccion}
        onChange={(opcion) => setCampo("direccion_id")(opcion?.valor || "")}
        {...getProps("direccion_id")}
      />
    </quimera-formulario>
  );
};
