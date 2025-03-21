import { useContext, useState } from "react";
import { useParams } from "react-router";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
// import { Contexto } from "../../../comun/contexto.ts";
import { Entidad, EntidadAccion } from "../../../comun/diseño.ts";
import { crearAccionesRelacionadas } from "../../../comun/infraestructura.ts";
import { Contexto } from "../contexto.ts";
import {
  accionesCliente,
  camposCliente,
  camposDireccion,
} from "../infraestructura.ts";
import { IdFiscal } from "./IdFiscal.tsx";
import { MaestroDireccionesAcciones } from "./MaestroDireccionesAcciones.tsx";

export const DetalleCliente = <T extends Entidad>({
  onEntidadActualizada,
}): {
  onEntidadActualizada: (entidad: T) => void;
} => {
  const params = useParams();

  const context = useContext(Contexto);
  if (!context) {
    return null;
  }
  const { seleccionada } = context;

  const clienteId = seleccionada?.id ?? params.id ?? "0";

  const titulo = (cliente: Entidad) => cliente.nombre as string;

  const [entidad, setEntidad] = useState<T | null>(null);
  // const [idFiscal, setIdFiscal] = useState({
  //   id_fiscal: entidad?.id_fiscal ?? "",
  //   tipo_id_fiscal: entidad?.tipo_id_fiscal ?? "",
  // });

  // useEffect(() => {
  //   if (!entidad) {
  //     return;
  //   }
  //   setIdFiscal({
  //     id_fiscal: entidad.id_fiscal,
  //     tipo_id_fiscal: entidad.tipo_id_fiscal,
  //   });
  // }, [entidad]);

  // const idFiscalValido = (tipo: string) => (valor: string) => {
  //   if (tipo === "NIF") {
  //     return valor.length === 9;
  //   }
  //   if (tipo === "NAF") {
  //     return valor.length === 11 && valor[0] === "E" && valor[1] === "S";
  //   }
  //   return false;
  // }
  // const tipoIdFiscalValido = (tipo: string) => {
  //   return tipo === "NIF" || tipo === "NAF";
  // }
  // const idFiscalValidoGeneral = (tipo: string, valor: string) => {
  //   return idFiscalValido(tipo)(valor) && tipoIdFiscalValido(tipo);
  // }

  // const onIdFiscalCambiado = (campo: string, valor: any) => {
  //   const idFiscalNuevo = {
  //     ...idFiscal,
  //     [campo]: valor,
  //   };
    
  //   console.log("campo cambiado", campo, 'valor = ', valor);
  //   setIdFiscal(idFiscalNuevo);
  // }

  const onIdFiscalCambiadoCallback = (idFiscal: any) => {
    const nuevaEntidad = { ...entidad, ...idFiscal };
    setEntidad(nuevaEntidad);
    onEntidadActualizada && onEntidadActualizada(nuevaEntidad);
  }

  // const guardarIdFiscal = async() => {
  //   if (!entidad) {
  //     return;
  //   }
  //   await simularApi();
    
  //   const nuevaEntidad = { ...entidad, ...idFiscal };
  //   setEntidad(nuevaEntidad);
  //   onEntidadActualizada && onEntidadActualizada(nuevaEntidad);
  // }

  // const simularApi = async () => {
  //   const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  //   console.log("Simulando API");
  //   await delay(500);
  //   console.log("Simulando API terminado");
  // }

  // const [entidad, setEntidad] = useState(null);
  const onCampoCambiado = (campo: string, valor: any) => {
    console.log("campo cambiado", campo, 'valor = ', valor);
    const campoDestino = campo === "id_fiscal2" ? "agente_id" : campo;
    const nuevaEntidad = entidad ? { ...entidad, [campoDestino]: valor } : null;
    setEntidad(nuevaEntidad);
    // setEntidad((entidad) => {
    //   if (!entidad) {
    //     return null;
    //   }
    //   return { ...entidad, [campoDestino]: valor };
    // });

    onEntidadActualizada && onEntidadActualizada(nuevaEntidad);
  };
  // const campoIdFiscal = camposCliente.find((c) => c.nombre === "id_fiscal");
  // const campoTipoIdFiscal = camposCliente.find((c) => c.nombre === "tipo_id_fiscal");

  return (
    <Detalle
      id={clienteId ?? "0"}
      camposEntidad={camposCliente}
      acciones={accionesCliente}
      obtenerTitulo={titulo}
      onCampoCambiado={onCampoCambiado}
      setEntidad={setEntidad}
      entidad={entidad}
    >
      <IdFiscal
        cliente={entidad}
        // onIdFiscalCambiado={onIdFiscalCambiado}
        onIdFiscalCambiadoCallback={onIdFiscalCambiadoCallback}
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
