import { useContext, useState } from "react";
import { useParams } from "react-router";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { Contexto } from "../contexto.ts";
import { Cliente } from "../diseño.ts";
import { guardar } from "../dominio.ts";
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

  const [entidad, setEntidad] = useState<Cliente | null>(null);

  const onIdFiscalCambiadoCallback = (idFiscal: any) => {
    const nuevaEntidad = { ...entidad, ...idFiscal };
    setEntidad(nuevaEntidad);
    onEntidadActualizada && onEntidadActualizada(nuevaEntidad);
  }

  const onCampoCambiado = async (campo: string, valor: any) => {
    console.log("campo cambiado", campo, 'valor = ', valor);
    setGuardando(true);
    await guardar(clienteId,{
      [campo]: valor
    })
    setGuardando(false);
    const nuevaEntidad = entidad ? { ...entidad, [campo]: valor } : null;
    setEntidad(nuevaEntidad);
    onEntidadActualizada && onEntidadActualizada(nuevaEntidad);
  };
  const campoAgenteId = camposCliente.find((c) => c.nombre === "agente_id");
  const campoNombre = camposCliente.find((c) => c.nombre === "nombre");

  const existe = clienteId !== "0";

  // useEffect(() => {
  //   if (!entidad || clienteId !== entidad.id) {
  //     if (!existe) return;
  //     const load = async () => {
  //       const cliente = await buscar(clienteId);
  //       setEntidad(cliente);
  //     }
  //     load();
  //   }
  // }, [clienteId, entidad, existe]);


  return (
     <Detalle
       id={clienteId ?? "0"}
       camposEntidad={[]}
       acciones={accionesCliente}
       obtenerTitulo={titulo}
       onCampoCambiado={onCampoCambiado}
       setEntidad={setEntidad}
       entidad={entidad}
     >
       <CampoGenerico
        key='nombre'
        campo={campoNombre}
        onCampoCambiado={onCampoCambiado}
        entidad={entidad}
      />
      <IdFiscal
        cliente={entidad}
        onIdFiscalCambiadoCallback={onIdFiscalCambiadoCallback}
      />
      <CampoGenerico
        key='agente_id'
        campo={campoAgenteId}
        onCampoCambiado={onCampoCambiado}
        entidad={entidad}
      />
      {/* <CampoGenerico
        key={campoTipoIdFiscal.nombre}
        campo={campoTipoIdFiscal}
        onCampoCambiado={onIdFiscalCambiado}
        entidad={{
          tipo_id_fiscal: idFiscal.tipo_id_fiscal
        }}
        validador={tipoIdFiscalValido}
      />
      <CampoGenerico
        key={campoIdFiscal.nombre}
        campo={campoIdFiscal}
        onCampoCambiado={onIdFiscalCambiado}
        entidad={{
          id_fiscal: idFiscal.id_fiscal
        }}
        validador={idFiscalValido(idFiscal.tipo_id_fiscal)}
      />
      <button
        disabled={!idFiscalValidoGeneral(idFiscal.tipo_id_fiscal, idFiscal.id_fiscal)}
        onClick={guardarIdFiscal}
      >
        Guardar Id Fiscal
      </button> */}

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
