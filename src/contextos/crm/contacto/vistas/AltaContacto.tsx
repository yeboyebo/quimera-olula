import { useContext } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { Mostrar } from "../../../../componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { metaNuevoContacto, nuevoContactoVacio } from "../dominio.ts";
import { getContacto, postContacto } from "../infraestructura.ts";
import "./AltaContacto.css";

export const AltaContacto = ({
  publicar = () => {},
  activo = false,
}: {
  publicar?: EmitirEvento;
  activo?: boolean;
}) => {
  const nuevoContacto = useModelo(metaNuevoContacto, {
    ...nuevoContactoVacio,
  });
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postContacto(nuevoContacto.modelo));
    const contactoCreado = await getContacto(id);
    publicar("contacto_creado", contactoCreado);
    nuevoContacto.init();
  };

  const cancelar = () => {
    publicar("creacion_cancelada");
    nuevoContacto.init();
  };

  return (
    <Mostrar modo="modal" activo={!!activo} onCerrar={cancelar}>
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
          <QBoton onClick={cancelar} variante="texto">
            Cancelar
          </QBoton>
        </div>
      </div>
    </Mostrar>
  );
};
