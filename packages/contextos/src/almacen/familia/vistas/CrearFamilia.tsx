import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { NuevaFamilia } from "../diseño.ts";
import { metaNuevaFamilia, nuevaFamiliaVacia } from "../dominio.ts";
import { getFamilia, postFamilia } from "../infraestructura.ts";
import "./CrearFamilia.css";

export const CrearFamilia = ({
  publicar = () => {},
  activo = false,
}: {
  publicar?: EmitirEvento;
  activo: boolean;
}) => {
  const familia = useModelo(metaNuevaFamilia, {
    ...nuevaFamiliaVacia,
  });

  const cancelar = () => {
    familia.init();
    publicar("creacion_cancelada");
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaFamilia publicar={publicar} familia={familia} />
    </Mostrar>
  );
};

const FormAltaFamilia = ({
  publicar = () => {},
  familia,
}: {
  publicar?: EmitirEvento;
  familia: HookModelo<NuevaFamilia>;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = {
      ...familia.modelo,
    };
    const id = await intentar(() => postFamilia(modelo));
    const familiaCreada = await getFamilia(id);
    publicar("familia_creada", familiaCreada);
    familia.init();
  };

  const cancelar = () => {
    publicar("creacion_cancelada");
    familia.init();
  };

  return (
    <div className="CrearFamilia">
      <h2>Nueva Familia</h2>
      <quimera-formulario>
        <QInput label="Código familia" {...familia.uiProps("id")} />
        <QInput label="Descripción" {...familia.uiProps("descripcion")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!familia.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
