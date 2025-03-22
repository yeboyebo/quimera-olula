import { useContext, useState } from "react";
import { useParams } from "react-router";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Input } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { Contexto } from "../contexto.ts";
import { Cliente } from "../diseño.ts";
import { clienteVacio, guardar } from "../dominio.ts";
import {
  accionesCliente,
  camposCliente
} from "../infraestructura.ts";
import { IdFiscal } from "./IdFiscal.tsx";
import { TabDirecciones } from "./TabDirecciones.tsx";

export const DetalleCliente = (
  {
    onEntidadActualizada,
  }: {
    onEntidadActualizada: (entidad: Cliente) => void;
  }
) => {
  const params = useParams();

  const context = useContext(Contexto);
  if (!context) {
    return null;
  }
  const { seleccionada } = context;

  const [guardando, setGuardando] = useState(false);

  const clienteId = seleccionada?.id ?? params.id ?? "0";

  const sufijoTitulo = guardando ? " (Guardando...)" : "";
  const titulo = (cliente: Entidad) => `${cliente.nombre} ${sufijoTitulo}` as string;

  const [cliente, setCliente] = useState<Cliente>(clienteVacio());

  const onIdFiscalCambiadoCallback = (idFiscal: any) => {
    const nuevoCliente = { ...cliente, ...idFiscal };
    setCliente(nuevoCliente);
    onEntidadActualizada && onEntidadActualizada(nuevoCliente);
  }

  const onCampoCambiado = async (campo: string, valor: any) => {
    console.log("campo cambiado", campo, 'valor = ', valor);
    setGuardando(true);
    await guardar(clienteId,{
      [campo]: valor
    })
    setGuardando(false);
    const nuevoCliente: Cliente = { ...cliente, [campo]: valor };
    setCliente(nuevoCliente);
    onEntidadActualizada && onEntidadActualizada(nuevoCliente);
  };

  return (

     <Detalle
       id={clienteId ?? "0"}
       camposEntidad={[]}
       acciones={accionesCliente}
       obtenerTitulo={titulo}
       onCampoCambiado={onCampoCambiado}
       setEntidad={(c) => setCliente(c as Cliente)}
       entidad={cliente}
     >
     <Input
        controlado={false}            
        key='tipo_via'
        campo={camposCliente.nombre}
        onCampoCambiado={onCampoCambiado}
        valorEntidad={cliente?.nombre ?? ''}
    />
      <IdFiscal
        cliente={cliente}
        onIdFiscalCambiadoCallback={onIdFiscalCambiadoCallback}
      />
      <Input
        controlado={false}
        key='agente_id'
        campo={camposCliente.agente_id}
        onCampoCambiado={onCampoCambiado}
        valorEntidad={cliente?.agente_id ?? ''}
      />

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
                <TabDirecciones clienteId={clienteId} />
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
