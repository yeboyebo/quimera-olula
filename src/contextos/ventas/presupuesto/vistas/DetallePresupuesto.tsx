import { PropsWithChildren, useEffect, useState } from "react";
import estilos from "../../../../componentes/detalle/detalle.module.css";
import { FormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { crearAccionesRelacionadas } from "../../../comun/infraestructura.ts";
import {
  AccionesLineaPresupuesto,
  AccionesPresupuesto,
  LineaPresupuesto,
  Presupuesto,
} from "../diseño.ts";
import {
  accionesPresupuesto,
  camposLineasPresupuestoAlta,
  camposPresupuesto,
} from "../infraestructura.ts";
import { MaestroAccionesLineasPresupuesto } from "./MaestroAccionesLineasPresupuesto.tsx";

interface DetallePresupuestoProps {
  id: string | null;
  acciones: AccionesPresupuesto;
  obtenerTitulo?: (entidad: Presupuesto) => string;
}

export function DetallePresupuesto({
  id,
  acciones,
  obtenerTitulo,
}: PropsWithChildren<DetallePresupuestoProps>) {
  const { detalle } = estilos;

  const [entidad, setEntidad] = useState<Presupuesto>({} as Presupuesto);

  const { obtenerUno } = acciones;

  useEffect(() => {
    if (id && id !== "") {
      obtenerUno(id)
        .then((entidad) => {
          setEntidad(entidad as Presupuesto);
        })
        .catch(() => {
          setEntidad({} as Presupuesto);
        });
    }
  }, [id, obtenerUno]);

  if (!id) {
    return <></>;
  }
  if (!entidad) {
    return <>No se ha encontrado el presupuesto</>;
  }

  const onCambiarCantidadLinea = async (
    id: string,
    linea: LineaPresupuesto
  ) => {
    if (entidad) {
      const objCambioLinea = {
        lineas: [{ linea_id: id, cantidad: linea.cantidad }],
      };
      accionesPresupuesto
        .actualizarUnElemento(
          entidad.id,
          objCambioLinea,
          "cambiar_cantidad_lineas"
        )
        .then(() => {
          accionesPresupuesto.obtenerUno(entidad.id).then((presupuesto) => {
            if (presupuesto) {
              setEntidad(presupuesto as Presupuesto);
              //   setEntidades(
              //     entidades.map((entidad) => {
              //       if (entidad.id === presupuesto.id) {
              //         return presupuesto;
              //       }
              //       return entidad;
              //     })
              //   );
            }
          });
        })
        .catch((error) => {
          console.error("Error al actualizar la línea de presupuesto:", error);
        });
    } else {
      console.error("Error: no hay entidad");
    }
  };

  const accionesLineasPresupuesto: AccionesLineaPresupuesto = {
    ...crearAccionesRelacionadas("presupuesto", "linea", entidad?.id || "0"),
    onCambiarCantidadLinea,
  };

  const actualizar = (data: Presupuesto) =>
    accionesPresupuesto.actualizarUno(id, data).then(() => {
      setEntidad(data as Presupuesto);
    });

  return (
    <div className={detalle}>
      {obtenerTitulo && <h2>{obtenerTitulo(entidad)}</h2>}
      <Tabs
        children={[
          <Tab
            key="tab-1"
            label="Cliente"
            children={
              <FormularioGenerico
                campos={camposPresupuesto}
                entidad={entidad}
                setEntidad={setEntidad}
                onSubmit={actualizar}
              />
            }
          />,
          <Tab
            key="tab-3"
            label="Observaciones"
            children={<div> Observaciones contenido </div>}
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
            }).format(Number(entidad?.neto ?? 0))}
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
            }).format(Number(entidad?.total_iva ?? 0))}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
            Total:
          </label>
          <span>
            {new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: (entidad?.coddivisa as string) ?? "EUR",
            }).format(Number(entidad?.total ?? 0))}
          </span>
        </div>
      </div>
      <SubVista>
        <Maestro
          Acciones={MaestroAccionesLineasPresupuesto}
          acciones={accionesLineasPresupuesto}
          camposEntidad={camposLineasPresupuestoAlta}
        />
      </SubVista>
    </div>
  );
}
