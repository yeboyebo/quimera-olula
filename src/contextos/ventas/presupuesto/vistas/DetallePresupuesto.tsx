import { useParams } from "react-router";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
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
type Estado = "defecto";

export const DetallePresupuesto = ({
  presupuestoInicial = null,
  emitir = () => {},
}: {
  presupuestoInicial?: Presupuesto | null;
  emitir?: EmitirEvento
}) => {
  const params = useParams();

  const presupuestoId = presupuestoInicial?.id ?? params.id;
  const titulo = (presupuesto: Entidad) => presupuesto.codigo as string;

  const ctxPresupuesto = useModelo(
    metaPresupuesto,
    presupuestoVacio()
  );
  const { modelo, init } = ctxPresupuesto;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await patchPresupuesto(modelo.id, modelo);
        recargarCabecera();
      },
      APROBAR_INICIADO: async () => {
        await aprobarPresupuesto(modelo.id);
        recargarCabecera();
      },
      CLIENTE_PRESUPUESTO_CAMBIADO: async() => {
        await recargarCabecera();
      }
    },
  }
  const emitirPresupuesto = useMaquina(maquina, 'defecto', () => {});

  const recargarCabecera = async () => {
    const nuevoPresupuesto = await getPresupuesto(modelo.id);
    init(nuevoPresupuesto);
    emitir('PRESUPUESTO_CAMBIADO', nuevoPresupuesto);
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
                onClick={() => emitirPresupuesto('APROBAR_INICIADO')}
              > Aprobar </QBoton>
            </div>
          )}
          <Tabs
            children={[
              <Tab key="tab-1"label="Cliente" children={
                  <TabCliente
                  presupuesto={ctxPresupuesto}
                    publicar={emitirPresupuesto}
                  />
                }
              />,
              <Tab key="tab-2" label="Datos" children={
                  <TabDatos
                  presupuesto={ctxPresupuesto}
                  />
                }
              />,
              <Tab key="tab-3" label="Observaciones" children={
                  <TabObservaciones 
                    ctxPresupuesto={ctxPresupuesto}
                  />
                }
              />,
            ]}
          ></Tabs>
          { ctxPresupuesto.modificado && (
            <div className="botones maestro-botones ">
              <QBoton
                onClick={() => emitirPresupuesto('GUARDAR_INICIADO')}
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
          <Lineas
            presupuesto={ctxPresupuesto}
            onCabeceraModificada={recargarCabecera}
          />
        </>
      )}
    </Detalle>
  );
};
