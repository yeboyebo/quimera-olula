import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Entidad } from "../../../comun/diseño.ts";
import { Cliente } from "../diseño.ts";
import { accionesCliente } from "../infraestructura.ts";
import { MaestroDirecciones } from "./MaestroDirecciones.tsx";

export const DetalleCliente = () => {
  const { id } = useParams();

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada, setSeleccionada } = context;
  const { obtenerUno, obtenerOpcionesSelector } = accionesCliente;
  const [opcionesDivisa, setOpcionesDivisa] = useState<[]>([]);

  useEffect(() => {
    obtenerOpcionesSelector("divisa")().then(setOpcionesDivisa);
  }, []);

  useEffect(() => {
    if (seleccionada && seleccionada.id === id) {
      return;
    }

    obtenerUno(id ?? "0").then((entidad) =>
      setSeleccionada(entidad as Cliente)
    );
  }, [id, obtenerUno, seleccionada, setSeleccionada]);

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
      tipo: "select",
      opciones: opcionesDivisa,
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

  return (
    <Detalle
      id={id ?? "0"}
      camposEntidad={camposCliente}
      acciones={accionesCliente}
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
            children={<MaestroDirecciones id={id} />}
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
  );
};
