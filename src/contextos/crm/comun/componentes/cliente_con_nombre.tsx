import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QIcono } from "../../../../componentes/atomos/qicono.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { Cliente as ClienteAuto } from "../../../ventas/comun/componentes/cliente.tsx";
import { getClientes } from "../../cliente/infraestructura.ts";

interface ClienteProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

interface ClienteConNombreProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  labelNombre?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Cliente = ({
  descripcion = "",
  valor,
  nombre = "cliente_id",
  label = "Cliente",
  onChange,
  ...props
}: ClienteProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria = {
      filtro: {
        nombre: {
          LIKE: texto,
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

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
      {...props}
    />
  );
};

export const ClienteConNombre = ({
  descripcion = "",
  valor,
  nombre = "cliente_id",
  label = "Cliente",
  labelNombre = "Nombre del Cliente",
  onChange,
  ...props
}: ClienteConNombreProps) => {
  const [mostrarNombre, setMostrarNombre] = useState(false);
  const [nombreCliente, setNombreCliente] = useState(descripcion);

  const handleClienteChange = (
    opcion: { valor: string; descripcion: string } | null
  ) => {
    setNombreCliente(opcion?.descripcion ?? "");
    onChange(opcion);
  };

  const handleNombreChange = (nuevoNombre: string) => {
    setNombreCliente(nuevoNombre);
    onChange({ valor, descripcion: nuevoNombre });
  };

  return (
    <>
      <ClienteAuto
        descripcion={descripcion}
        valor={valor}
        nombre={nombre}
        label={label}
        onChange={handleClienteChange}
        {...props}
      />

      {mostrarNombre && (
        <QInput
          label={labelNombre}
          valor={nombreCliente}
          onChange={handleNombreChange}
          nombre="nombre_cliente"
        />
      )}
      <QBoton
        variante="texto"
        tamaño="pequeño"
        onClick={() => setMostrarNombre((v) => !v)}
      >
        <QIcono nombre={mostrarNombre ? "candado_abierto" : "candado"} />
      </QBoton>
    </>
  );
};
