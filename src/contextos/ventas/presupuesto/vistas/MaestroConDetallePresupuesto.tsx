import { useCallback, useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { EntidadAccion } from "../../../comun/diseño.ts";
import { crearAccionesRelacionadas } from "../../../comun/infraestructura.ts";
import { Presupuesto } from "../diseño.ts";
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
  const { seleccionada, entidades, setEntidades } = context;

  const titulo = (presupuesto: Presupuesto) => presupuesto.codigo as string;

  const actualizarUno = useCallback(
    async (id: string, presupuesto: Presupuesto) => {
      const actualizarPresupuesto = (presupuesto: Presupuesto) => {
        setEntidades([
          ...entidades.map((p) => (p.id !== presupuesto.id ? p : presupuesto)),
        ]);
      };

      await accionesPresupuesto.actualizarUno(id, presupuesto);
      actualizarPresupuesto(presupuesto);
    },
    [entidades, setEntidades]
  );

  const crearUno = useCallback(
    async (presupuesto: Presupuesto) => {
      await accionesPresupuesto.crearUno(presupuesto);
      const nuevoPresupuesto = await accionesPresupuesto.obtenerUno(
        presupuesto.id
      );
      if (nuevoPresupuesto) {
        setEntidades([...entidades, nuevoPresupuesto]);
      }
    },
    [entidades, setEntidades]
  );

  const obtenerUno = useCallback(async (id: string) => {
    const entidadAccion = await accionesPresupuesto.obtenerUno(id);
    return entidadAccion as Presupuesto | null;
  }, []);

  const obtenerTodos = useCallback(async () => {
    const entidades = await accionesPresupuesto.obtenerTodos();
    return entidades as Presupuesto[];
  }, []);

  const buscar = async (campo: string, valor: string) => {
    if (accionesPresupuesto.buscar) {
      const resultados = await accionesPresupuesto.buscar(campo, valor);
      return resultados as Presupuesto[];
    }
    return [];
  };

  const AccionesPresupuestoMaestroConDetalle = {
    ...accionesPresupuesto,
    actualizarUno,
    crearUno,
    obtenerUno,
    obtenerTodos,
    buscar: buscar,
  };

  const clienteId =
    seleccionada && "cliente_id" in seleccionada
      ? seleccionada.cliente_id
      : "0";

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Maestro
          acciones={AccionesPresupuestoMaestroConDetalle}
          camposEntidad={camposPresupuesto}
        />
      </div>
      <div className="Detalle" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Detalle
          id={seleccionada?.id ?? "0"}
          camposEntidad={camposPresupuesto}
          acciones={AccionesPresupuestoMaestroConDetalle}
          obtenerTitulo={titulo}
        >
          <Tabs
            children={[
              <Tab
                key="tab-2"
                label="Lineas"
                children={
                  <SubVista>
                    <Maestro
                      Acciones={MaestroAccionesLineasPresupuesto}
                      acciones={crearAccionesRelacionadas<EntidadAccion>(
                        "presupuesto",
                        "linea",
                        seleccionada?.id || "0"
                      )}
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
