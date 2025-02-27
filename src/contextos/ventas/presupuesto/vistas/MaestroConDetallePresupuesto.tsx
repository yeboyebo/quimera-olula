import { useCallback, useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { EntidadAccion } from "../../../comun/diseño.ts";
import { crearAccionesRelacionadas } from "../../../comun/infraestructura.ts";
import { Presupuesto } from "../diseño.ts";
import { accionesPresupuesto } from "../infraestructura.ts";

export const MaestroConDetallePresupuesto = () => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada, entidades, setEntidades } = context;

  const titulo = (presupuesto: Presupuesto) => presupuesto.codigo;

  const camposPresupuesto: CampoFormularioGenerico[] = [
    { nombre: "id", etiqueta: "Código", tipo: "text", oculto: true },
    { nombre: "codigo", etiqueta: "Código", tipo: "text" },
    { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
    { nombre: "cliente_id", etiqueta: "ID Cliente", tipo: "text" },
    { nombre: "nombre_cliente", etiqueta: "Nombre Cliente", tipo: "text" },
    { nombre: "id_fiscal", etiqueta: "ID Fiscal", tipo: "text" },
    { nombre: "direccion_id", etiqueta: "ID Dirección", tipo: "text" },
  ];

  const camposLineasPresupuesto: CampoFormularioGenerico[] = [
    { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
    { nombre: "referencia", etiqueta: "Referencia", tipo: "text" },
    { nombre: "descripcion", etiqueta: "Descripción", tipo: "text" },
    { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
    { nombre: "pvp_unitario", etiqueta: "PVP Unitario", tipo: "number" },
    { nombre: "pvp_total", etiqueta: "PVP Total", tipo: "number" },
  ];

  const actualizarPresupuesto = (presupuesto: Presupuesto) => {
    setEntidades([
      ...entidades.map((p) => (p.id !== presupuesto.id ? p : presupuesto)),
    ]);
  };

  const actualizarUno = useCallback(
    async (id: string, presupuesto: Presupuesto) => {
      await accionesPresupuesto.actualizarUno(id, presupuesto);
      actualizarPresupuesto(presupuesto);
    },
    [accionesPresupuesto, actualizarPresupuesto]
  );

  const crearUno = useCallback(
    async (presupuesto: Presupuesto) => {
      await accionesPresupuesto.crearUno(presupuesto);
      const nuevoPresupuesto = await accionesPresupuesto.obtenerUno(
        presupuesto.id
      );
      setEntidades([...entidades, nuevoPresupuesto]);
    },
    [accionesPresupuesto, setEntidades]
  );

  const obtenerUno = useCallback(
    async (id: string) => {
      const entidadAccion = await accionesPresupuesto.obtenerUno(id);
      return entidadAccion as Presupuesto | null;
    },
    [accionesPresupuesto]
  );

  const AccionesPresupuestoMaestroConDetalle = {
    ...accionesPresupuesto,
    actualizarUno,
    crearUno,
    obtenerUno,
  };

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
          <h2>Direcciones</h2>
          <SubVista>
            <Maestro
              acciones={crearAccionesRelacionadas<EntidadAccion>(
                "presupuesto",
                "linea",
                seleccionada?.id ?? ""
              )}
              camposEntidad={camposLineasPresupuesto}
            />
          </SubVista>
        </Detalle>
      </div>
    </div>
  );
};
