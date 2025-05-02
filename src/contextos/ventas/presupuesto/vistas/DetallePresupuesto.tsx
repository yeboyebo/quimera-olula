import { useParams } from "react-router";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Presupuesto } from "../diseño.ts";
import { metaPresupuesto, presupuestoVacio } from "../dominio.ts";
import { aprobarPresupuesto, getPresupuesto, patchPresupuesto } from "../infraestructura.ts";
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

  const ctxPresupuesto = useModelo(
    metaPresupuesto,
    presupuestoVacio()
  );
  const { modelo, modelo_inicial, init } = ctxPresupuesto;

  const onGuardarClicked = async () => {
      await patchPresupuesto(modelo.id, modelo);
      const presupuesto_guardado = await getPresupuesto(modelo.id);
      init(presupuesto_guardado);
      onEntidadActualizada(modelo);
    };
    console.log("TabDatos", modelo_inicial.tasa_conversion, modelo.tasa_conversion);

  const recargarCabecera = async () => {
    const nuevoPresupuesto = await getPresupuesto(modelo.id);
    init(nuevoPresupuesto);
    onEntidadActualizada(nuevoPresupuesto);
  };

  const aprobarClicked = async () => {
    await aprobarPresupuesto(modelo.id);
    const presupuesto_aprobado = await getPresupuesto(modelo.id);
    init(presupuesto_aprobado);
    onEntidadActualizada(presupuesto_aprobado);
  };

  return (
    <Detalle
      id={presupuestoId}
      obtenerTitulo={titulo}
      setEntidad={(p) => init(p)}
      entidad={modelo}
      cargar={getPresupuesto}
    >
      {!!presupuestoId && (
        <>
          { !modelo.aprobado && (
            <div className="botones maestro-botones ">
              <QBoton
                onClick={aprobarClicked}
              >
                Aprobar
              </QBoton>
            </div>
          )}
          <Tabs
            children={[
              <Tab key="tab-1"label="Cliente" children={
                  <TabCliente
                    ctxPresupuesto={ctxPresupuesto}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
              <Tab key="tab-2" label="Datos" children={
                  <TabDatos
                    ctxPresupuesto={ctxPresupuesto}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
              <Tab key="tab-3" label="Observaciones" children={
                  <TabObservaciones 
                    ctxPresupuesto={ctxPresupuesto}
                    onEntidadActualizada={onEntidadActualizada}
                  />
                }
              />,
            ]}
          ></Tabs>
          { ctxPresupuesto.modificado && (
            <div className="botones maestro-botones ">
              <QBoton
                onClick={onGuardarClicked}
                deshabilitado={!ctxPresupuesto.valido}
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
                }).format(Number(modelo.neto ?? 0))}
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
                }).format(Number(modelo.total_iva ?? 0))}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                Total:
              </label>
              <span>
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: String(modelo.coddivisa ?? "EUR"),
                }).format(Number(modelo.total ?? 0))}
              </span>
            </div>
          </div>

          {/* Componente Lineas */}
          <Lineas
            presupuesto={ctxPresupuesto}
            onCabeceraModificada={recargarCabecera}
          />
        </>
      )}
    </Detalle>
  );
};
