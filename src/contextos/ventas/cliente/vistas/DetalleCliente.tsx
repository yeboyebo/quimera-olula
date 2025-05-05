import { useParams } from "react-router";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../diseño.ts";
import { clienteVacio, metaCliente } from "../dominio.ts";
import { getCliente, patchCliente } from "../infraestructura.ts";
import "./DetalleCliente.css";
import { TabComercial } from "./TabComercial.tsx";
import { TabCrmContactos } from "./TabCrmContactos.tsx";
import { TabCuentasBanco } from "./TabCuentasBanco.tsx";
import { TabDirecciones } from "./TabDirecciones.tsx";
import { TabGeneral } from "./TabGeneral.tsx";

export const DetalleCliente = ({
  clienteInicial = null,
  onEntidadActualizada = () => {},
  cancelarSeleccionada,
}: {
  clienteInicial?: Cliente | null;
  onEntidadActualizada?: (entidad: Cliente) => void;
  cancelarSeleccionada?: () => void;
}) => {
  const params = useParams();

  const clienteId = clienteInicial?.id ?? params.id;
  const titulo = (cliente: Entidad) => cliente.nombre as string;

  // const [cliente, dispatch] = useReducer(
  //   makeReductor(metaCliente),
  //   initEstadoClienteVacio()
  // );
  const cliente = useModelo(
    metaCliente,
    clienteVacio()
  );
  const { modelo, init, modificado, valido } = cliente;

  const onGuardarClicked = async () => {
    await patchCliente(modelo.id, modelo);
    const cliente_guardado = await getCliente(modelo.id);
    init(cliente_guardado);
    onEntidadActualizada(modelo);
  };


  // const setCampo = (campo: string) => (valor: unknown) => {
  //   dispatch({
  //     type: "set_campo",
  //     payload: { campo, valor: valor as string },
  //   });
  // };

  // const getProps = (campo: string) => {
  //   return campoModeloAInput(cliente, campo);
  // };

  const onRecargarCliente = async () => {
    const clienteRecargado = await getCliente(modelo.id);
    // dispatch({ type: "init", payload: { entidad: clienteRecargado } });
    init(clienteRecargado);
    onEntidadActualizada(clienteRecargado);
  };

  return (
    <Detalle
      id={clienteId}
      obtenerTitulo={titulo}
      setEntidad={(c) => init(c as Cliente) }
      entidad={modelo}
      cargar={getCliente}
      className="detalle-cliente"
      cerrarDetalle={cancelarSeleccionada}
    >
      {!!clienteId && (
        <>
          <Tabs
            children={[
              <Tab key="tab-1" label="General" children={
                  <TabGeneral
                    cliente={cliente}
                    onEntidadActualizada={onEntidadActualizada}
                    recargarCliente={onRecargarCliente}
                  />
                }
              />,
              <Tab key="tab-1" label="Comercial" children={
                  <TabComercial
                    cliente={cliente}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
              <Tab key="tab-2" label="Direcciones" children={
                  <TabDirecciones clienteId={clienteId} />
                }
              />,
              <Tab key="tab-3" label="Cuentas Bancarias" children={
                  <TabCuentasBanco
                    cliente={cliente}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
              <Tab
                key="tab-4"
                label="Agenda"
                children={
                  <div className="detalle-cliente-tab-contenido">
                    <TabCrmContactos clienteId={clienteId} />
                  </div>
                }
              />,
            ]}
          />
          { cliente.modificado && (
            <div className="botones maestro-botones ">
              <QBoton
                onClick={onGuardarClicked}
                deshabilitado={!valido}
              >
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => init()}
                deshabilitado={!modificado}
              >
                Cancelar
              </QBoton>
            </div>
          )}
        </>
      )}
    </Detalle>
  );
};
