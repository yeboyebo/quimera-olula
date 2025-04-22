import { useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import {
  Accion,
  entidadModificada,
  EstadoObjetoValor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { Presupuesto } from "../diseño.ts";
import {
  getPresupuesto,
  obtenerOpcionesSelector,
  patchPresupuesto,
} from "../infraestructura.ts";

interface TabDatosProps {
  getProps: (campo: string) => Record<string, unknown>;
  setCampo: (campo: string) => (valor: unknown) => void;
  presupuesto: EstadoObjetoValor<Presupuesto>;
  dispatch: (action: Accion<Presupuesto>) => void;
  onEntidadActualizada: (entidad: Presupuesto) => void;
}

export const TabDatos = ({
  getProps,
  setCampo,
  presupuesto,
  onEntidadActualizada,
  dispatch,
}: TabDatosProps) => {
  const [opcionesDivisa, setOpcionesDivisa] = useState<
    { valor: string; descripcion: string }[]
  >([]);
  const [_, setGuardando] = useState<boolean>(false);

  useEffect(() => {
    const cargarOpcionesDivisa = async () => {
      const opciones = await obtenerOpcionesSelector("divisa")();
      const opcionesMapeadas = opciones.map((opcion) => ({
        valor: opcion[0],
        descripcion: opcion[1],
      }));
      setOpcionesDivisa(opcionesMapeadas);
    };

    cargarOpcionesDivisa();
  }, []);

  const onGuardarClicked = async () => {
    setGuardando(true);
    await patchPresupuesto(presupuesto.valor.id, presupuesto.valor);
    const presupuesto_guardado = await getPresupuesto(presupuesto.valor.id);
    dispatch({ type: "init", payload: { entidad: presupuesto_guardado } });
    setGuardando(false);
    onEntidadActualizada(presupuesto.valor);
  };

  return (
    <>
      <quimera-formulario>
        <QSelect
          label="Divisa"
          nombre="divisa_id"
          onChange={(opcion) => setCampo("divisa_id")(opcion?.valor)}
          opciones={opcionesDivisa}
          {...getProps("divisa_id")}
        />
        <QInput
          label="Agente"
          nombre="agente_id"
          onChange={setCampo("agente_id")}
          {...getProps("agente_id")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={onGuardarClicked}
          deshabilitado={!puedoGuardarObjetoValor(presupuesto)}
        >
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => {
            dispatch({
              type: "init",
              payload: { entidad: presupuesto.valor_inicial },
            });
          }}
          deshabilitado={!entidadModificada(presupuesto)}
        >
          Cancelar
        </QBoton>
      </div>
    </>
  );
};
