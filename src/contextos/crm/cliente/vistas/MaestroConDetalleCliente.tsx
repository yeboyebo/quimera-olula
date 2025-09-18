import { useCallback } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { Entidad, ListaSeleccionable } from "../../../comun/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "../../../comun/useMaquina.ts";
import { Cliente } from "../diseño.ts";
import { getClientes } from "../infraestructura.ts";
import { DetalleCliente } from "./DetalleCliente/DetalleCliente.tsx";
import "./MaestroConDetalleCliente.css";

const metaTablaCliente = [
  { id: "id", cabecera: "Id" },
  { id: "nombre", cabecera: "Nombre" },
  {
    id: "id_fiscal",
    cabecera: "Id Fiscal",
    render: (entidad: Entidad) =>
      `${entidad.tipo_id_fiscal}: ${entidad.id_fiscal}`,
  },
  { id: "telefono1", cabecera: "Teléfono" },
  { id: "email", cabecera: "Email" },
];

type Estado = "inactivo";
type Contexto = {
  clientes: ListaSeleccionable<Cliente>;
};

const setClientes =
  (
    aplicable: (
      clientes: ListaSeleccionable<Cliente>
    ) => ListaSeleccionable<Cliente>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        clientes: aplicable(maquina.contexto.clientes),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      clientes: listaSeleccionableVacia<Cliente>(),
    },
  },
  estados: {
    inactivo: {
      cliente_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setClientes(cambiarItem(payload as Cliente))),
      cliente_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setClientes(seleccionarItem(payload as Cliente))),
      cliente_borrado: ({ maquina }) => {
        const { clientes } = maquina.contexto;
        if (!clientes.idActivo) {
          return maquina;
        }
        return pipe(maquina, setClientes(quitarItem(clientes.idActivo)));
      },
      clientes_cargados: ({ maquina, payload }) =>
        pipe(maquina, setClientes(cargar(payload as Cliente[]))),
    },
  },
};

export const MaestroConDetalleClienteCRM = () => {
  const [emitir, { contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { clientes } = contexto;

  const setEntidades = useCallback(
    (payload: Cliente[]) => emitir("clientes_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Cliente) => emitir("cliente_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(clientes);

  return (
    <div className="Cliente">
      <MaestroDetalleResponsive<Cliente>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Clientes</h2>
            <Listado
              metaTabla={metaTablaCliente}
              entidades={clientes.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getClientes}
            />
          </>
        }
        Detalle={
          <DetalleCliente clienteInicial={seleccionada} publicar={emitir} />
        }
      />
    </div>
  );
};
