import { useParams } from "react-router";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { modeloEsValido, modeloModificado } from "../../../comun/dominio.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Presupuesto } from "../diseño.ts";
import { metaPresupuesto, presupuestoVacio } from "../dominio.ts";
import { getPresupuesto, patchPresupuesto } from "../infraestructura.ts";
import "./DetallePresupuesto.css";
import { Lineas } from "./Lineas.tsx";
import { TabCliente } from "./TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";


type ParamOpcion = {
  valor: string;
  descripcion?: string
};
export type ValorControl = null | string | ParamOpcion;

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

  // const [presupuesto, dispatch] = useReducer(
  //   makeReductor(metaPresupuesto),
  //   initEstadoPresupuestoVacio()
  // );
  const ctxPresupuesto = useModelo(
    metaPresupuesto,
    presupuestoVacio()
  );
  const [presupuesto, _, init] = ctxPresupuesto;

  const onGuardarClicked = async () => {
      await patchPresupuesto(presupuesto.valor.id, presupuesto.valor);
      const presupuesto_guardado = await getPresupuesto(presupuesto.valor.id);
      init(presupuesto_guardado);
      onEntidadActualizada(presupuesto.valor);
    };
    console.log("TabDatos", presupuesto.valor_inicial.tasa_conversion, presupuesto.valor.tasa_conversion);

  // const setCampo = (campo: string, segundo?: string) => (_valor: ValorControl) => {
    
  //   let valor = _valor;
  //   let descripcion: string | undefined = undefined;
  //   if (typeof _valor === "object" && _valor && 'valor' in _valor) {
  //     valor = _valor.valor;
  //     if (segundo) {
  //       descripcion = _valor.descripcion;
  //     }
  //   }

  //   dispatch({
  //     type: "set_campo",
  //     payload: { campo, valor: valor as string },
  //   });

  //   if (segundo && descripcion) {
  //     dispatch({
  //       type: "set_campo",
  //       payload: { campo: segundo, valor: descripcion },
  //     });
  //   }
  // };

  // const getProps = (campo: string) => {
  //   return campoModeloAInput(presupuesto, campo);
  // };

  const recargarCabecera = async () => {
    const nuevoPresupuesto = await getPresupuesto(presupuesto.valor.id);
    // dispatch({ type: "init", payload: { entidad: nuevoPresupuesto } });
    init(nuevoPresupuesto);
    onEntidadActualizada(nuevoPresupuesto);
  };

  return (
    <Detalle
      id={presupuestoId}
      obtenerTitulo={titulo}
      // setEntidad={(p) => dispatch({ type: "init", payload: { entidad: p } })}
      setEntidad={(p) => init(p)}
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
                    ctxPresupuesto={ctxPresupuesto}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={
                  <TabDatos
                    ctxPresupuesto={ctxPresupuesto}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={
                  <TabObservaciones 
                    ctxPresupuesto={ctxPresupuesto}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
            ]}
          ></Tabs>
          { modeloModificado(presupuesto) && (
            <div className="botones maestro-botones ">
              <QBoton
                onClick={onGuardarClicked}
                deshabilitado={!modeloEsValido(presupuesto)}
              >
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => init()}
                // deshabilitado={!modeloModificado(presupuesto)}
              >
                Cancelar
              </QBoton>
            </div>
          )}

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
