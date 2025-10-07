import { useContext } from "react";
import { QBoton } from "../../../../../src/componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../src/componentes/atomos/qinput.tsx";
import { Mostrar } from "../../../../../src/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "../../../../../src/contextos/comun/contexto.ts";
import { EmitirEvento } from "../../../../../src/contextos/comun/diseño.ts";
import {
  HookModelo,
  useModelo,
} from "../../../../../src/contextos/comun/useModelo.ts";
import { Modulo } from "../diseño";
import { metaNuevoModulo, nuevoModuloVacio } from "../dominio.ts";
import { getModulo, postModulo } from "../infraestructura";

export const CrearModulo = ({
  emitir = () => {},
  activo = false,
}: {
  emitir?: EmitirEvento;
  activo: boolean;
}) => {
  const modulo = useModelo(metaNuevoModulo, { ...nuevoModuloVacio });

  const cancelar = () => {
    modulo.init();
    emitir("creacion_cancelada");
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaModulo emitir={emitir} modulo={modulo} />
    </Mostrar>
  );
};

const FormAltaModulo = ({
  emitir = () => {},
  modulo,
}: {
  emitir?: EmitirEvento;
  modulo: HookModelo<Partial<Modulo>>;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = { ...modulo.modelo };
    const id = await intentar(() => postModulo(modelo));
    const moduloCreado = await getModulo(id);
    emitir("modulo_creado", moduloCreado);
    modulo.init();
  };

  const cancelar = () => {
    emitir("creacion_cancelada");
    modulo.init();
  };

  return (
    <div className="CrearModulo">
      <h2>Nuevo Módulo</h2>
      {/* <quimera-formulario> */}
      <QInput label="Nombre" {...modulo.uiProps("nombre")} />
      <QInput label="Descripción" {...modulo.uiProps("descripcion")} />
      <QInput label="Estado" {...modulo.uiProps("estado")} />
      {/* </quimera-formulario> */}
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!modulo.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
