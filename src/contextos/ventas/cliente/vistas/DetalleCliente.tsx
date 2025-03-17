import { useContext } from "react";
import { useParams } from "react-router";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Entidad, EntidadAccion } from "../../../comun/diseño.ts";
import { crearAccionesRelacionadas } from "../../../comun/infraestructura.ts";
import {
  accionesCliente,
  camposCliente,
  camposDireccion,
} from "../infraestructura.ts";
import { MaestroDireccionesAcciones } from "./MaestroDireccionesAcciones.tsx";

export const DetalleCliente = () => {
  const params = useParams();

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada } = context;

  const clienteId = seleccionada?.id ?? params.id ?? "0";

  const titulo = (cliente: Entidad) => cliente.nombre as string;

  return (
    <Detalle
      id={clienteId ?? "0"}
      camposEntidad={camposCliente}
      acciones={accionesCliente}
      obtenerTitulo={titulo}
    >
      {!!clienteId && (
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
                      clienteId
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
      )}
    </Detalle>
  );
};
