import { useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Entidad, EntidadAccion } from "../../../comun/diseño.ts";
import { crearAccionesRelacionadas } from "../../../comun/infraestructura.ts";
import { Cliente } from "../diseño.ts";
import { accionesCliente } from "../infraestructura.ts";
import { MaestroDireccionesAcciones } from "./MaestroDireccionesAcciones.tsx";

export const MaestroConDetalleCliente = () => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada, entidades, setEntidades } = context;

  const titulo = (cliente: Entidad) => cliente.nombre as string;

  const camposCliente: CampoFormularioGenerico[] = [
    {
      nombre: "id",
      etiqueta: "Código",
      tipo: "text",
      oculto: true,
    },
    { nombre: "nombre", etiqueta: "Nombre", tipo: "text", ancho: "100%" },
    { nombre: "id_fiscal", etiqueta: "CIF/NIF", tipo: "text" },
    { nombre: "agente_id", etiqueta: "Agente", tipo: "text" },
    {
      nombre: "divisa_id",
      etiqueta: "Divisa",
      tipo: "text",
      soloLectura: true,
    },
    { nombre: "tipo_id_fiscal", etiqueta: "Tipo ID Fiscal", tipo: "text" },
    { nombre: "serie_id", etiqueta: "Serie", tipo: "text", soloLectura: true },
    { nombre: "forma_pago_id", etiqueta: "Forma de Pago", tipo: "text" },
    {
      nombre: "grupo_iva_negocio_id",
      etiqueta: "Grupo IVA Negocio",
      tipo: "text",
    },
    { nombre: "eventos", etiqueta: "Eventos", tipo: "text", oculto: true },
    { nombre: "espacio", etiqueta: "", tipo: "space" },
  ];

  const camposDireccion: CampoFormularioGenerico[] = [
    { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
    { nombre: "nombre_via", etiqueta: "Nombre de la Vía", tipo: "text" },
    { nombre: "tipo_via", etiqueta: "Tipo de Vía", tipo: "text" },
    { nombre: "numero", etiqueta: "Número", tipo: "text" },
    { nombre: "otros", etiqueta: "Otros", tipo: "text" },
    { nombre: "cod_postal", etiqueta: "Código Postal", tipo: "text" },
    { nombre: "ciudad", etiqueta: "Ciudad", tipo: "text" },
    { nombre: "provincia_id", etiqueta: "ID de Provincia", tipo: "number" },
    { nombre: "provincia", etiqueta: "Provincia", tipo: "text" },
    { nombre: "pais_id", etiqueta: "ID de País", tipo: "text" },
    { nombre: "apartado", etiqueta: "Apartado", tipo: "text" },
    { nombre: "telefono", etiqueta: "Teléfono", tipo: "text" },
  ];

  const actualizarCliente = (cliente: Cliente) => {
    setEntidades([
      ...entidades.map((c) => (c.id !== cliente.id ? c : cliente)),
    ]);
  };

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Maestro acciones={accionesCliente} camposEntidad={camposCliente} />
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
