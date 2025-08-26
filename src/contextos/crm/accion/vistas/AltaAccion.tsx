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

export const AltaAccion = ({
  emitir = () => {},
  idIncidencia = '',
  activo= false
}: {
  emitir?: EmitirEvento;
  idIncidencia?: string;
  activo: boolean;
}) => {

  const accion = useModelo(metaNuevaAccion, {
    ...nuevaAccionVacia,
    incidencia_id: idIncidencia,
  });

  const cancelar = () => {
    emitir("creacion_cancelada");
    accion.init();
  };


  return (
    <Mostrar modo="modal" activo={activo}
      onCerrar={cancelar}
    >
      <FormAltaAccion
        emitir={emitir}
        accion={accion}
        />
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
        <Usuario {...accion.uiProps("usuario_id")} label='Responsable'/>
        <QInput label="Incidencia" {...accion.uiProps("incidencia_id")} />
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

// export const AltaAccion = ({
//   emitir = () => {},
//   idIncidencia = '',
// }: {
//   emitir?: EmitirEvento;
//   idIncidencia?: string;
// }) => {
//   console.log("idIncidencia en AltaAccion:", idIncidencia);
//   const nuevaAccion = useModelo(metaNuevaAccion, {
//     ...nuevaAccionVacia,
//     incidencia_id: idIncidencia,
//   });
//   const { intentar } = useContext(ContextoError);

//   const guardar = async () => {
//     const modelo = {
//       ...nuevaAccion.modelo,
//     };
//     const id = await intentar(() => postAccion(modelo));
//     const accionCreada = await getAccion(id);
//     emitir("ACCION_CREADA", accionCreada);
//     nuevaAccion.init();
//   };

//   const cancelar = () => {
//     emitir("ALTA_CANCELADA");
//     nuevaAccion.init();
//   };

//   return (
//     <div className="AltaAccion">
//       <h2>Nueva Acción</h2>
//       <quimera-formulario>
//         <QInput label="Descripción" {...nuevaAccion.uiProps("descripcion")} />
//         <QInput label="Fecha" {...nuevaAccion.uiProps("fecha")} />
//         <Usuario {...nuevaAccion.uiProps("usuario_id")} label='Responsable'/>
//         <QInput label="Incidencia" {...nuevaAccion.uiProps("incidencia_id")} />
//       </quimera-formulario>
//       <div className="botones">
//         <QBoton onClick={guardar} deshabilitado={!nuevaAccion.valido}>
//           Guardar
//         </QBoton>
//         <QBoton onClick={cancelar} variante="texto">
//           Cancelar
//         </QBoton>
//       </div>
//     </div>
//   );
// };
