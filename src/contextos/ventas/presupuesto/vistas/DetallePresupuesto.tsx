import { useReducer } from "react";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import estilos from "../../../../componentes/detalle/detalle.module.css";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { initEstadoObjetoValor, makeReductor } from "../../../comun/dominio.ts";
import { Presupuesto } from "../diseño.ts";
import { metaPresupuesto } from "../dominio.ts";
import {
  getPresupuesto,
  patchCambiarAgente,
  patchCambiarDivisa,
} from "../infraestructura.ts";
import "./DetallePresupuesto.css";

export const DetallePresupuesto = ({
  presupuestoInicial = null,
  onEntidadActualizada = () => {},
}: {
  presupuestoInicial?: Presupuesto | null;
  onEntidadActualizada?: (entidad: Presupuesto) => void;
}) => {
  const { detalle } = estilos;

  const [estado, dispatch] = useReducer(
    makeReductor(metaPresupuesto),
    initEstadoObjetoValor(
      presupuestoInicial ?? { id: "", codigo: "" },
      metaPresupuesto
    )
  );

  const setCampo = (campo: string) => (valor: string) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor },
    });
  };

  const getProps = (campo: string) => {
    return {
      valor: estado.valor[campo],
      error: estado.validacion[campo]?.textoValidacion,
      bloqueado: estado.bloqueados.includes(campo),
    };
  };

  const guardarAgente = async (valor: string) => {
    await patchCambiarAgente(estado.valor.id, valor);
    const nuevoPresupuesto = await getPresupuesto(estado.valor.id);
    dispatch({ type: "init", payload: { entidad: nuevoPresupuesto } });
    onEntidadActualizada(nuevoPresupuesto);
  };

  const guardarDivisa = async (valor: string) => {
    await patchCambiarDivisa(estado.valor.id, valor);
    const nuevoPresupuesto = await getPresupuesto(estado.valor.id);
    dispatch({ type: "init", payload: { entidad: nuevoPresupuesto } });
    onEntidadActualizada(nuevoPresupuesto);
  };

  return (
    <div className={detalle}>
      <Detalle
        id={estado.valor.id}
        obtenerTitulo={(presupuesto) => `${presupuesto.codigo}`}
        setEntidad={(p) => dispatch({ type: "init", payload: { entidad: p } })}
        entidad={estado.valor}
        cargar={getPresupuesto}
      >
        <Tabs
          children={[
            <Tab
              key="tab-1"
              label="Cliente"
              children={
                <>
                  <QInput
                    label="Nombre Cliente"
                    nombre="nombre_cliente"
                    onChange={setCampo("nombre_cliente")}
                    {...getProps("nombre_cliente")}
                  />
                  <QInput
                    label="ID Fiscal"
                    nombre="id_fiscal"
                    onChange={setCampo("id_fiscal")}
                    {...getProps("id_fiscal")}
                  />
                </>
              }
            />,
            <Tab
              key="tab-2"
              label="Datos"
              children={
                <>
                  <QSelect
                    label="Divisa"
                    nombre="divisa_id"
                    onChange={guardarDivisa}
                    {...getProps("divisa_id")}
                  />
                  <QInput
                    label="Agente"
                    nombre="agente_id"
                    onChange={guardarAgente}
                    {...getProps("agente_id")}
                  />
                </>
              }
            />,
            <Tab
              key="tab-3"
              label="Observaciones"
              children={
                <QInput
                  label="Observaciones"
                  nombre="observaciones"
                  onChange={setCampo("observaciones")}
                  {...getProps("observaciones")}
                />
              }
            />,
          ]}
        />
      </Detalle>
    </div>
  );
};
