import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import {
  Accion,
  entidadModificada,
  EstadoObjetoValor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { Agente } from "../../comun/componentes/agente.tsx";
import { Divisas } from "../../comun/componentes/divisa.tsx";
import { Presupuesto } from "../diseño.ts";
import { getPresupuesto, patchPresupuesto } from "../infraestructura.ts";
import "./TabDatos.css";

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
  const onGuardarClicked = async () => {
    await patchPresupuesto(presupuesto.valor.id, presupuesto.valor);
    const presupuesto_guardado = await getPresupuesto(presupuesto.valor.id);
    dispatch({ type: "init", payload: { entidad: presupuesto_guardado } });
    onEntidadActualizada(presupuesto.valor);
  };

  return (
    <>
      <quimera-formulario>
        <Divisas
          valor={presupuesto.valor.divisa_id}
          onChange={(opcion) => setCampo("divisa_id")(opcion?.valor)}
          getProps={getProps}
        />
        <Agente
          valor={presupuesto.valor.agente_id ?? ""}
          descripcion={presupuesto.valor.nombre_agente}
          onChange={setCampo("agente_id")}
        />
      </quimera-formulario>
      <div className="botones maestro-botones ">
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
