import { useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Entidad, EntidadAccion } from "../../../comun/diseño.ts";
import { crearAccionesRelacionadas } from "../../../comun/infraestructura.ts";
import {
  AccionesLineaPresupuesto,
  LineaPresupuesto,
  Presupuesto,
} from "../diseño.ts";
import {
  accionesPresupuesto,
  camposLineasPresupuesto,
  camposLineasPresupuestoAlta,
  camposPresupuesto,
} from "../infraestructura.ts";
import { MaestroAccionesLineasPresupuesto } from "./MaestroAccionesLineasPresupuesto.tsx";

export const MaestroConDetallePresupuesto = () => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada, setSeleccionada, entidades, setEntidades } = context;

  const titulo = (presupuesto: Entidad) =>
    (presupuesto as Presupuesto).codigo as string;

  const onCambiarCantidadLinea = async (
    id: string,
    linea: LineaPresupuesto
  ) => {
    if (seleccionada) {
      const objCambioLinea = {
        lineas: [{ linea_id: id, cantidad: linea.cantidad }],
      };
      accionesPresupuesto
        .actualizarUnElemento(
          seleccionada.id,
          objCambioLinea,
          "cambiar_cantidad_lineas"
        )
        .then(() => {
          accionesPresupuesto
            .obtenerUno(seleccionada.id)
            .then((presupuesto) => {
              if (presupuesto) {
                setSeleccionada(presupuesto);
                setEntidades(
                  entidades.map((entidad) => {
                    if (entidad.id === presupuesto.id) {
                      return presupuesto;
                    }
                    return entidad;
                  })
                );
              }
            });
        })
        .catch((error) => {
          console.error("Error al actualizar la línea de presupuesto:", error);
        });
    } else {
      console.error("Error: no hay seleccionada");
    }
  };

  const accionesPresupuestoMaestroConDetalle = {
    ...accionesPresupuesto,
  };

  const accionesLineasPresupuesto: AccionesLineaPresupuesto = {
    ...crearAccionesRelacionadas(
      "presupuesto",
      "linea",
      seleccionada?.id || "0"
    ),
    onCambiarCantidadLinea,
  };

  const clienteId =
    seleccionada && "cliente_id" in seleccionada
      ? seleccionada.cliente_id
      : "0";

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Maestro
          acciones={accionesPresupuestoMaestroConDetalle}
          camposEntidad={camposPresupuesto}
        />
      </div>
      <div className="Detalle" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Detalle
          id={seleccionada?.id ?? "0"}
          camposEntidad={camposPresupuesto}
          acciones={accionesPresupuestoMaestroConDetalle}
          obtenerTitulo={titulo}
        >
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
                }).format(Number(seleccionada?.neto ?? 0))}
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
                }).format(Number(seleccionada?.total_iva ?? 0))}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                Total:
              </label>
              <span>
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: (seleccionada?.coddivisa as string) ?? "EUR",
                }).format(Number(seleccionada?.total ?? 0))}
              </span>
            </div>
          </div>
          <Tabs
            children={[
              <Tab
                key="tab-2"
                label="Lineas"
                children={
                  <SubVista>
                    <Maestro
                      Acciones={MaestroAccionesLineasPresupuesto}
                      acciones={accionesLineasPresupuesto}
                      camposEntidad={camposLineasPresupuestoAlta}
                    />
                  </SubVista>
                }
              />,
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <SubVista>
                    <Maestro
                      acciones={crearAccionesRelacionadas<EntidadAccion>(
                        "cliente",
                        "direcciones",
                        clienteId as string
                      )}
                      camposEntidad={camposLineasPresupuesto}
                    />
                  </SubVista>
                }
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<div> Observaciones contenido </div>}
              />,
            ]}
          ></Tabs>
        </Detalle>
      </div>
    </div>
  );
};
