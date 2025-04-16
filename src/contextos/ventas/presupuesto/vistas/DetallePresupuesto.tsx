import { useReducer } from "react";
import { useParams } from "react-router";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import {
  campoObjetoValorAInput,
  makeReductor,
} from "../../../comun/dominio.ts";
import { Presupuesto } from "../diseño.ts";
import { initEstadoPresupuestoVacio, metaPresupuesto } from "../dominio.ts";
import { getPresupuesto } from "../infraestructura.ts";
import "./DetallePresupuesto.css";
import { Lineas } from "./Lineas.tsx";
import { TabCliente } from "./TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";

export const DetallePresupuesto = ({
  presupuestoInicial = null,
  onEntidadActualizada = () => {},
}: {
  presupuestoInicial?: Presupuesto | null;
  onEntidadActualizada?: (entidad: Presupuesto) => void;
}) => {
  const params = useParams();

  const presupuestoId = presupuestoInicial?.id ?? params.id;
  const titulo = (presupuesto: Entidad) => presupuesto.codigo as string;

  const [presupuesto, dispatch] = useReducer(
    makeReductor(metaPresupuesto),
    initEstadoPresupuestoVacio()
  );

  const setCampo = (campo: string) => (valor: unknown) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor: valor as string },
    });
  };

  const getProps = (campo: string) => {
    return campoObjetoValorAInput(presupuesto, campo);
  };

  const recargarCabecera = async () => {
    const nuevoPresupuesto = await getPresupuesto(presupuesto.valor.id);
    dispatch({ type: "init", payload: { entidad: nuevoPresupuesto } });
    onEntidadActualizada(nuevoPresupuesto);
  };

  return (
    <Detalle
      id={presupuestoId}
      obtenerTitulo={titulo}
      setEntidad={(p) => dispatch({ type: "init", payload: { entidad: p } })}
      entidad={presupuesto.valor}
      cargar={getPresupuesto}
    >
      {!!presupuestoId && (
        <>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <TabCliente
                    getProps={getProps}
                    setCampo={setCampo}
                    presupuesto={presupuesto}
                    dispatch={dispatch}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={
                  <TabDatos
                    getProps={getProps}
                    setCampo={setCampo}
                    presupuesto={presupuesto}
                    dispatch={dispatch}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
            ]}
          ></Tabs>

          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                Neto:
              </label>
              <span>
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                }).format(Number(presupuesto.valor.neto ?? 0))}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                Total IVA:
              </label>
              <span>
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                }).format(Number(presupuesto.valor.total_iva ?? 0))}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                Total:
              </label>
              <span>
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: String(presupuesto.valor.coddivisa ?? "EUR"),
                }).format(Number(presupuesto.valor.total ?? 0))}
              </span>
            </div>
          </div>

          {/* Componente Lineas */}
          <Lineas
            presupuestoId={presupuesto.valor.id}
            onCabeceraModificada={recargarCabecera}
          />
        </>
      )}
    </Detalle>
  );
};
