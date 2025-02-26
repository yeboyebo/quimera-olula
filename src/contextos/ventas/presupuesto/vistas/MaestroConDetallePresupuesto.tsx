import { useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { Contexto } from "../../../comun/contexto.ts";
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

  const actualizarPresupuesto = (presupuesto: Presupuesto) => {
    setEntidades([
      ...entidades.map((p) => (p.id !== presupuesto.id ? p : presupuesto)),
    ]);
  };

  const obtenerUno = async () => {
    return seleccionada as Presupuesto;
  };

  const AccionesPresupuestoMaestroConDetalle = {
    ...accionesPresupuesto,
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
          acciones={{
            ...accionesPresupuesto,
            actualizarUno: async (id, presupuesto) => {
              accionesPresupuesto.actualizarUno(id, presupuesto).then(() => {
                actualizarPresupuesto(presupuesto);
              });
            },
            crearUno: async (presupuesto) => {
              accionesPresupuesto.crearUno(presupuesto).then(() => {
                obtenerUno().then((nuevoPresupuesto) => {
                  setEntidades([...entidades, nuevoPresupuesto]);
                });
              });
            },
          }}
          obtenerTitulo={titulo}
        />
      </div>
    </div>
  );
};
