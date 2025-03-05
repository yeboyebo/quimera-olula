import { useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { Vista } from "../../../../componentes/vista/Vista.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Cliente, ClienteConDirecciones, DireccionCliente } from "../diseño.ts";
import { accionesCliente } from "../infraestructura.ts";

export const MaestroConDetalleCliente = () => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada } = context;

  const titulo = (cliente: Cliente) => cliente.nombre;

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

  const obtenerUno = async () => {
    return seleccionada as ClienteConDirecciones;
  };

  const AccionesClienteMaestroConDetalle = {
    ...accionesCliente,
    obtenerUno,
  };

  const MaestroDirecciones = () => {
    if (!seleccionada) {
      return null;
    }

    const acciones = {
      obtenerTodos: async () =>
        (seleccionada.direcciones ?? []) as DireccionCliente[],
      obtenerUno: async () => ({} as DireccionCliente),
      crearUno: async () => {},
      actualizarUno: async () => {},
      eliminarUno: async () => {},
    };

    return <Maestro acciones={acciones} />;
  };

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Maestro acciones={AccionesClienteMaestroConDetalle} />
      </div>
      <div className="Detalle" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Detalle
          id={seleccionada?.id ?? "0"}
          camposEntidad={camposCliente}
          acciones={accionesCliente}
          obtenerTitulo={titulo}
        >
          <h2>Direcciones</h2>
          <Vista>
            <MaestroDirecciones slot="contenido" />
          </Vista>
        </Detalle>
      </div>
    </div>
  );
};
