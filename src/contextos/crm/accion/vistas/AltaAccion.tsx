import { useContext } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { Mostrar } from "../../../../componentes/moleculas/Mostrar.tsx";
import { Usuario } from "../../../comun/componentes/usuario.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { HookModelo, useModelo } from "../../../comun/useModelo.ts";
import { NuevaAccion } from "../diseño.ts";
import { metaNuevaAccion, nuevaAccionVacia } from "../dominio.ts";
import { getAccion, postAccion } from "../infraestructura.ts";
import "./AltaAccion.css";

// type Relacionados = {
//   incidencia_id?: string;
//   tarjeta_id?: string;
//   oportunidad_id?: string;
//   contacto_id?: string;
//   cliente_id?: string;
// };

// const accion = useModelo(metaNuevaAccion, {
//   ...nuevaAccionVacia,
//   ...relacionados,
// });

export const AltaAccion = ({
  emitir = () => {},
  idIncidencia = "",
  idLead = "",
  idOportunidadVenta = "",
  idContacto = "",
  idCliente = "",
  activo = false,
}: {
  emitir?: EmitirEvento;
  idIncidencia?: string;
  idLead?: string;
  idOportunidadVenta?: string;
  idContacto?: string;
  idCliente?: string;
  activo: boolean;
}) => {
  const accion = useModelo(metaNuevaAccion, {
    ...nuevaAccionVacia,
    incidencia_id: idIncidencia,
    tarjeta_id: idLead,
    oportunidad_id: idOportunidadVenta,
    contacto_id: idContacto,
    cliente_id: idCliente,
  });

  const cancelar = () => {
    emitir("creacion_cancelada");
    accion.init();
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaAccion emitir={emitir} accion={accion} />
    </Mostrar>
  );
};

const FormAltaAccion = ({
  emitir = () => {},
  accion,
}: {
  emitir?: EmitirEvento;
  accion: HookModelo<NuevaAccion>;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = {
      ...accion.modelo,
    };
    const id = await intentar(() => postAccion(modelo));
    const accionCreada = await getAccion(id);
    emitir("accion_creada", accionCreada);
    accion.init();
  };

  const cancelar = () => {
    emitir("creacion_cancelada");
    accion.init();
  };

  return (
    <div className="FormAltaAccion">
      <h2>Nueva Acción</h2>
      <quimera-formulario>
        <QInput label="Descripción" {...accion.uiProps("descripcion")} />
        <QInput label="Fecha" {...accion.uiProps("fecha")} />
        <Usuario
          {...accion.uiProps("usuario_id, descripcion")}
          label="Responsable"
        />
        {/* <QInput label="Incidencia" {...accion.uiProps("incidencia_id")} /> */}
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!accion.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
