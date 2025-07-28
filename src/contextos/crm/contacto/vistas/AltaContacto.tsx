import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";

import { metaNuevoContacto, nuevoContactoVacio } from "../dominio.ts";
import { getContacto, postContacto } from "../infraestructura.ts";
import "./AltaContacto.css";

export const AltaContacto = ({
  emitir = () => {},
}: {
  emitir?: EmitirEvento;
}) => {
  const nuevoContacto = useModelo(metaNuevoContacto, nuevoContactoVacio);

  const guardar = async () => {
    const id = await postContacto(nuevoContacto.modelo);
    const leadCreado = await getContacto(id);
    emitir("CONTACTO_CREADO", leadCreado);
  };

  return (
    <div className="AltaContacto">
      <h2>Nuevo Contacto</h2>
      <quimera-formulario>
        <QInput label="Nombre" {...nuevoContacto.uiProps("nombre")} />
        <QInput label="Email" {...nuevoContacto.uiProps("email")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevoContacto.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
