import { useCallback, useEffect, useState } from "react";
import {
  MetaTabla,
  QTabla,
} from "../../../../../../componentes/atomos/qtabla.tsx";
import { useLista } from "../../../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { Cliente } from "../../../../cliente/diseño.ts";
import { Contacto } from "../../../diseño.ts";
import { getClientesPorContacto } from "../../../infraestructura.ts";
import { TabClientesAcciones } from "./TabClientesAcciones.tsx";

type Estado = "lista" | "vincular_cliente" | "desvincular_cliente";

export const TabClientes = ({
  contacto,
}: {
  contacto: HookModelo<Contacto>;
}) => {
  const clientes = useLista<Cliente>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("lista");
  const contactoId = contacto.modelo.id;

  const setListaClientes = clientes.setLista;

  const cargarClientes = useCallback(async () => {
    setCargando(true);
    const nuevosClientes = await getClientesPorContacto(contactoId);
    setListaClientes(nuevosClientes);
    setCargando(false);
  }, [contactoId, setListaClientes]);

  useEffect(() => {
    if (contactoId) cargarClientes();
  }, [contactoId, cargarClientes]);

  const maquina: Maquina<Estado> = {
    lista: {
      VINCULAR_SOLICITADO: "vincular_cliente",
      DESVINCULAR_SOLICITADO: "desvincular_cliente",
      CLIENTE_SELECCIONADO: (payload: unknown) => {
        const cliente = payload as Cliente;
        clientes.seleccionar(cliente);
      },
    },
    desvincular_cliente: {
      CLIENTE_DESVINCULADO: async (payload: unknown) => {
        const cliente = payload as Cliente;
        clientes.eliminar(cliente);
        return "lista" as Estado;
      },
      CANCELAR_DESVINCULACION: "lista",
    },
    vincular_cliente: {
      CLIENTE_VINCULADO: async (payload: unknown) => {
        const cliente = payload as Cliente;
        clientes.añadir(cliente);
        return "lista" as Estado;
      },
      CANCELAR_VINCULACION: "lista",
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const metaTablaCliente: MetaTabla<Cliente> = [
    { id: "id", cabecera: "Id" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "email", cabecera: "Email" },
  ];

  return (
    <div className="TabClientes">
      <TabClientesAcciones
        seleccionada={clientes.seleccionada}
        emitir={emitir}
        estado={estado}
        contacto={contacto}
      />
      <QTabla
        metaTabla={metaTablaCliente}
        datos={clientes.lista}
        cargando={cargando}
        seleccionadaId={clientes.seleccionada?.id}
        onSeleccion={(cliente) => emitir("CLIENTE_SELECCIONADO", cliente)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
