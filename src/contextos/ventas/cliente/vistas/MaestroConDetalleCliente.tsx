import { useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Entidad, EntidadAccion } from "../../../comun/diseño.ts";
import { crearAccionesRelacionadas } from "../../../comun/infraestructura.ts";
import { Cliente } from "../diseño.ts";
import {
  accionesCliente,
  camposCliente,
  camposClienteNuevo,
  camposDireccion,
} from "../infraestructura.ts";
import { MaestroDireccionesAcciones } from "./MaestroDireccionesAcciones.tsx";

export const MaestroConDetalleCliente = () => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada, entidades, setEntidades } = context as {
    seleccionada: Entidad | null;
    entidades: Entidad[];
    setEntidades: (entidades: Entidad[]) => void;
  };

  const titulo = (cliente: Entidad) => cliente.nombre as string;

  const actualizarCliente = (cliente: Cliente) => {
    setEntidades([
      ...entidades.map((c) => (c.id !== cliente.id ? c : cliente)),
    ]);
  };

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Maestro
          acciones={accionesCliente}
          camposEntidad={camposClienteNuevo}
        />
      </div>
      <div className="Detalle" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Detalle
          id={seleccionada?.id ?? "0"}
          camposEntidad={camposCliente}
          acciones={{
            ...accionesCliente,
            actualizarUno: async (id: string, cliente: Cliente) => {
              await accionesCliente.actualizarUno(id, cliente);
              actualizarCliente(cliente);
            },
            crearUno: async (cliente: Entidad) => {
              await accionesCliente.crearUno(cliente);
              const nuevoCliente = await accionesCliente.obtenerUno(cliente.id);
              if (nuevoCliente) {
                setEntidades([...entidades, nuevoCliente]);
              }
            },
          }}
          obtenerTitulo={titulo}
        >
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Comercial"
                children={<div> Comercial contenido </div>}
              />,
              <Tab
                key="tab-2"
                label="Direcciones"
                children={
                  <SubVista>
                    <Maestro
                      Acciones={MaestroDireccionesAcciones}
                      acciones={crearAccionesRelacionadas<EntidadAccion>(
                        "cliente",
                        "direcciones",
                        seleccionada?.id ?? ("0" as string)
                      )}
                      camposEntidad={camposDireccion}
                    />
                  </SubVista>
                }
              />,
              <Tab
                key="tab-3"
                label="Cuentas Bancarias"
                children={<div> Cuentas Bancarias Master contenido </div>}
              />,
              <Tab
                key="tab-4"
                label="Agenda"
                children={<div> Agenda contenido </div>}
              />,
              <Tab
                key="tab-5"
                label="Descuentos"
                children={<div> Descuentos contenido</div>}
              />,
              <Tab
                key="tab-6"
                label="Documentos"
                children={<div> Documentos contenido</div>}
              />,
              <Tab
                key="tab-7"
                label="Contabilidad"
                children={<div> Contabilidad contenido</div>}
              />,
              <Tab
                key="tab-8"
                label="Factura-e"
                children={<div> Factura-e contenido</div>}
              />,
            ]}
          ></Tabs>
        </Detalle>
      </div>
    </div>
  );
};
